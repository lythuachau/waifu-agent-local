"""Ingest dashboard public avatars into the local offline pack."""
from __future__ import annotations

import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(r"E:\ll\waifu-agent-extract\self-host")
sys.path.insert(0, str(ROOT))

from offline_pack import (  # noqa: E402
    AES_KEY,
    BUNDLES,
    DATA,
    KEY_PATH,
    PUBLIC,
    STATIC,
    TOKENS,
    ZAI_DIR,
    b64url_decode,
    decrypt_token,
    fetch_bundle,
    fetch_persona,
    http_download,
    http_head_len,
    local_name,
    make_keypair,
    mint_token,
    rewrite_urls,
    walk_urls,
)
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

CATALOG = DATA / "dashboard_catalog.json"
AVATARS_PATH = DATA / "avatars.json"
COVER_DIR = STATIC / "avatars"
EXT_COVER = ROOT / "extension" / "avatars"
PERSONAS_DIR = DATA / "offline_personas"


def download_cover(aid: str, url: str) -> str | None:
    if not url:
        return None
    ext = ".png"
    low = url.split("?", 1)[0].lower()
    if low.endswith(".webp"):
        ext = ".webp"
    elif low.endswith(".jpg") or low.endswith(".jpeg"):
        ext = ".jpg"
    dest = COVER_DIR / f"{aid}{ext}"
    try:
        n = http_download(url, dest, 0)
        if n < 100:
            return None
        EXT_COVER.mkdir(parents=True, exist_ok=True)
        (EXT_COVER / dest.name).write_bytes(dest.read_bytes())
        return f"{PUBLIC}/static/avatars/{dest.name}"
    except Exception as e:
        print("cover fail", aid, e)
        return None


def summary_from(cat: dict, local_cover: str | None) -> dict:
    cover = {"thumb_url": local_cover, "full_thumb_url": local_cover} if local_cover else cat.get("cover")
    return {
        "id": cat["id"],
        "name": cat.get("name") or cat["id"],
        "description": cat.get("description"),
        "tags": cat.get("tags") or [],
        "transparent_background": bool(cat.get("transparent_background")),
        "cover": cover,
        "created_at": cat.get("created_at"),
        "updated_at": cat.get("updated_at"),
    }


def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    have = {p.stem for p in TOKENS.glob("*.json")}
    new = [a for a in catalog if a["id"] not in have]
    print("catalog", len(catalog), "have", len(have), "new", len(new))
    priv, _ = make_keypair()
    jobs = []
    inventory = []
    ok_ids = []
    for a in new:
        aid = a["id"]
        name = a.get("name")
        print("bundle", name, aid)
        try:
            env = fetch_bundle(aid)
            bundle = decrypt_token(env)
        except Exception as e:
            print("  bundle fail", e)
            continue
        urls = []
        walk_urls(bundle, urls)
        mapping = {}
        for u in urls:
            fn = local_name(u)
            dest = ZAI_DIR / aid / fn
            mapping[u] = f"{PUBLIC}/static/zai/{aid}/{fn}"
            try:
                size = http_head_len(u)
            except Exception as e:
                print("  HEAD fail", fn, e)
                size = 0
            jobs.append((u, dest, size, aid, fn))
            inventory.append({"avatar": aid, "name": name, "file": fn, "bytes": size})
            print(f"  {fn} {size}")
        rewritten = rewrite_urls(bundle, aid, mapping)
        BUNDLES.mkdir(parents=True, exist_ok=True)
        (BUNDLES / f"{aid}.json").write_text(json.dumps(rewritten, indent=2), encoding="utf-8")
        try:
            persona = fetch_persona(aid)
            PERSONAS_DIR.mkdir(parents=True, exist_ok=True)
            (PERSONAS_DIR / f"{aid}.json").write_text(json.dumps(persona, indent=2), encoding="utf-8")
        except Exception as e:
            print("  persona fail", e)
        cover_url = (a.get("cover") or {}).get("full_thumb_url") or (a.get("cover") or {}).get("thumb_url")
        local_cover = download_cover(aid, cover_url or "")
        a["_local_cover"] = local_cover
        ok_ids.append(aid)

    print("files", len(jobs), "bytes", sum(j[2] for j in jobs))

    def one(job):
        url, dest, size, aid, fn = job
        n = http_download(url, dest, size)
        return aid, fn, n, size

    done = 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = [pool.submit(one, j) for j in jobs]
        for fut in as_completed(futs):
            aid, fn, n, size = fut.result()
            done += 1
            flag = "OK" if (not size or n == size) else f"SIZE {n}!={size}"
            print(f"[{done}/{len(jobs)}] {aid} {fn} {n} {flag}")

    for aid in ok_ids:
        bundle = json.loads((BUNDLES / f"{aid}.json").read_text(encoding="utf-8"))
        token = mint_token(priv, bundle)
        TOKENS.mkdir(parents=True, exist_ok=True)
        (TOKENS / f"{aid}.json").write_text(json.dumps(token), encoding="utf-8")
        inner = b64url_decode(token["payload"]["payload"])
        sig = b64url_decode(token["payload"]["sig"])
        priv.public_key().verify(
            sig,
            inner,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )
        print("minted", aid, (TOKENS / f"{aid}.json").stat().st_size)

    existing = json.loads(AVATARS_PATH.read_text(encoding="utf-8"))
    by_id = {a["id"]: a for a in existing}
    for a in catalog:
        aid = a["id"]
        if aid in have and aid in by_id:
            continue
        cover = a.get("_local_cover")
        if not cover:
            p = COVER_DIR / f"{aid}.png"
            w = COVER_DIR / f"{aid}.webp"
            if p.exists():
                cover = f"{PUBLIC}/static/avatars/{aid}.png"
            elif w.exists():
                cover = f"{PUBLIC}/static/avatars/{aid}.webp"
        by_id[aid] = summary_from(a, cover)
    AVATARS_PATH.write_text(json.dumps(list(by_id.values()), indent=2), encoding="utf-8")
    print("avatars.json", len(by_id))
    (DATA / "dashboard_inventory.json").write_text(json.dumps(inventory, indent=2), encoding="utf-8")
    print("DONE")


if __name__ == "__main__":
    main()
