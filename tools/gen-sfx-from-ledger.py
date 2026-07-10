#!/usr/bin/env python3
"""Generate a new versioned Spirebound SFX pack via ElevenLabs."""
from __future__ import annotations

import json
import hashlib
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "docs" / "sfx-ledger.md"
SFX_ROOT = ROOT / "src" / "assets" / "sfx"
RAW_ROOT = ROOT / "scratch" / "audio-raw"
IMMUTABLE_PACKS = {"ashglass-v1"}
GLOBAL_SFX_SUFFIX = (
    "No voice, no speech, no singing, no choir, no music, no melody, no arpeggio, "
    "no organ, no long reverb, no jump scare, no gore, no trailer boom, clean dry "
    "game one-shot, silence trimmed."
)
MAX_PROMPT_CHARS = 450
TRAILING_NEGATIVE_BLOCK = re.compile(r"\s+No voice,.*$", re.S)
FATIGUE_RISK_IDS = {"click", "hover", "draw", "chip", "coin", "atkHeroMed"}
TOP_RESTRAINT_IDS = {"poison", "energy", "victory", "ember", "art", "map"}
MIDRANGE_RESCUE_IDS = {"atkEnemyHeavy", "blocked", "potion", "stagger"}
TARGET_MEAN_DBFS = {
    "click": -26.0,
    "hover": -34.0,
    "card": -26.0,
    "draw": -30.0,
    "atkHeroLight": -25.0,
    "atkHeroMed": -22.5,
    "atkHeroHeavy": -20.0,
    "atkEnemyLight": -25.0,
    "atkEnemyMed": -22.5,
    "atkEnemyHeavy": -20.0,
    "slash": -26.0,
    "hit": -26.0,
    "blocked": -22.0,
    "block": -25.0,
    "poison": -26.0,
    "debuff": -25.0,
    "buff": -26.0,
    "heal": -25.0,
    "energy": -27.0,
    "coin": -28.0,
    "potion": -25.0,
    "death": -22.0,
    "bigDeath": -18.0,
    "turn": -27.0,
    "victory": -22.0,
    "defeat": -22.0,
    "relic": -23.0,
    "upgrade": -23.0,
    "map": -26.0,
    "chip": -28.0,
    "shatter": -19.0,
    "ember": -27.0,
    "kindle": -24.0,
    "stagger": -21.0,
    "art": -21.0,
    "omen": -20.0,
}
PEAK_CEILING_DBFS = -3.5


def load_key() -> str:
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if key:
        return key
    env_path = ROOT / ".env"
    if not env_path.exists():
        raise SystemExit("missing ELEVENLABS_API_KEY in environment or .env")
    for line in env_path.read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("missing ELEVENLABS_API_KEY in environment or .env")


def parse_target_range(target: str) -> tuple[float, float]:
    """Parse the intended post-trim range without applying API limits."""
    nums = [float(x) for x in re.findall(r"([0-9]+(?:\.[0-9]+)?)", target)]
    if not nums:
        raise ValueError(f"missing target-after-trim range: {target!r}")
    return nums[0], nums[-1]


def parse_ledger(text: str) -> dict[str, dict]:
    rows: dict[str, dict] = {}
    # V2 ledger: | `id` | usage | target | request | influence | prompt |
    pat = re.compile(
        r"^\|\s*`([a-zA-Z][a-zA-Z0-9]*)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*"
        r"([0-9]+(?:\.[0-9]+)?)\s*\|\s*([0-9]+(?:\.[0-9]+)?)\s*\|\s*([^|]+)\|\s*$",
        re.M,
    )
    for m in pat.finditer(text):
        sid, usage, target, requested, influence, prompt = m.groups()
        duration = float(requested)
        prompt_influence = float(influence)
        if not 0.5 <= duration <= 30:
            raise ValueError(f"{sid}: request duration must be 0.5-30 seconds")
        if not 0 <= prompt_influence <= 1:
            raise ValueError(f"{sid}: prompt influence must be 0-1")
        prompt = prompt.strip().strip("`")
        rows[sid] = {
            "id": sid,
            "usage": usage.strip(),
            "prompt": prompt,
            "target_after_trim_seconds": parse_target_range(target),
            "requested_duration_seconds": duration,
            "prompt_influence": prompt_influence,
            "review_note": f"Target after trim: {target.strip()}s",
            "target": target.strip(),
        }
    return rows


