"""Remove solid black background from logo PNG, producing true transparency."""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def is_background(r: int, g: int, b: int, tolerance: int) -> bool:
    return r <= tolerance and g <= tolerance and b <= tolerance


def remove_black_background(input_path: Path, output_path: Path, tolerance: int = 30) -> None:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    visited = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue

        r, g, b, _a = pixels[x, y]
        if not is_background(r, g, b, tolerance):
            continue

        visited.add((x, y))
        pixels[x, y] = (r, g, b, 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, optimize=True)


if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/assets/logo-transparent.png")
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src
    remove_black_background(src, dst)
    print(f"Saved transparent logo to {dst}")
