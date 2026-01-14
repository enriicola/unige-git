#!/usr/bin/env python3
"""Audit git history, playbooks, env files, and stack templates for literal passwords."""

from __future__ import annotations

import argparse
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ALLOWLIST = REPO_ROOT / "scripts" / "password_audit_allowlist.txt"

SAFE_VALUE_SUBSTRINGS = (
    "{{",
    "lookup(",
    "ansible.builtin.password",
    "env(",
    "passwordstore",
    "vault(",
)
SAFE_VALUE_PREFIXES = ("$", "!vault")
SAFE_LITERAL_PREFIXES = ("$2a$", "$2b$", "$2y$", "$argon2")
SAFE_LITERAL_VALUES = {"VALUE_SPECIFIED_IN_NO_LOG_PARAMETER"}
TRAILING_PUNCTUATION = ",;"


@dataclass
class Finding:
    check: str
    location: str
    line: str


def run_cmd(cmd: Sequence[str], *, cwd: Path | None = None) -> str:
    res = subprocess.run(
        cmd,
        cwd=str(cwd or REPO_ROOT),
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return res.stdout


def is_passwordish_key(key: str) -> bool:
    cleaned = key.strip().lower().lstrip("- ")
    if not cleaned or "password" not in cleaned:
        return False
    idx = cleaned.index("password")
    prev_char = cleaned[idx - 1] if idx > 0 else ""
    next_idx = idx + len("password")
    next_char = cleaned[next_idx] if next_idx < len(cleaned) else ""
    if prev_char.isalpha() or next_char.isalpha():
        return False
    return True


def strip_inline_comment(value: str) -> str:
    if "#" in value:
        return value.split("#", 1)[0].rstrip()
    return value


def normalize_value(value: str) -> str:
    cleaned = strip_inline_comment(value.strip())
    if not cleaned:
        return ""
    cleaned = cleaned.rstrip(TRAILING_PUNCTUATION)
    if (
        cleaned.startswith(("'", '"'))
        and cleaned.endswith(("'", '"'))
        and len(cleaned) >= 2
    ):
        cleaned = cleaned[1:-1].strip()
    return cleaned


def is_cleartext_value(value: str) -> bool:
    if not value:
        return False
    lowered = value.lower()
    if lowered in {"", "~", "null", "none"}:
        return False
    if value in SAFE_LITERAL_VALUES:
        return False
    if value.startswith(("|", ">")):
        return False
    if any(token in value for token in SAFE_VALUE_SUBSTRINGS):
        return False
    if value.startswith(SAFE_VALUE_PREFIXES):
        return False
    if value.startswith("{{") and value.endswith("}}"):
        return False
    if any(value.startswith(prefix) for prefix in SAFE_LITERAL_PREFIXES):
        return False
    if value.isupper() and value.replace("_", "").isalpha():
        return False
    return True


def analyze_assignment(line: str) -> tuple[str, str] | None:
    stripped = line.strip()
    if not stripped or stripped.startswith(("#", "//", ";", "--")):
        return None
    stripped = stripped.lstrip("+- ").lstrip()
    if stripped.startswith("export "):
        stripped = stripped[len("export ") :].lstrip()
    separator = ":" if ":" in stripped else "=" if "=" in stripped else None
    if not separator:
        return None
    key, value = stripped.split(separator, 1)
    if not is_passwordish_key(key):
        return None
    normalized = normalize_value(value)
    if not is_cleartext_value(normalized):
        return None
    return key.strip(), normalized


def scan_files(files: Iterable[Path], check_name: str) -> List[Finding]:
    findings: List[Finding] = []
    for path in files:
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            continue
        for idx, line in enumerate(text.splitlines(), start=1):
            if result := analyze_assignment(line):
                findings.append(
                    Finding(
                        check=check_name,
                        location=f"{path.relative_to(REPO_ROOT)}:{idx}",
                        line=line.strip(),
                    )
                )
    return findings


def collect_patterns(patterns: Sequence[str]) -> List[Path]:
    files: List[Path] = []
    seen: set[Path] = set()
    for pattern in patterns:
        for path in REPO_ROOT.glob(pattern):
            if not path.is_file():
                continue
            rel = path.relative_to(REPO_ROOT)
            if rel in seen:
                continue
            seen.add(rel)
            files.append(path)
    return files


def check_git_history() -> List[Finding]:
    findings: List[Finding] = []
    try:
        shas_text = run_cmd(
            [
                "git",
                "log",
                "--all",
                "-G",
                "password\\s*[:=]",
                "--regexp-ignore-case",
                "--format=%H",
            ]
        )
    except subprocess.CalledProcessError as exc:
        print(exc.stderr, file=sys.stderr)
        return [Finding("git-history", "git", "failed to inspect history")]
    shas = [line.strip() for line in shas_text.splitlines() if line.strip()]
    for sha in shas:
        diff = run_cmd(["git", "show", sha, "--unified=0", "--color=never"])
        current_file = None
        for line in diff.splitlines():
            if line.startswith("+++ "):
                current_file = line[6:] if line.startswith("+++ b/") else line[4:]
                continue
            if not line.startswith("+") or line.startswith("+++"):
                continue
            payload = line[1:]
            if result := analyze_assignment(payload):
                loc = f"{sha[:7]}:{current_file or 'unknown'}"
                findings.append(
                    Finding("git-history", loc, payload.strip())
                )
    return findings


def default_patterns() -> tuple[list[str], list[str], list[str]]:
    playbook_patterns = [
        "playbook.yml",
        "roles/*/tasks/**/*.yml",
        "roles/*/tasks/**/*.yaml",
        "roles/*/handlers/**/*.yml",
        "roles/*/handlers/**/*.yaml",
        "roles/*/vars/**/*.yml",
        "roles/*/vars/**/*.yaml",
        "roles/*/defaults/**/*.yml",
        "roles/*/defaults/**/*.yaml",
        "roles/*/meta/**/*.yml",
        "roles/*/meta/**/*.yaml",
    ]
    env_patterns = [
        "scripts/**/*.sh",
        "roles/**/files/**/*.sh",
        "roles/**/templates/**/*.sh",
        "roles/**/files/**/*.env",
        "roles/**/templates/**/*.env",
    ]
    docker_patterns = [
        "roles/swarm-services/templates/**/*.yml",
        "roles/swarm-services/templates/**/*.yaml",
        "roles/docker-registry/templates/**/*.yml",
        "roles/docker-registry/templates/**/*.yaml",
    ]
    return playbook_patterns, env_patterns, docker_patterns


def load_allowlist(path: Path | None) -> set[str]:
    if not path or not path.exists():
        return set()
    entries: set[str] = set()
    for raw in path.read_text().splitlines():
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        entries.add(stripped)
    return entries


def finding_key(finding: Finding) -> str:
    return f"{finding.check}|{finding.location}|{finding.line}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check for cleartext passwords in the repository."
    )
    parser.add_argument(
        "--git-history",
        action="store_true",
        help="Scan git history for password assignments.",
    )
    parser.add_argument(
        "--playbooks",
        action="store_true",
        help="Scan ansible playbooks for password assignments.",
    )
    parser.add_argument(
        "--env",
        action="store_true",
        help="Scan shell/env files for password assignments.",
    )
    parser.add_argument(
        "--docker",
        action="store_true",
        help="Scan docker stack templates for password assignments.",
    )
    parser.add_argument(
        "--allowlist",
        help="Path to allowlist file (default: scripts/password_audit_allowlist.txt).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    playbook_patterns, env_patterns, docker_patterns = default_patterns()
    checks_requested = any((args.git_history, args.playbooks, args.env, args.docker))
    run_git = args.git_history or not checks_requested
    run_playbooks = args.playbooks or not checks_requested
    run_env = args.env or not checks_requested
    run_docker = args.docker or not checks_requested

    allowlist_path = Path(args.allowlist) if args.allowlist else DEFAULT_ALLOWLIST
    allowlist = load_allowlist(allowlist_path)

    findings: List[Finding] = []
    if run_git:
        findings.extend(check_git_history())
    if run_playbooks:
        files = collect_patterns(playbook_patterns)
        findings.extend(scan_files(files, "playbooks"))
    if run_env:
        files = collect_patterns(env_patterns)
        findings.extend(scan_files(files, "env"))
    if run_docker:
        files = collect_patterns(docker_patterns)
        findings.extend(scan_files(files, "docker"))

    failures = [
        f
        for f in findings
        if "failed" not in f.line.lower() and finding_key(f) not in allowlist
    ]
    if failures:
        print("Detected potential cleartext passwords:")
        for finding in failures:
            print(f"[{finding.check}] {finding.location} -> {finding.line}")
        return 1
    print("Password audit passed: no cleartext passwords detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
