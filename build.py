"""Copy the unpacked CRX, retarget it at localhost, download public covers."""
from __future__ import annotations

import json
import shutil
import urllib.request
from pathlib import Path

ROOT = Path(r"E:\ll\waifu-agent-extract")
SRC = ROOT / "unpacked"
DST = ROOT / "self-host" / "extension"
STATIC = ROOT / "self-host" / "server" / "static" / "avatars"
DATA = ROOT / "self-host" / "server" / "data"
LOCAL = "http://127.0.0.1:8787"
UA = {"User-Agent": "Mozilla/5.0 (compatible; waifu-local/1.0)"}

LOCAL_OVERLAY = r'''
async function mountLocalAvatar(container, payload, callbacks, signal) {
	const onError = callbacks.onError;
	const onDimensions = callbacks.onDimensions;
	const wrap = document.createElement("div");
	wrap.setAttribute("data-zw-local", "1");
	wrap.style.cssText = "width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;background:transparent;";
	const img = document.createElement("img");
	img.alt = payload.id || "avatar";
	img.style.cssText = "width:100%;height:100%;object-fit:contain;object-position:bottom center;pointer-events:none;user-select:none;filter:drop-shadow(0 8px 16px rgba(0,0,0,.35));";
	const blobs = [];
	const setSrc = async (url) => {
		if (!url) return;
		if (/^(blob:|data:|chrome-extension:)/.test(url)) {
			img.src = url;
			return;
		}
		const res = await fetch(url);
		if (!res.ok) throw new Error("avatar fetch " + res.status);
		const obj = URL.createObjectURL(await res.blob());
		blobs.push(obj);
		img.src = obj;
	};
	img.onload = () => {
		if (img.naturalWidth > 0 && img.naturalHeight > 0) onDimensions(img.naturalWidth, img.naturalHeight);
	};
	img.onerror = () => onError("local avatar image failed to load");
	wrap.appendChild(img);
	container.appendChild(wrap);
	try {
		await setSrc(payload.image || "");
	} catch (error) {
		try {
			await setSrc(chrome.runtime.getURL("avatars/" + (payload.id || "avatar") + ".png"));
		} catch {
			onError(error instanceof Error ? error.message : String(error));
			throw error;
		}
	}
	return {
		surface: "local",
		setState: (state) => {
			const src = (payload.videos && payload.videos[state]) || payload.image;
			if (src) setSrc(src).catch(() => {});
		},
		gesture: () => Promise.resolve(),
		destroy: () => {
			blobs.forEach((b) => URL.revokeObjectURL(b));
			wrap.remove();
		}
	};
}
'''


def copy_tree():
    if DST.exists():
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns("_metadata"))
    print("copied", DST)


def patch_urls():
    n = 0
    for path in DST.rglob("*"):
        if path.suffix.lower() not in {".js", ".html", ".json", ".css"}:
            continue
        text = path.read_text(encoding="utf-8", errors="surrogateescape")
        if "https://api.zeroweight.ai" not in text:
            continue
        path.write_text(
            text.replace("https://api.zeroweight.ai", LOCAL),
            encoding="utf-8",
            errors="surrogateescape",
        )
        n += 1
        print("retarget", path.relative_to(DST))
    print("retargeted files", n)


def patch_overlay():
    path = DST / "content-scripts" / "content.js"
    text = path.read_text(encoding="utf-8", errors="surrogateescape")
    needle = "async function mountAvatar(container, payload, callbacks, signal) {"
    if needle not in text:
        raise SystemExit("mountAvatar not found in content.js")
    if "function mountLocalAvatar" not in text:
        text = text.replace(
            needle,
            LOCAL_OVERLAY + "\n" + needle + "\n\tif (payload && payload.zw_local) return mountLocalAvatar(container, payload, callbacks, signal);",
            1,
        )
        path.write_text(text, encoding="utf-8", errors="surrogateescape")
        print("injected local overlay")
    else:
        print("overlay already injected")
    css_old = ".stage canvas, .stage iframe { pointer-events: none; background: transparent; }"
    css_new = ".stage canvas, .stage iframe, .stage img { pointer-events: none; background: transparent; }"
    text = path.read_text(encoding="utf-8", errors="surrogateescape")
    if css_old in text:
        path.write_text(text.replace(css_old, css_new, 1), encoding="utf-8", errors="surrogateescape")
        print("patched overlay css for img")


def patch_manifest():
    path = DST / "manifest.json"
    man = json.loads(path.read_text(encoding="utf-8"))
    man.pop("update_url", None)
    man["name"] = "Waifu Agent (local)"
    man["version"] = "1.0.4.3"
    man["homepage_url"] = LOCAL
    perms = list(man.get("permissions") or [])
    if "scripting" not in perms:
        perms.append("scripting")
    man["permissions"] = perms
    wars = man.get("web_accessible_resources") or []
    if wars:
        res = list(wars[0].get("resources") or [])
        if "avatars/*" not in res:
            res.append("avatars/*")
        wars[0]["resources"] = res
        man["web_accessible_resources"] = wars
    path.write_text(json.dumps(man, indent=2), encoding="utf-8")
    print("manifest patched")


