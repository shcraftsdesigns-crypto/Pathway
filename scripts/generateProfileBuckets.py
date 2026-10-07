from pathlib import Path
import re

PROFILE_DIR = Path("src/data/characterProfiles")
OUTPUT_DIR = Path("src/data/characterProfileBuckets")

BUCKET_COUNT = 32


def field(text: str, name: str) -> str:
    match = re.search(
        rf"\b{re.escape(name)}:\s*(['\"])(.*?)\1",
        text,
    )

    if not match:
        raise RuntimeError(f"Missing {name}")

    return match.group(2)


def bucket_for_slug(slug: str) -> int:
    # Must match src/lib/characterRepository.ts.
    h = 5381

    for ch in slug:
        h = ((h * 33) ^ ord(ch)) & 0xFFFFFFFF

    return h % BUCKET_COUNT


profiles = []

for path in sorted(PROFILE_DIR.glob("*.ts")):
    text = path.read_text()

    pid = field(text, "id")
    slug = field(text, "slug")

    # Extract only the BiblicalCharacter object literal.
    match = re.search(
        r"const character:\s*BiblicalCharacter\s*=\s*(\{.*\})"
        r"\s*\n\s*export default character",
        text,
        re.S,
    )

    if not match:
        raise RuntimeError(
            f"Could not extract character object from {path}"
        )

    object_literal = match.group(1)

    profiles.append(
        {
            "id": pid,
            "slug": slug,
            "object": object_literal,
            "source": path.name,
        }
    )


ids = [p["id"] for p in profiles]
slugs = [p["slug"] for p in profiles]

if len(profiles) != 2922:
    raise RuntimeError(
        f"Expected 2922 profiles, found {len(profiles)}"
    )

if len(set(ids)) != len(ids):
    raise RuntimeError("Duplicate profile IDs found")

if len(set(slugs)) != len(slugs):
    raise RuntimeError("Duplicate profile slugs found")


buckets = {
    number: []
    for number in range(BUCKET_COUNT)
}

for profile in profiles:
    number = bucket_for_slug(profile["slug"])
    buckets[number].append(profile)


OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for old in OUTPUT_DIR.glob("bucket-*.ts"):
    old.unlink()


for number in range(BUCKET_COUNT):
    entries = sorted(
        buckets[number],
        key=lambda p: p["slug"],
    )

    lines = [
        "import type { BiblicalCharacter } from '@/types'",
        "",
        (
            "const profiles: Record<string, BiblicalCharacter> = {"
        ),
    ]

    for profile in entries:
        lines.append(f"  {profile['slug']!r}: {profile['object']},")

    lines.extend(
        [
            "}",
            "",
            "export default profiles",
            "",
        ]
    )

    path = (
        OUTPUT_DIR /
        f"bucket-{number:02d}.ts"
    )

    path.write_text("\n".join(lines))


sizes = []

for number in range(BUCKET_COUNT):
    path = OUTPUT_DIR / f"bucket-{number:02d}.ts"
    sizes.append((path.stat().st_size, path.name))


print("=== SELF-CONTAINED PROFILE BUCKETS ===")
print("Profiles:", len(profiles))
print("Unique IDs:", len(set(ids)))
print("Unique slugs:", len(set(slugs)))
print("Buckets:", BUCKET_COUNT)
print(
    "Smallest bucket:",
    min(len(v) for v in buckets.values()),
)
print(
    "Largest bucket:",
    max(len(v) for v in buckets.values()),
)
print(
    "Total source size:",
    f"{sum(size for size, _ in sizes) / 1024:.2f} KB",
)
print(
    "Largest source bucket:",
    max(sizes),
)

important = {
    "jesus": "Jesus_Christ",
    "jesus-justus": "Jesus_1",
    "abraham": "Abram_1",
    "moses": "Moses_1",
    "david": "David_1",
}

lookup = {
    p["slug"]: p
    for p in profiles
}

for slug, expected_id in important.items():
    profile = lookup.get(slug)

    if not profile:
        raise RuntimeError(
            f"Missing important profile: {slug}"
        )

    if profile["id"] != expected_id:
        raise RuntimeError(
            f"{slug}: expected {expected_id}, "
            f"found {profile['id']}"
        )

    print(
        f"{slug}: {profile['id']} -> "
        f"bucket {bucket_for_slug(slug)}"
    )

print("Identity checks: PASS")
