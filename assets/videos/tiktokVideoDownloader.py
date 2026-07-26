import subprocess
from pathlib import Path

URLS_FILE = "urls.txt"
OUTPUT_DIR = Path(".")

OUTPUT_DIR.mkdir(exist_ok=True)

with open(URLS_FILE, "r", encoding="utf-8") as f:
    urls = [line.strip() for line in f if line.strip()]

for i, url in enumerate(urls, start=1):
    output_file = OUTPUT_DIR / f"VID_{i}.%(ext)s"

    print(f"Downloading {url} -> {output_file}")

    cmd = [
        "yt-dlp",
        "-o",
        str(output_file),
        url,
    ]

    result = subprocess.run(cmd)

    if result.returncode != 0:
        print(f"Failed to download: {url}")