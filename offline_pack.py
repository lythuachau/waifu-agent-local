"""Download system-avatar .zai clips and mint offline SignedPayloadTokens.

Replaces the WASM RSA public key with a local keypair so we can sign
bundles that point at http://127.0.0.1:8787/static/zai/...
"""
from __future__ import annotations

import base64
import json
import os
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = Path(r"E:\ll\waifu-agent-extract")
SELF = ROOT / "self-host"
SERVER = SELF / "server"
DATA = SERVER / "data"
STATIC = SERVER / "static"
ZAI_DIR = STATIC / "zai"
TOKENS = DATA / "offline_tokens"
BUNDLES = DATA / "offline_bundles"
KEY_PATH = DATA / "offline_rsa.pem"
PUB_PATH = DATA / "offline_rsa.pub.pem"

ZW_KEY = os.environ.get(
    "ZW_KEY",
    "Zw_eyJ1IjoibGY3bXB6U1JiQmdVREZpcXJWeFVPRENxQkNTMiIsInIiOiJlMGYzY2FjYS1mNDdhLTQ3ZTctOTAzYi0wNDZkNTFjNTZhZTAifQ",
)
API = "https://api.zeroweight.ai/api/v1"
PUBLIC = os.environ.get("ZW_PUBLIC_BASE", "http://127.0.0.1:8787")
AES_KEY = bytes.fromhex("1b7e32068b846fca783e2857b7b068aea320ab5ba8e62298f492e3ec094a897c")
ORIG_PEM_LEN = 450
EXP = 4102444800  # 2099-12-31
CTX = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) WaifuLocal/1.0"}

RENDERER_PATHS = [
    ROOT / "unpacked" / "renderer.js",
    ROOT / "unpacked" / "chunks" / "avatar-frame-BJIbEIav.js",
    SELF / "extension" / "renderer.js",
    SELF / "extension" / "chunks" / "avatar-frame-BJIbEIav.js",
    STATIC / "renderer.js",
]


def avatars():
    return json.loads((DATA / "avatars.json").read_text(encoding="utf-8"))


def http_json(url: str, headers=None, timeout=45):
    h = dict(UA)
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        return json.loads(r.read().decode("utf-8"))


def http_head_len(url: str) -> int:
    req = urllib.request.Request(url, method="HEAD", headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
            return int(r.headers.get("content-length") or 0)
    except urllib.error.HTTPError as e:
        if e.code == 405:
            req = urllib.request.Request(url, headers={**UA, "Range": "bytes=0-0"})
            with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
                cr = r.headers.get("content-range") or ""
                if "/" in cr:
                    return int(cr.rsplit("/", 1)[-1])
                return int(r.headers.get("content-length") or 0)
        raise


def http_download(url: str, dest: Path, expected: int = 0, retries: int = 3) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and expected and dest.stat().st_size == expected:
        return dest.stat().st_size
    if dest.exists() and expected == 0 and dest.stat().st_size > 1024:
        return dest.stat().st_size
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=180, context=CTX) as r:
                data = r.read()
            dest.write_bytes(data)
            return len(data)
        except Exception as e:
            last_err = e
            time.sleep(attempt)
    raise RuntimeError(f"download failed {dest.name}: {last_err}")


def decrypt_token(envelope: dict) -> dict:
    token = envelope["payload"] if "sig" not in envelope else envelope
    if "payload" in token and "sig" in token and isinstance(token["payload"], str):
        inner = json.loads(b64url_decode(token["payload"]))
        blob = b64url_decode(inner["data"])
        pt = AESGCM(AES_KEY).decrypt(blob[:12], blob[12:], None)
        return json.loads(pt)
    raise ValueError("not a signed token")


def b64url_decode(s: str) -> bytes:
    pad = "=" * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode(s + pad)


def b64url_encode(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).decode("ascii").rstrip("=")


def make_keypair():
    if KEY_PATH.exists() and PUB_PATH.exists():
        priv = serialization.load_pem_private_key(KEY_PATH.read_bytes(), password=None)
        pub_pem = PUB_PATH.read_bytes()
        if len(pub_pem.rstrip(b"\n")) == ORIG_PEM_LEN:
            return priv, pub_pem.rstrip(b"\n")
    for _ in range(40):
        priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        pub_pem = priv.public_key().public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        ).rstrip(b"\n")
        if len(pub_pem) == ORIG_PEM_LEN:
            KEY_PATH.parent.mkdir(parents=True, exist_ok=True)
            KEY_PATH.write_bytes(
                priv.private_bytes(
                    serialization.Encoding.PEM,
                    serialization.PrivateFormat.PKCS8,
                    serialization.NoEncryption(),
                )
            )
            PUB_PATH.write_bytes(pub_pem + b"\n")
            return priv, pub_pem
    raise SystemExit("could not generate RSA-2048 PEM of 450 bytes")


def patch_renderer(pub_pem: bytes) -> int:
    n = 0
    for path in RENDERER_PATHS:
        if not path.exists():
            print("skip missing", path)
            continue
        text = path.read_text(encoding="utf-8", errors="surrogateescape")
        m = re.search(r"data:application/wasm;base64,([A-Za-z0-9+/=]+)", text)
        if not m:
            print("no wasm in", path)
            continue
        raw = bytearray(base64.b64decode(m.group(1)))
        i = bytes(raw).find(b"-----BEGIN PUBLIC KEY-----")
        if i < 0:
            print("no pem in", path)
            continue
        old = bytes(raw[i : i + ORIG_PEM_LEN])
        if not old.startswith(b"-----BEGIN PUBLIC KEY-----"):
            print("pem slice mismatch", path)
            continue
        if old == pub_pem:
            print("already patched", path.name)
            n += 1
            continue
        raw[i : i + ORIG_PEM_LEN] = pub_pem
        new_b64 = base64.b64encode(bytes(raw)).decode("ascii")
        text = text[: m.start(1)] + new_b64 + text[m.end(1) :]
        path.write_text(text, encoding="utf-8", errors="surrogateescape")
        print("patched", path, "b64", len(new_b64))
        n += 1
    return n


