"""Headless check: local bundle token + WASM renderer.init against local .zai."""
from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(r"E:\ll\waifu-agent-extract\self-host")
URL = "http://127.0.0.1:8787/static/renderer-live.html"


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"],
        )
        page = browser.new_page()
        page.on("console", lambda msg: print("CONSOLE", msg.type, msg.text))
        page.on("pageerror", lambda err: print("PAGEERROR", err))
        page.goto(URL, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_function(
            "() => (document.getElementById('out')?.textContent || '').includes('DONE')",
            timeout=200000,
        )
        page.wait_for_timeout(2500)
        text = page.locator("#out").inner_text()
        print("==== OUT ====")
        print(text)
        page.locator("#c").screenshot(path=str(OUT / "offline-renderer-canvas.png"))
        page.screenshot(path=str(OUT / "offline-renderer.png"), omit_background=False)
        print("screenshot", OUT / "offline-renderer.png")
        browser.close()


if __name__ == "__main__":
    main()
