#!/usr/bin/env python3
"""Remove a warm outer rim from an alpha PNG without touching internal glow."""

from __future__ import annotations

import argparse
import colorsys
from pathlib import Path

from PIL import Image, ImageChops, ImageColor, ImageFilter


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Strip or mute yellow/orange pixels near the alpha silhouette edge."
    )
    parser.add_argument("--input", required=True, help="Input RGBA PNG.")
    parser.add_argument("--out", required=True, help="Output RGBA PNG.")
    parser.add_argument(
        "--radius",
        type=int,
        default=5,
        help="How many pixels inside the alpha silhouette are considered edge band.",
    )
    parser.add_argument(
        "--alpha-threshold",
        type=int,
        default=8,
        help="Pixels with alpha above this count as subject.",
    )
    parser.add_argument("--hue-min", type=float, default=18.0, help="Minimum warm hue in degrees.")
    parser.add_argument("--hue-max", type=float, default=70.0, help="Maximum warm hue in degrees.")
    parser.add_argument("--sat-min", type=float, default=0.30, help="Minimum saturation, 0-1.")
    parser.add_argument("--value-min", type=float, default=0.36, help="Minimum value, 0-1.")
    parser.add_argument(
        "--mode",
        choices=("darken", "transparent"),
        default="darken",
        help="Darken keeps silhouette size; transparent trims matching rim pixels.",
    )
    parser.add_argument(
        "--dark-colour",
        default="#070a12",
        help="Replacement colour for --mode darken.",
    )
    return parser.parse_args()


def eroded_mask(mask: Image.Image, radius: int) -> Image.Image:
    eroded = mask
    for _ in range(max(0, radius)):
        eroded = eroded.filter(ImageFilter.MinFilter(3))
    return eroded


def is_warm_rim_pixel(r: int, g: int, b: int, hue_min: float, hue_max: float, sat_min: float, value_min: float) -> bool:
    rf, gf, bf = r / 255, g / 255, b / 255
    h, s, v = colorsys.rgb_to_hsv(rf, gf, bf)
    hue = h * 360
    return hue_min <= hue <= hue_max and s >= sat_min and v >= value_min and r > b and g > b


def main() -> None:
    args = parse_args()
    src = Image.open(args.input).convert("RGBA")
    alpha = src.getchannel("A")
    subject_mask = alpha.point(lambda a: 255 if a > args.alpha_threshold else 0, mode="L")
    inner = eroded_mask(subject_mask, args.radius)
    edge_band = ImageChops.subtract(subject_mask, inner)

    pixels = src.load()
    band = edge_band.load()
    dark = ImageColor.getrgb(args.dark_colour)
    changed = 0

    width, height = src.size
    for y in range(height):
        for x in range(width):
            if band[x, y] == 0:
                continue
            r, g, b, a = pixels[x, y]
            if a <= args.alpha_threshold:
                continue
            if not is_warm_rim_pixel(r, g, b, args.hue_min, args.hue_max, args.sat_min, args.value_min):
                continue
            if args.mode == "transparent":
                pixels[x, y] = (r, g, b, 0)
            else:
                pixels[x, y] = (dark[0], dark[1], dark[2], a)
            changed += 1

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    src.save(out)
    print(f"Wrote {out}")
    print(f"Changed warm edge pixels: {changed}")


if __name__ == "__main__":
    main()