def generation_payload(row: dict) -> dict:
    positive_prompt = TRAILING_NEGATIVE_BLOCK.sub("", row["prompt"]).rstrip()
    text = f"{positive_prompt} {GLOBAL_SFX_SUFFIX}"
    if len(text) > MAX_PROMPT_CHARS:
        raise ValueError(
            f"{row['id']}: request text is {len(text)} characters; "
            f"ElevenLabs limit is {MAX_PROMPT_CHARS}"
        )
    return {
        "text": text,
        "loop": False,
        "duration_seconds": row["requested_duration_seconds"],
        "prompt_influence": row["prompt_influence"],
        "model_id": "eleven_text_to_sound_v2",
    }


def generate(key: str, row: dict) -> bytes:
    body = json.dumps(generation_payload(row)).encode()
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
    """Trim leading/trailing near-silence into a lossless working file."""
    af = (
        "silenceremove=start_periods=1:start_duration=0.004:start_threshold=-55dB:"
        "stop_periods=1:stop_duration=0.06:stop_threshold=-55dB"
    )
    af_lead_only = (
        "silenceremove=start_periods=1:start_duration=0.003:start_threshold=-58dB"
    )
    tmp = dst.with_name(f"{dst.stem}.tmp.wav")
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(src), "-af", af, "-codec:a", "pcm_s24le",
            str(tmp),
        ],
        check=True,
    )
    dur = probe_duration(tmp)
    raw_dur = probe_duration(src)
    # Guard: empty, or trim ate most of a soft/quiet clip
    if dur < 0.04 or (raw_dur > 0 and dur / raw_dur < 0.2):
        tmp.unlink(missing_ok=True)
        subprocess.run(
            [
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(src), "-af", af_lead_only, "-codec:a", "pcm_s24le",
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
    try:
        return float(out or 0)
    except ValueError:
        return 0.0


def target_fit_filter(target: float, source_duration: float, tempo_factor: float | None = None) -> str:
    """Fit without silence padding, stretching only a bounded short source."""
    if source_duration <= 0:
        raise ValueError("source duration must be positive")
    filters: list[str] = []
    if source_duration < target:
        tempo = tempo_factor if tempo_factor is not None else source_duration / target
        if tempo < 0.5:
            raise RuntimeError(
                f"trimmed source {source_duration:.3f}s is too short for {target:.3f}s target; "
                "regenerate instead of padding silence"
            )
        filters.append(f"atempo={tempo:.9f}")
    fade = min(0.015, target / 4)
    fade_start = max(0, target - fade)
    filters.extend([
        f"atrim=duration={target:.3f}",
        "asetpts=N/SR/TB",
        f"afade=t=out:st={fade_start:.3f}:d={fade:.3f}",
    ])
    return ",".join(filters)


def fit_target_duration(path: Path, target: float) -> float:
    """Crop or gently stretch to the authored target in a lossless work file."""
    source_duration = probe_duration(path)
    tmp = path.with_name(f"{path.stem}.fit.wav")
    tolerance = 0.002
    tempo = source_duration / target if source_duration < target else None
    actual = 0.0
    for _ in range(4):
        subprocess.run(
            [
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(path), "-af", target_fit_filter(target, source_duration, tempo),
                "-codec:a", "pcm_s24le", str(tmp),
            ],
            check=True,
        )
        actual = probe_duration(tmp)
        if abs(actual - target) <= tolerance:
            break
        if tempo is None or actual >= target:
            break
        # atempo uses overlap windows, so very short clips can land a few
        # milliseconds short. Adjust from the measured result and retry;
        # atrim then removes the deliberate signal overrun.
        tempo *= (actual / target) * 0.97
        if tempo < 0.5:
            break
    if abs(actual - target) > tolerance:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(
            f"encoded duration {actual:.3f}s misses exact target {target:.3f}s "
            f"beyond {tolerance:.3f}s MP3 tolerance"
        )
    tmp.replace(path)
    return actual


def mix_filter(sid: str) -> str:
    """Keep one-shots centred, phone-safe, and fatigue-resistant."""
    filters = [
        "highpass=f=90",
        "lowpass=f=9000:p=2",
        "pan=mono|c0=0.5*c0+0.5*c1",
    ]
    if sid in FATIGUE_RISK_IDS:
        filters.append("highshelf=f=4000:t=s:w=0.6:g=-12")
        filters.append("lowpass=f=5500:p=2")
        filters.append("equalizer=f=1800:t=q:w=1:g=4")
    if sid in TOP_RESTRAINT_IDS:
        filters.append("highshelf=f=5000:t=s:w=0.6:g=-10")
        filters.append("lowpass=f=7000:p=2")
    if sid in MIDRANGE_RESCUE_IDS:
        filters.append("highpass=f=280:p=2")
        filters.append("lowshelf=f=350:t=s:w=0.7:g=-10")
        filters.append("equalizer=f=1600:t=q:w=0.9:g=10")
    if sid == "death":
        filters.append("highshelf=f=5500:t=s:w=0.7:g=-7")
        filters.append("lowpass=f=7000:p=2")
    if sid == "shatter":
        filters.append("equalizer=f=3500:t=q:w=0.9:g=5")
        filters.append("lowpass=f=8000:p=2")
    if sid == "bigDeath":
        filters.append("highpass=f=240:p=2")
        filters.append("lowshelf=f=350:t=s:w=0.7:g=-12")
        filters.append("highshelf=f=4000:t=s:w=0.7:g=-14")
        filters.append("lowpass=f=5200:p=2")
        filters.append("equalizer=f=1200:t=q:w=0.9:g=10")
    filters.append("pan=stereo|c0=c0|c1=c0")
    return ",".join(filters)


def probe_volume(path: Path) -> tuple[float, float]:
    result = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-nostdin", "-i", str(path),
            "-af", "volumedetect", "-f", "null", "-",
        ],
        check=True,
        text=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    mean_match = re.search(r"mean_volume:\s*(-?[0-9.]+) dB", result.stderr)
    max_match = re.search(r"max_volume:\s*(-?[0-9.]+) dB", result.stderr)
    if not mean_match or not max_match:
        raise RuntimeError("ffmpeg volumedetect did not return finite mean/max volume")
    return float(mean_match.group(1)), float(max_match.group(1))


def finalise_mix(path: Path, final: Path, sid: str, target: float) -> dict:
    """Apply shared spectral/mono policy and deterministic family loudness."""
    premix = path.with_name(f"{path.stem}.premix.wav")
    mixed = path.with_name(f"{path.stem}.mix.wav")
    levelled = path.with_name(f"{path.stem}.level.wav")
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(path), "-af", mix_filter(sid), "-ar", "48000",
            "-codec:a", "pcm_s24le", str(premix),
        ],
        check=True,
    )
    trim_silence(premix, mixed)
    fit_target_duration(mixed, target)
    premix.unlink(missing_ok=True)
    mean_dbfs, max_dbfs = probe_volume(mixed)
    target_mean = TARGET_MEAN_DBFS[sid]
    gain_db = target_mean - mean_dbfs
    limit_linear = 10 ** (PEAK_CEILING_DBFS / 20)
    final_mean = mean_dbfs
    for _ in range(6):
        subprocess.run(
            [
                "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(mixed), "-af",
                (
                    f"volume={gain_db:.3f}dB,"
                    f"alimiter=limit={limit_linear:.6f}:attack=0.2:release=20:"
                    "level=false:latency=true"
                ),
                "-ar", "48000", "-ac", "2", "-codec:a", "pcm_s24le", str(levelled),
            ],
            check=True,
        )
        final_mean, _ = probe_volume(levelled)
        miss = target_mean - final_mean
        if abs(miss) <= 0.6:
            break
        gain_db += max(-8.0, min(8.0, miss * 1.25))
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(levelled), "-ar", "48000", "-ac", "2",
            "-codec:a", "libmp3lame", "-b:a", "192k", str(final),
        ],
        check=True,
    )
    mixed.unlink(missing_ok=True)
    levelled.unlink(missing_ok=True)
    final_mean, final_max = probe_volume(final)
    return {
        "target_mean_dbfs": target_mean,
        "applied_gain_db": round(gain_db, 3),
        "final_mean_dbfs": final_mean,
        "final_max_dbfs": final_max,
    }


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def probe_media(path: Path) -> dict:
    data = json.loads(subprocess.check_output(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration:stream=codec_type,codec_name,sample_rate,channels",
            "-of", "json", str(path),
        ],
        text=True,
    ))
    stream = next((entry for entry in data.get("streams", []) if entry.get("codec_type") == "audio"), None)
    if not stream:
        raise RuntimeError(f"no audio stream in {path}")
    return {
        "duration_seconds": round(float(data["format"]["duration"]), 6),
        "codec": stream["codec_name"],
        "sample_rate_hz": int(stream["sample_rate"]),
        "channels": int(stream["channels"]),
    }