def b64_std_encode(b: bytes) -> str:
    # Inner `data` is STANDARD base64 with padding; outer payload/sig are urlsafe.
    return base64.b64encode(b).decode("ascii")


def mint_token(priv, bundle: dict) -> dict:
    pt = json.dumps(bundle, separators=(",", ":")).encode("utf-8")
    nonce = os.urandom(12)
    blob = nonce + AESGCM(AES_KEY).encrypt(nonce, pt, None)
    inner = json.dumps(
        {"data": b64_std_encode(blob), "exp": EXP},
        separators=(",", ":"),
    ).encode("utf-8")
    sig = priv.sign(
        inner,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256(),
    )
    return {"payload": {"payload": b64url_encode(inner), "sig": b64url_encode(sig)}}


def walk_urls(obj, acc):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("rgb", "alpha") and isinstance(v, str) and v.startswith("http"):
                acc.append(v)
            else:
                walk_urls(v, acc)
    elif isinstance(obj, list):
        for x in obj:
            walk_urls(x, acc)


def rewrite_urls(obj, avatar_id, mapping):
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            if k in ("rgb", "alpha") and isinstance(v, str) and v.startswith("http"):
                out[k] = mapping[v]
            else:
                out[k] = rewrite_urls(v, avatar_id, mapping)
        return out
    if isinstance(obj, list):
        return [rewrite_urls(x, avatar_id, mapping) for x in obj]
    return obj


def local_name(url: str) -> str:
    return url.split("?", 1)[0].rsplit("/", 1)[-1]


def fetch_bundle(avatar_id: str) -> dict:
    return http_json(
        f"{API}/avatars/bundle/{avatar_id}",
        headers={"X-ZW-Api-Key": ZW_KEY, "Accept": "application/json"},
    )


def fetch_persona(avatar_id: str) -> dict:
    return http_json(
        f"{API}/avatars/{avatar_id}/persona",
        headers={"X-ZW-Api-Key": ZW_KEY, "Accept": "application/json"},
    )


def main():
    DATA.mkdir(parents=True, exist_ok=True)
    TOKENS.mkdir(parents=True, exist_ok=True)
    BUNDLES.mkdir(parents=True, exist_ok=True)
    ZAI_DIR.mkdir(parents=True, exist_ok=True)

    priv, pub_pem = make_keypair()
    print("rsa pem", len(pub_pem))
    print("patched renderers", patch_renderer(pub_pem))

    jobs = []
    inventory = []
    for a in avatars():
        aid = a["id"]
        name = a.get("name")
        print("bundle", name, aid)
        env = fetch_bundle(aid)
        bundle = decrypt_token(env)
        urls = []
        walk_urls(bundle, urls)
        mapping = {}
        for u in urls:
            fn = local_name(u)
            dest = ZAI_DIR / aid / fn
            local = f"{PUBLIC}/static/zai/{aid}/{fn}"
            mapping[u] = local
            try:
                size = http_head_len(u)
            except Exception as e:
                print("  HEAD fail", fn, e)
                size = 0
            jobs.append((u, dest, size, aid, fn))
            inventory.append({"avatar": aid, "name": name, "file": fn, "bytes": size, "src": u.split("?")[0]})
            print(f"  {fn} {size}")
        rewritten = rewrite_urls(bundle, aid, mapping)
        (BUNDLES / f"{aid}.json").write_text(json.dumps(rewritten, indent=2), encoding="utf-8")
        try:
            persona = fetch_persona(aid)
            (DATA / "offline_personas").mkdir(parents=True, exist_ok=True)
            (DATA / "offline_personas" / f"{aid}.json").write_text(
                json.dumps(persona, indent=2), encoding="utf-8"
            )
        except Exception as e:
            print("  persona fail", e)

    (DATA / "zai_inventory.json").write_text(json.dumps(inventory, indent=2), encoding="utf-8")
    total = sum(j[2] for j in jobs)
    print("files", len(jobs), "bytes", total)

    def one(job):
        url, dest, size, aid, fn = job
        n = http_download(url, dest, size)
        return aid, fn, n, size

    ok = 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = [pool.submit(one, j) for j in jobs]
        for fut in as_completed(futs):
            aid, fn, n, size = fut.result()
            ok += 1
            flag = "OK" if (not size or n == size) else f"SIZE {n}!={size}"
            print(f"[{ok}/{len(jobs)}] {aid} {fn} {n} {flag}")

    for a in avatars():
        aid = a["id"]
        bundle = json.loads((BUNDLES / f"{aid}.json").read_text(encoding="utf-8"))
        token = mint_token(priv, bundle)
        (TOKENS / f"{aid}.json").write_text(json.dumps(token), encoding="utf-8")
        # verify with our public key
        inner = b64url_decode(token["payload"]["payload"])
        sig = b64url_decode(token["payload"]["sig"])
        priv.public_key().verify(
            sig,
            inner,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )
        print("minted", aid, "token", (TOKENS / f"{aid}.json").stat().st_size)

    print("DONE")


if __name__ == "__main__":
    main()
