#!/usr/bin/env python3
"""Generate Spirebound SFX from docs/sfx-ledger.md via ElevenLabs, trim silence, write manifest."""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "docs" / "sfx-ledger.md"
OUT = ROOT / "src" / "assets" / "sfx"
RAW = OUT / "_raw"
MANIFEST = OUT / "manifest.json"
SKIP = {"slash", "hit"}  # legacy — do not regenerate


def load_key() -> str:
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("missing ELEVENLABS_API_KEY in .env")


def parse_target_seconds(target: str) -> float:
    """Pick the high end of a '0.55-0.85s' target range (or a single value)."""
    nums = [float(x) for x in re.findall(r"([0-9]+(?:\.[0-9]+)?)", target)]
    if not nums:
        return 0.6
    return max(0.5, min(30.0, nums[-1]))


def parse_ledger(text: str) -> dict[str, dict]:
    rows: dict[str, dict] = {}
    # Current ledger: | `id` | usage | target | prompt | mix note |
    pat = re.compile(
        r"^\|\s*`([a-zA-Z][a-zA-Z0-9]*)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)\|",
        re.M,
    )
    for m in pat.finditer(text):
        sid, usage, target, prompt, note = m.groups()
        if sid in {"Id", "id"}:
            continue
        prompt = prompt.strip().strip("`")
        if not prompt or prompt.lower() in {"elevenlabs sfx prompt", "---"}:
            continue
        rows[sid] = {
            "id": sid,
            "usage": usage.strip(),
            "prompt": prompt,
            "duration_seconds": parse_target_seconds(target),
            "prompt_influence": 0.60,
            "review_note": note.strip(),
            "target": target.strip(),
        }
    return rows


def generate(key: str, prompt: str, duration: float, influence: float) -> bytes:
    body = json.dumps(
        {
            "text": prompt,
            "duration_seconds": duration,
            "prompt_influence": influence,
            "model_id": "eleven_text_to_sound_v2",
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/sound-generation",
        data=body,
        headers={
            "xi-api-key": key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as res:
        return res.read()


def trim_silence(src: Path, dst: Path) -> float:
    """Trim leading/trailing near-silence; keep quiet tails for short one-shots."""
    af = (
        "silenceremove=start_periods=1:start_duration=0.015:start_threshold=-46dB:"
        "stop_periods=1:stop_duration=0.12:stop_threshold=-46dB,"
        "apad=pad_dur=0.025"
    )
    af_lead_only = (
        "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,"
        "apad=pad_dur=0.02"
    )
    tmp = dst.with_suffix(".tmp.mp3")
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(src), "-af", af, "-codec:a", "libmp3lame", "-b:a", "128k",
            str(tmp),
        ],
        check=True,
    )
    dur = probe_duration(tmp)
    raw_dur = probe_duration(src)
    # Guard: empty, or trim ate most of a soft/quiet clip
    if dur < 0.12 or (raw_dur > 0 and dur / raw_dur < 0.4):
        tmp.unlink(missing_ok=True)
        subprocess.run(
            [
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(src), "-af", af_lead_only, "-codec:a", "libmp3lame", "-b:a", "128k",
                str(dst),
            ],
            check=True,
        )
        return probe_duration(dst)
    tmp.replace(dst)
    return dur


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "csv=p=0",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out or 0)


def main() -> int:
    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    key = load_key()
    rows = parse_ledger(LEDGER.read_text())
    if not rows:
        raise SystemExit("no ledger rows parsed")
    OUT.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)

    # Merge into existing manifest so subset runs never wipe siblings.
    manifest = {"theme": "Ashglass Vigil", "source": "docs/sfx-ledger.md", "items": {}}
    if MANIFEST.exists():
        try:
            old = json.loads(MANIFEST.read_text())
            if isinstance(old.get("items"), dict):
                manifest["items"].update(old["items"])
        except json.JSONDecodeError:
            pass

    ids = [sid for sid in rows if sid not in SKIP and (only is None or sid in only)]
    print(f"generating {len(ids)} sfx…", flush=True)
    ok = 0
    for i, sid in enumerate(ids, 1):
        row = rows[sid]
        raw = RAW / f"{sid}.mp3"
        final = OUT / f"{sid}.mp3"
        print(f"[{i}/{len(ids)}] {sid} ({row['duration_seconds']}s)…", flush=True)
        for attempt in range(4):
            try:
                data = generate(key, row["prompt"], row["duration_seconds"], row["prompt_influence"])
                if len(data) < 500:
                    raise RuntimeError(f"tiny response ({len(data)} bytes)")
                raw.write_bytes(data)
                dur = trim_silence(raw, final)
                manifest["items"][sid] = {
                    "file": f"{sid}.mp3",
                    "bytes": final.stat().st_size,
                    "duration_seconds": round(dur, 3),
                    "requested_duration_seconds": row["duration_seconds"],
                    "prompt_influence": row["prompt_influence"],
                    "prompt": row["prompt"],
                    "usage": row["usage"],
                    "review_note": row["review_note"],
                }
                print(f"  ok → {final.name} ({dur:.3f}s, {final.stat().st_size} B)", flush=True)
                ok += 1
                break
            except urllib.error.HTTPError as e:
                body = e.read().decode(errors="replace")[:240]
                print(f"  HTTP {e.code}: {body}", flush=True)
                if e.code == 429:
                    time.sleep(8 + attempt * 4)
                else:
                    time.sleep(2)
            except Exception as e:
                print(f"  err: {e}", flush=True)
                time.sleep(2)
        else:
            print(f"  FAILED {sid}", flush=True)
        time.sleep(0.35)

    # Preserve on-disk legacy files in manifest if still present
    for sid in SKIP:
        p = OUT / f"{sid}.mp3"
        if p.exists() and sid not in manifest["items"]:
            manifest["items"][sid] = {
                "file": f"{sid}.mp3",
                "bytes": p.stat().st_size,
                "duration_seconds": round(probe_duration(p), 3),
                "prompt": "(legacy — not regenerated)",
                "usage": "legacy",
            }

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"done: {ok}/{len(ids)} generated; manifest → {MANIFEST}", flush=True)
    return 0 if ok == len(ids) else 1


if __name__ == "__main__":
    raise SystemExit(main())