def patch_inject():
    shutil.copy2(ROOT / "self-host" / "avatar-bridge.js", DST / "avatar-bridge.js")
    html = DST / "sidepanel.html"
    text = html.read_text(encoding="utf-8")
    if "avatar-bridge.js" not in text:
        text = text.replace(
            '<script type="module" crossorigin src="/chunks/sidepanel-BH1W4MJp.js"></script>',
            '<script src="/avatar-bridge.js"></script>\n\t\t<script type="module" crossorigin src="/chunks/sidepanel-BH1W4MJp.js"></script>',
        )
        html.write_text(text, encoding="utf-8")
        print("sidepanel.html loads avatar-bridge")
    content = DST / "content-scripts" / "content.js"
    raw = content.read_text(encoding="utf-8", errors="surrogateescape")
    if "__zwWaifuContentLoaded" not in raw:
        raw = raw.replace(
            "(function() {\n\tvar __vite_style__",
            "(function() {\n\tif (globalThis.__zwWaifuContentLoaded) return;\n\tglobalThis.__zwWaifuContentLoaded = true;\n\tvar __vite_style__",
            1,
        )
        content.write_text(raw, encoding="utf-8", errors="surrogateescape")
    side = DST / "chunks" / "sidepanel-BH1W4MJp.js"
    s = side.read_text(encoding="utf-8", errors="surrogateescape")
    replacements = [
        (
            """\t\treturn chrome.tabs.sendMessage(tabId, {\n\t\t\ttype: \"AVATAR\",\n\t\t\t...message\n\t\t}).catch(() => null);""",
            """\t\treturn zwSendAvatar(tabId, message);""",
        ),
        (
            """\t\t\tconst response = await chrome.tabs.sendMessage(tabId, {\n\t\t\t\ttype: \"AVATAR\",\n\t\t\t\taction: \"show\",\n\t\t\t\tpayload: bundleRef.current.payload,\n\t\t\t\treplace: true\n\t\t\t}).catch(() => null);""",
            """\t\t\tconst response = await zwSendAvatar(tabId, {\n\t\t\t\taction: \"show\",\n\t\t\t\tpayload: bundleRef.current.payload,\n\t\t\t\treplace: true\n\t\t\t});""",
        ),
        (
            """\t\t\tif (tabId != null) chrome.tabs.sendMessage(tabId, {\n\t\t\t\ttype: \"AVATAR\",\n\t\t\t\taction: \"hide\"\n\t\t\t}).catch(() => {});""",
            """\t\t\tif (tabId != null) zwSendAvatar(tabId, {\n\t\t\t\taction: \"hide\"\n\t\t\t});""",
        ),
        (
            """\t\t\tconst response = await chrome.tabs.sendMessage(tabId, {\n\t\t\t\ttype: \"AVATAR\",\n\t\t\t\taction: \"show\",\n\t\t\t\tpayload: bundleRef.current?.payload\n\t\t\t}).catch(() => null);""",
            """\t\t\tconst response = await zwSendAvatar(tabId, {\n\t\t\t\taction: \"show\",\n\t\t\t\tpayload: bundleRef.current?.payload\n\t\t\t});""",
        ),
    ]
    for old, new in replacements:
        if old in s:
            s = s.replace(old, new, 1)
    side.write_text(s, encoding="utf-8", errors="surrogateescape")
    print("avatar inject patched")


def download_covers():
    src = json.loads((ROOT / "s3-dump" / "files" / "api" / "avatars-system.json").read_text(encoding="utf-8"))
    STATIC.mkdir(parents=True, exist_ok=True)
    out = []
    for a in src:
        aid = a["id"]
        cover = a.get("cover") or {}
        url = cover.get("full_thumb_url") or cover.get("thumb_url")
        local_url = url
        if url:
            ext = ".png" if url.lower().endswith(".png") else ".webp"
            dest = STATIC / f"{aid}{ext}"
            if not dest.exists():
                print("GET", url)
                req = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(req, timeout=60) as r:
                    dest.write_bytes(r.read())
            local_url = f"{LOCAL}/static/avatars/{aid}{ext}"
            rec = dict(a)
            rec["cover"] = {
                "thumb_url": local_url,
                "full_thumb_url": local_url,
            }
            out.append(rec)
        else:
            out.append(a)
        print("cover", aid, dest if url else "none")
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / "avatars.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("avatars.json", len(out))
    packed = DST / "avatars"
    packed.mkdir(parents=True, exist_ok=True)
    for png in STATIC.glob("*.png"):
        shutil.copy2(png, packed / png.name)
    print("packed avatars", len(list(packed.glob("*.png"))))


if __name__ == "__main__":
    copy_tree()
    patch_urls()
    patch_overlay()
    patch_manifest()
    patch_inject()
    download_covers()
    print("DONE", DST)
