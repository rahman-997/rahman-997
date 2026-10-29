#!/usr/bin/env python3
"""Dependency-free sanity checks for the profile's local SVG illustrations."""

from pathlib import Path
import re
import math
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SVG_TAG = "{http://www.w3.org/2000/svg}svg"


def validate_svg_content(source: str) -> None:
    if re.search(r"<!\s*(?:DOCTYPE|ENTITY)\b", source, re.IGNORECASE):
        raise ValueError("SVG must not contain DTDs or entity declarations")

    try:
        svg = ET.fromstring(source)
    except ET.ParseError as exc:
        raise ValueError(f"SVG is not well-formed XML: {exc}") from exc

    if svg.tag != SVG_TAG:
        raise ValueError("Root must be a namespaced SVG element")
    try:
        values = [float(n) for n in svg.attrib["viewBox"].split()]
    except (KeyError, ValueError) as exc:
        raise ValueError("SVG requires a numeric viewBox") from exc
    if len(values) != 4:
        raise ValueError("SVG viewBox requires four numeric values")
    _, _, width, height = values
    if not all(math.isfinite(number) for number in values):
        raise ValueError("SVG viewBox coordinates and dimensions must be finite")
    if width <= 0 or height <= 0:
        raise ValueError("SVG viewBox dimensions must be positive")

    if not svg.attrib.get("aria-label") and not svg.attrib.get("aria-labelledby"):
        raise ValueError("SVG requires an accessible label")
    all_ids = [item.attrib["id"] for item in svg.iter() if "id" in item.attrib]
    ids = set(all_ids)
    if len(ids) != len(all_ids):
        raise ValueError("Duplicate SVG element id")
    labelledby = svg.attrib.get("aria-labelledby")
    if labelledby and not all(part in ids for part in labelledby.split()):
        raise ValueError("SVG aria-labelledby references a missing element")

    # CSS can download external resources without an href attribute.
    # Permit only local fragment references (e.g., gradients), never URL fetches.
    for candidate in re.findall(r"url\(\s*([^)]*?)\s*\)", source, re.IGNORECASE):
        fragment = candidate.strip(" \'\"")
        if not re.fullmatch(r"#[A-Za-z_][\w.-]*", fragment):
            raise ValueError("SVG must not load external CSS resources")
        if fragment[1:] not in ids:
            raise ValueError("SVG references a missing resource id")
    if re.search(r"@import\b", source, re.IGNORECASE):
        raise ValueError("SVG must not import external stylesheets")

    for element in svg.iter():
        local_name = element.tag.rsplit("}", 1)[-1].lower()
        if local_name in {"script", "foreignobject"}:
            raise ValueError(f"Unsafe SVG element: {local_name}")
        for key, value in element.attrib.items():
            name = key.rsplit("}", 1)[-1].lower()
            if name.startswith("on"):
                raise ValueError(f"Event attribute is not allowed: {name}")
            if name == "href" and not value.startswith("#"):
                raise ValueError("SVGs must not load external images or resources")


def main() -> None:
    files = sorted((ROOT / "assets").glob("*.svg"))
    if not files:
        raise SystemExit("No SVG illustrations found")
    for file in files:
        try:
            validate_svg_content(file.read_text(encoding="utf-8"))
        except ValueError as exc:
            raise SystemExit(f"INVALID {file.name}: {exc}") from exc
        print(f"OK {file.name}")
    print(f"All {len(files)} SVG files are valid.")


if __name__ == "__main__":
    main()
