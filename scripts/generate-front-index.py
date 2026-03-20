#!/usr/bin/env python3
"""Generate front-index.json from @granit/* TypeScript packages.

Reads each package's src/index.ts, extracts public exports (interfaces,
types, functions, classes, enums, consts), and writes a JSON index.

No external dependencies — runs with Python 3.8+.

Usage (from granit-front repo root):
    python3 scripts/generate-front-index.py [--root .] [--out front-index.json]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


# ─── CLI ──────────────────────────────────────────────────────────────────────


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate front-index.json")
    parser.add_argument("--root", default=os.getcwd(), help="Repo root (default: cwd)")
    parser.add_argument("--out", default=".mcp-front-index.json", help="Output path")
    return parser.parse_args()


# ─── Helpers ──────────────────────────────────────────────────────────────────


def is_word_char(ch: str) -> bool:
    return ch.isalnum() or ch == "_"


def truncate_at(s: str, chars: str) -> str:
    """Return s up to the first occurrence of any char in *chars*."""
    for i, ch in enumerate(s):
        if ch in chars:
            return s[:i].rstrip()
    return s


def strip_export_prefix(s: str) -> str:
    if not s.startswith("export "):
        return s
    return s[7:].lstrip()


def collapse_whitespace(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip().rstrip(";").strip()


def matches_export_keyword(
    line: str, keyword: str, name: str, modifier: str | None = None
) -> bool:
    prefix = f"export {modifier} {keyword} " if modifier else f"export {keyword} "
    if not line.startswith(prefix):
        return False
    if not line[len(prefix) :].startswith(name):
        return False
    after = len(prefix) + len(name)
    return after >= len(line) or not is_word_char(line[after])


# ─── Signature collection ────────────────────────────────────────────────────


def collect_signature(lines: list[str], start: int) -> str:
    sig = lines[start].strip()
    depth = sum(1 if c in "(<{" else -1 if c in ")>}" else 0 for c in sig)

    j = start + 1
    while depth > 0 and j < len(lines):
        next_line = lines[j].strip()
        sig += " " + next_line
        depth += sum(1 if c in "(<{" else -1 if c in ")>}" else 0 for c in next_line)
        j += 1

    return collapse_whitespace(sig)


# ─── Interface member parsing ────────────────────────────────────────────────


def try_parse_colon_member(trimmed: str) -> dict | None:
    name_end = 0
    while name_end < len(trimmed) and is_word_char(trimmed[name_end]):
        name_end += 1
    if name_end == 0:
        return None

    m_name = trimmed[:name_end]
    pos = name_end
    optional = "?" if pos < len(trimmed) and trimmed[pos] == "?" else ""
    if optional:
        pos += 1
    if pos >= len(trimmed) or trimmed[pos] != ":":
        return None

    pos += 1
    while pos < len(trimmed) and trimmed[pos] in (" ", "\t"):
        pos += 1
    m_type = trimmed[pos:].rstrip("; ")
    if not m_type:
        return None

    kind = "method" if "=>" in m_type or m_type.startswith("(") else "property"
    return {"name": m_name, "kind": kind, "signature": f"{m_name}{optional}: {m_type}"}


def parse_member_line(lines: list[str], idx: int) -> dict | None:
    trimmed = lines[idx].strip()
    if not trimmed or trimmed.startswith("//") or trimmed.startswith("/*") or trimmed.startswith("*"):
        return None

    colon = try_parse_colon_member(trimmed)
    if colon:
        return colon

    m = re.match(r"^(\w+)\s*\(", trimmed)
    if m:
        sig = collect_signature(lines, idx).rstrip(";").strip()
        return {"name": m.group(1), "kind": "method", "signature": sig}

    return None


def extract_interface_members(lines: list[str], start: int) -> list[dict]:
    members: list[dict] = []
    depth = 0
    started = False

    for i in range(start, len(lines)):
        for ch in lines[i]:
            if ch == "{":
                depth += 1
                started = True
            elif ch == "}":
                depth -= 1
        if started and depth == 0:
            break
        if depth != 1 or i == start:
            continue
        member = parse_member_line(lines, i)
        if member:
            members.append(member)

    return members


# ─── Module resolution ───────────────────────────────────────────────────────


def resolve_module(pkg_dir: Path, module_path: str) -> Path | None:
    src_dir = pkg_dir / "src"
    cleaned = re.sub(r"\.m?js$", "", module_path.lstrip("./"))
    base = src_dir / cleaned

    for candidate in [base.with_suffix(".ts"), base.with_suffix(".tsx"), base / "index.ts"]:
        if candidate.is_file():
            return candidate
    return None


# ─── Export extraction ───────────────────────────────────────────────────────


def extract_direct_exports(content: str) -> list[dict]:
    lines = content.split("\n")
    exports: list[dict] = []

    for i, raw_line in enumerate(lines):
        line = raw_line.strip()

        # interface
        m = re.match(r"^export\s+interface\s+(\w+)(?:<[^>]+>)?", line)
        if m:
            members = extract_interface_members(lines, i)
            exports.append({
                "name": m.group(1),
                "kind": "interface",
                "signature": strip_export_prefix(truncate_at(line, "{")),
                "members": members,
            })
            continue

        # type
        m = re.match(r"^export\s+type\s+(\w+)(?:<[^>]+>)?", line)
        if m:
            sig = strip_export_prefix(collect_signature(lines, i))
            exports.append({"name": m.group(1), "kind": "type", "signature": sig})
            continue

        # function
        m = re.match(r"^export\s+(?:async\s+)?function\s+(\w+)", line)
        if m:
            sig = truncate_at(strip_export_prefix(collect_signature(lines, i)), "{")
            exports.append({"name": m.group(1), "kind": "function", "signature": sig})
            continue

        # class
        m = re.match(r"^export\s+(?:abstract\s+)?class\s+(\w+)", line)
        if m:
            exports.append({
                "name": m.group(1),
                "kind": "class",
                "signature": strip_export_prefix(truncate_at(line, "{")),
            })
            continue

        # enum
        m = re.match(r"^export\s+enum\s+(\w+)", line)
        if m:
            exports.append({"name": m.group(1), "kind": "enum", "signature": f"enum {m.group(1)}"})
            continue

        # const
        m = re.match(r"^export\s+const\s+(\w+)", line)
        if m:
            sig = truncate_at(strip_export_prefix(collect_signature(lines, i)), "=")
            exports.append({"name": m.group(1), "kind": "const", "signature": sig})

    return exports


def parse_aliased_name(name: str) -> tuple[str, str]:
    idx = name.find(" as ")
    if idx == -1:
        return name, name
    return name[:idx].strip(), name[idx + 4 :].strip()


def find_export_in_content(content: str, name: str) -> dict | None:
    lines = content.split("\n")

    for i, raw_line in enumerate(lines):
        line = raw_line.strip()

        if matches_export_keyword(line, "interface", name):
            members = extract_interface_members(lines, i)
            return {
                "name": name,
                "kind": "interface",
                "signature": strip_export_prefix(truncate_at(line, "{")),
                "members": members,
            }
        if matches_export_keyword(line, "type", name):
            sig = strip_export_prefix(collect_signature(lines, i))
            return {"name": name, "kind": "type", "signature": sig}
        if matches_export_keyword(line, "function", name) or matches_export_keyword(
            line, "function", name, "async"
        ):
            sig = truncate_at(strip_export_prefix(collect_signature(lines, i)), "{")
            return {"name": name, "kind": "function", "signature": sig}
        if matches_export_keyword(line, "class", name) or matches_export_keyword(
            line, "class", name, "abstract"
        ):
            return {
                "name": name,
                "kind": "class",
                "signature": strip_export_prefix(truncate_at(line, "{")),
            }
        if matches_export_keyword(line, "enum", name):
            return {"name": name, "kind": "enum", "signature": f"enum {name}"}
        if matches_export_keyword(line, "const", name):
            sig = truncate_at(strip_export_prefix(collect_signature(lines, i)), "=")
            return {"name": name, "kind": "const", "signature": sig}

    return None


def extract_reexports(content: str, pkg_dir: Path) -> list[dict]:
    exports: list[dict] = []

    for raw_line in content.split("\n"):
        line = raw_line.strip()

        # export { Foo, Bar } from './module'
        m = re.match(r"^export\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"]", line)
        if m:
            exports.extend(_resolve_names(m.group(1), m.group(2), pkg_dir, strip_type=True))
            continue

        # export type { Foo } from './module'
        m = re.match(r"^export\s+type\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"]", line)
        if m:
            exports.extend(_resolve_names(m.group(1), m.group(2), pkg_dir, strip_type=False))

    return exports


def _resolve_names(
    raw_names: str, module_path: str, pkg_dir: Path, *, strip_type: bool
) -> list[dict]:
    resolved = resolve_module(pkg_dir, module_path)
    if not resolved:
        return []

    module_content = resolved.read_text(encoding="utf-8")
    results: list[dict] = []

    for raw in raw_names.split(","):
        cleaned = raw.strip()
        if strip_type and cleaned.startswith("type "):
            cleaned = cleaned[5:].lstrip()
        original, exported = parse_aliased_name(cleaned)
        found = find_export_in_content(module_content, original)
        if found:
            found["name"] = exported
            results.append(found)

    return results


def extract_exports(index_path: Path, pkg_dir: Path) -> list[dict]:
    content = index_path.read_text(encoding="utf-8")
    all_exports = extract_direct_exports(content) + extract_reexports(content, pkg_dir)

    seen: set[str] = set()
    unique: list[dict] = []
    for exp in all_exports:
        if exp["name"] not in seen:
            seen.add(exp["name"])
            unique.append(exp)
    return unique


# ─── Package discovery ───────────────────────────────────────────────────────


def discover_packages(root: Path) -> list[dict]:
    packages_dir = root / "packages" / "@granit"
    if not packages_dir.is_dir():
        print(f"Packages directory not found: {packages_dir}", file=sys.stderr)
        sys.exit(1)

    packages = []
    for entry in sorted(packages_dir.iterdir()):
        if not entry.is_dir():
            continue
        pkg_json_path = entry / "package.json"
        if not pkg_json_path.is_file():
            continue
        pkg_json = json.loads(pkg_json_path.read_text(encoding="utf-8"))
        index_path = entry / "src" / "index.ts"
        if not index_path.is_file():
            continue

        packages.append({
            "name": pkg_json.get("name", f"@granit/{entry.name}"),
            "description": pkg_json.get("description", ""),
            "dir": entry,
            "index_path": index_path,
        })

    return packages


# ─── Main ────────────────────────────────────────────────────────────────────


def main() -> None:
    args = parse_args()
    root = Path(args.root).resolve()
    output = Path(args.out) if os.path.isabs(args.out) else Path.cwd() / args.out

    print("Discovering @granit/* packages...")
    packages = discover_packages(root)
    print(f"  Found {len(packages)} packages")

    print("Extracting exports...")
    result = []
    for pkg in packages:
        exports = extract_exports(pkg["index_path"], pkg["dir"])
        result.append({
            "name": pkg["name"],
            "description": pkg["description"],
            "exports": exports,
        })
        if exports:
            print(f"  {pkg['name']}: {len(exports)} exports")

    index = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "repo": "granit-front",
        "packages": result,
    }

    output.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    total_exports = sum(len(p["exports"]) for p in result)
    total_members = sum(
        len(e.get("members", [])) for p in result for e in p["exports"]
    )
    size_kb = len(json.dumps(index)) // 1024

    print(f"\nfront-index.json generated:")
    print(f"  {len(packages)} packages, {total_exports} exports, {total_members} members")
    print(f"  {size_kb} KB")


if __name__ == "__main__":
    main()