def main() -> int:
    args = sys.argv[1:]
    if args == ["--check-ledger"]:
        rows = parse_ledger(LEDGER.read_text())
        payloads = [generation_payload(row) for row in rows.values()]
        print(json.dumps({
            "count": len(rows),
            "min_requested_duration_seconds": min(payload["duration_seconds"] for payload in payloads),
            "distinct_prompt_influences": sorted({payload["prompt_influence"] for payload in payloads}),
            "loop": sorted({payload["loop"] for payload in payloads}),
            "model_id": sorted({payload["model_id"] for payload in payloads}),
            "target_ranges": len({tuple(row["target_after_trim_seconds"]) for row in rows.values()}),
            "exact_targets": all(lo == hi for lo, hi in (row["target_after_trim_seconds"] for row in rows.values())),
            "global_suffix_applied": all(payload["text"].endswith(GLOBAL_SFX_SUFFIX) for payload in payloads),
            "max_request_text_characters": max(len(payload["text"]) for payload in payloads),
            "request_text_limit": MAX_PROMPT_CHARS,
            "target_fit_enforced": True,
            "target_fit_example": target_fit_filter(0.08, 0.07),
            "silence_padding": False,
            "mono_compatible_mix": True,
            "output_sample_rate_hz": 48000,
            "output_bitrate_kbps": 192,
            "parameters": {
                sid: {
                    "target": row["target_after_trim_seconds"][0],
                    "request": row["requested_duration_seconds"],
                    "influence": row["prompt_influence"],
                }
                for sid, row in sorted(rows.items())
            },
        }))
        return 0
    if not args or args[0] in {"-h", "--help"}:
        print("usage: tools/gen-sfx-from-ledger.py --pack <new-pack-id> [--from-raw] [--variant <label>] [sfx-id ...]")
        print("base ashglass-v1 is immutable; generate 3-5 candidate packs, then select in ?audio=1")
        return 0 if args else 2
    if len(args) < 2 or args[0] != "--pack":
        raise SystemExit("first arguments must be --pack <new-pack-id>")
    pack_id = args[1]
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", pack_id):
        raise SystemExit("pack id must use lower-case letters, digits, and hyphens")
    if pack_id in IMMUTABLE_PACKS:
        raise SystemExit(f"refusing to overwrite immutable base pack: {pack_id}")
    remaining = args[2:]
    from_raw = False
    selected_variant = "api-primary"
    requested_ids: list[str] = []
    index = 0
    while index < len(remaining):
        value = remaining[index]
        if value == "--from-raw":
            from_raw = True
        elif value == "--variant":
            index += 1
            if index >= len(remaining):
                raise SystemExit("--variant requires a label")
            selected_variant = remaining[index]
            if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", selected_variant):
                raise SystemExit("variant label must use lower-case letters, digits, and hyphens")
        elif value.startswith("--"):
            raise SystemExit(f"unknown option: {value}")
        else:
            requested_ids.append(value)
        index += 1
    only = set(requested_ids) if requested_ids else None
    out = SFX_ROOT / pack_id
    raw_dir = RAW_ROOT / pack_id
    manifest_path = out / "manifest.json"
    key = None if from_raw else load_key()
    rows = parse_ledger(LEDGER.read_text())
    if not rows:
        raise SystemExit("no ledger rows parsed")
    unknown = sorted((only or set()) - set(rows))
    if unknown:
        raise SystemExit(f"unknown SFX ids: {', '.join(unknown)}")
    out.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)

    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    # Merge a final-schema manifest so subset rerenders never wipe siblings.
    manifest = {
        "schema_version": 2,
        "pack_id": pack_id,
        "kind": "sfx",
        "theme": "Ashglass Vigil",
        "source": "docs/sfx-ledger.md",
        "provenance": {
            "provider": "ElevenLabs",
            "generated_at": generated_at,
            "licence_or_plan": os.environ.get("ELEVENLABS_PLAN", "ElevenLabs Starter plan"),
            "notes": (
                "The ElevenLabs sound-generation API returned MP3 bytes directly and supplied no stable "
                "per-generation source id or URL. Files were silence-trimmed, duration-fitted without "
                "silence padding, centred for mono compatibility, phone-band limited, and family-normalised."
            ),
        },
        "items": {},
    }
    if manifest_path.exists():
        try:
            old = json.loads(manifest_path.read_text())
            if (
                old.get("schema_version") == 2
                and old.get("pack_id") == pack_id
                and old.get("kind") == "sfx"
                and isinstance(old.get("items"), dict)
            ):
                manifest["items"].update(old["items"])
        except json.JSONDecodeError:
            pass

    ids = [sid for sid in rows if only is None or sid in only]
    print(f"generating {len(ids)} sfx…", flush=True)
    ok = 0
    for i, sid in enumerate(ids, 1):
        row = rows[sid]
        raw = raw_dir / f"{sid}.mp3"
        final = out / f"{sid}.mp3"
        work = out / f".{sid}.trim.wav"
        print(f"[{i}/{len(ids)}] {sid} ({row['requested_duration_seconds']}s request)…", flush=True)
        attempts = 1 if from_raw else 4
        for attempt in range(attempts):
            try:
                if from_raw:
                    if not raw.exists() or raw.stat().st_size < 500:
                        raise RuntimeError(f"missing usable raw API response: {raw}")
                else:
                    data = generate(key, row)
                    if len(data) < 500:
                        raise RuntimeError(f"tiny response ({len(data)} bytes)")
                    raw.write_bytes(data)
                pre_fit_dur = trim_silence(raw, work)
                target_min, target_max = row["target_after_trim_seconds"]
                if target_min == target_max:
                    fit_target_duration(work, target_min)
                else:
                    dur = pre_fit_dur
                mix = finalise_mix(work, final, sid, target_min)
                dur = probe_duration(final)
                if target_min != target_max and not target_min <= dur <= target_max:
                    print(
                        f"  WARNING: {dur:.3f}s misses target-after-trim {target_min:g}-{target_max:g}s",
                        file=sys.stderr,
                        flush=True,
                    )
                media = probe_media(final)
                manifest["items"][sid] = {
                    "file": f"{sid}.mp3",
                    "bytes": final.stat().st_size,
                    "sha256": sha256_file(final),
                    **media,
                    "source_id": None,
                    "source_url": None,
                    "selected_variant": selected_variant,
                    "requested_duration_seconds": row["requested_duration_seconds"],
                    "target_after_trim_seconds": [target_min, target_max],
                    "prompt_influence": row["prompt_influence"],
                    "ledger_prompt": row["prompt"],
                    "request_prompt": generation_payload(row)["text"],
                    "usage": row["usage"],
                }
                print(
                    f"  ok → {final.name} ({dur:.3f}s, {final.stat().st_size} B, "
                    f"{mix['final_mean_dbfs']:.1f} dBFS mean, {mix['final_max_dbfs']:.1f} dBFS peak)",
                    flush=True,
                )
                ok += 1
                break
            except urllib.error.HTTPError as e:
                body = e.read().decode(errors="replace")[:240]
                print(f"  HTTP {e.code}: {body}", flush=True)
                if e.code == 429:
                    time.sleep(8 + attempt * 4)
                elif 400 <= e.code < 500:
                    break
                else:
                    time.sleep(2)
            except Exception as e:
                print(f"  err: {e}", flush=True)
                time.sleep(2)
            finally:
                work.unlink(missing_ok=True)
                for temporary in out.glob(f".{sid}.*.wav"):
                    temporary.unlink(missing_ok=True)
        else:
            print(f"  FAILED {sid}", flush=True)
        if not from_raw:
            time.sleep(0.35)

    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"done: {ok}/{len(ids)} generated; manifest → {manifest_path}", flush=True)
    return 0 if ok == len(ids) else 1


if __name__ == "__main__":
    raise SystemExit(main())
