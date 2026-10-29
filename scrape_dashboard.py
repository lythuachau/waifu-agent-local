"""Paginate the public dashboard catalog on api-prod.zeroweight.ai."""
from __future__ import annotations

import json
import ssl
import urllib.request
from pathlib import Path

CTX = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
BASE = "https://api-prod.zeroweight.ai"
OUT = Path(r"E:\ll\waifu-agent-extract\self-host\server\data")


def get(path: str):
    req = urllib.request.Request(BASE + path, headers=UA)
    with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
        return json.loads(r.read())


def page(path: str) -> list[dict]:
    seen: dict[str, dict] = {}
    offset = 0
    while True:
        data = get(f"{path}{'&' if '?' in path else '?'}limit=100&offset={offset}")
        if not isinstance(data, list) or not data:
            break
        for a in data:
            seen[a["id"]] = a
        print(path, "offset", offset, "batch", len(data), "uniq", len(seen))
        offset += len(data)
        if len(data) < 100 or offset > 8000:
            break
    return list(seen.values())


def main() -> None:
    public = page("/api/v1/avatars/public")
    trending = page("/api/v1/avatars/public/trending")
    system = page("/api/v1/avatars/public/system")
    by_id: dict[str, dict] = {}
    for src, rows in (("public", public), ("trending", trending), ("system", system)):
        for a in rows:
            rec = by_id.setdefault(a["id"], a)
            rec.setdefault("sources", [])
            if src not in rec["sources"]:
                rec["sources"].append(src)
    out = OUT / "dashboard_catalog.json"
    out.write_text(json.dumps(list(by_id.values()), indent=2), encoding="utf-8")
    print("UNIQUE", len(by_id), "wrote", out)
    paid = sum(1 for a in by_id.values() if a.get("price"))
    print("price nonzero", paid)
    for a in list(by_id.values())[:40]:
        print(a["id"], a.get("name"), "price", a.get("price"), "likes", a.get("like_count"), a.get("sources"))


if __name__ == "__main__":
    main()
