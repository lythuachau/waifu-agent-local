"""Inspect renderer.js strings and a public .zai header."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(r"E:\ll\waifu-agent-extract")
OUT = ROOT / "self-host"
OUT.mkdir(parents=True, exist_ok=True)

renderer = (ROOT / "unpacked" / "renderer.js").read_bytes()
# printable strings >= 8 chars
strings = re.findall(rb"[\x20-\x7e]{8,}", renderer)
decoded = [s.decode("ascii") for s in strings]
interesting = [
    s for s in decoded
    if re.search(
        r"payload|expir|signat|decrypt|aes|zai|action|listen|speak|wave|bundle|cdn|zeroweight|init|wasm|mp4|webp|lazy",
        s,
        re.I,
    )
]
# unique, keep order
seen = set()
uniq = []
for s in interesting:
    if s not in seen:
        seen.add(s)
        uniq.append(s)

(OUT / "renderer-strings.txt").write_text("\n".join(uniq[:800]), encoding="utf-8")
print("renderer bytes", len(renderer), "interesting strings", len(uniq))
for s in uniq[:80]:
    print(" ", s[:200])

# download one small .zai
zai_url = "https://cdn-public.zeroweight.ai/user/MWTgqv64YyV2MF6QdEhh2mcbMra2/avatars/sFw76S36nj97AlmDQEAt/actions/wave_hand/versions/EGxfgoOIQyXWy6fSkrzW/vid_0.zai"
# find size from users.json
users = json.loads((ROOT / "s3-dump" / "users.json").read_text(encoding="utf-8"))
zai_items = []
for uid, rec in users.items():
    for aid, av in rec.get("avatars", {}).items():
        for f in av.get("files", []):
            if f["key"].endswith(".zai"):
                zai_items.append(f)
zai_items.sort(key=lambda x: x["size"])
print("zai count", len(zai_items), "smallest", zai_items[:5], "largest", zai_items[-3:])
small = zai_items[0]
url = "https://cdn-public.zeroweight.ai/" + small["key"].replace(" ", "%20")
print("GET", small)
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=60) as r:
    data = r.read()
    ctype = r.headers.get("content-type")
(OUT / "sample.zai").write_bytes(data)
print("downloaded", len(data), "ctype", ctype, "magic", data[:32].hex(), data[:32])
# also mp4 sample
mp4s = []
for uid, rec in users.items():
    for aid, av in rec.get("avatars", {}).items():
        for f in av.get("files", []):
            if f["key"].endswith(".mp4"):
                mp4s.append(f)
mp4s.sort(key=lambda x: x["size"])
print("mp4 count", len(mp4s), "smallest", mp4s[:3] if mp4s else None)
