#!/usr/bin/env python3
"""Validate blog data content for unsafe inline HTML."""
from __future__ import annotations

from pathlib import Path
import sys

BLOG_DATA_PATH = Path("src/features/blog/data/posts.ts")


def main() -> int:
    if not BLOG_DATA_PATH.exists():
        print(f"Missing blog data file: {BLOG_DATA_PATH}", file=sys.stderr)
        return 1

    content = BLOG_DATA_PATH.read_text(encoding="utf-8")
    lowered = content.lower()

    if "<script" in lowered:
        print("Potentially unsafe <script> tag found in blog data.", file=sys.stderr)
        return 1

    print("Blog data markdown validated: no unsafe <script> tags detected.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
