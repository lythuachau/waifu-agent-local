/**
 * Local Waifu Agent overlay bridge.
 *
 * Chrome blocks content scripts on chrome://, the Web Store, and NTP.
 * Tabs opened before "Load unpacked" also miss the content script until reload.
 *
 * This file:
 *   1. Injects content-scripts/content.js on demand (scripting permission).
 *   2. Does not navigate chrome:// (Manage extension, NTP, …) to /stage.
 *   3. Does not treat an empty pendingUrl as restricted (loaded http(s) tabs
 *      were skipped). Overlay stays on the page: drag, resize, poke.
 */
(function (g) {
	const STAGE = "http://127.0.0.1:8787/stage";

	function restricted(url) {
		if (!url) return true;
		return /^(chrome|edge|devtools|chrome-extension|about|brave|opera|vivaldi):/i.test(url)
			|| /chromewebstore\.google\.com|chrome\.google\.com\/webstore/.test(url);
	}

	function isNewTab(url) {
		if (!url) return true;
		return /^(chrome|edge|about):(\/\/)?(newtab|new-tab-page|startpage|ntp)/i.test(url)
			|| url === "about:blank"
			|| /\/_/i.test(url) && /newtab/i.test(url);
	}

	function sleep(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}

	async function inject(tabId) {
		try {
			await chrome.scripting.executeScript({
				target: { tabId },
				files: ["content-scripts/content.js"]
			});
		} catch (error) {
			const viaBg = await chrome.runtime.sendMessage({ type: "ZW_INJECT", tabId }).catch(() => null);
			if (!viaBg || !viaBg.ok) throw error;
		}
		await sleep(80);
	}

	function waitComplete(tabId, timeoutMs) {
		return new Promise((resolve) => {
			let done = false;
			const finish = (tab) => {
				if (done) return;
				done = true;
				chrome.tabs.onUpdated.removeListener(onUp);
				resolve(tab || null);
			};
			const timer = setTimeout(() => finish(null), timeoutMs);
			function onUp(id, info, tab) {
				if (id === tabId && info.status === "complete") {
					clearTimeout(timer);
					finish(tab);
				}
			}
			chrome.tabs.onUpdated.addListener(onUp);
			chrome.tabs.get(tabId).then((tab) => {
				if (tab.status === "complete" && tab.url && !restricted(tab.url)) {
					clearTimeout(timer);
					finish(tab);
				}
			}).catch(() => {});
		});
	}

	async function openStage(fromTabId, fromUrl) {
		const existing = await chrome.tabs.query({ url: STAGE + "*" });
		if (existing[0]?.id != null) {
			return await chrome.tabs.update(existing[0].id, { active: true });
		}
		return await chrome.tabs.create({ url: STAGE, active: true });
	}

	function panelImg() {
		let host = document.getElementById("zw-local-stage");
		if (host) return host.querySelector("img");
		host = document.createElement("div");
		host.id = "zw-local-stage";
		host.setAttribute("aria-hidden", "true");
		host.style.cssText = [
			"position:fixed",
			"right:4px",
			"bottom:92px",
			"width:148px",
			"height:210px",
			"z-index:30",
			"pointer-events:none",
			"display:flex",
			"align-items:flex-end",
			"justify-content:center"
		].join(";");
		const img = document.createElement("img");
		img.alt = "";
		img.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;object-position:bottom center;filter:drop-shadow(0 10px 18px rgba(0,0,0,.45));";
		host.appendChild(img);
		(document.body || document.documentElement).appendChild(host);
		return img;
	}

	function showPanelPreview(payload) {
		try {
			const img = panelImg();
			const url = payload && payload.image;
			if (url) img.src = url;
			img.parentElement.style.display = "flex";
		} catch {
			/* side panel DOM not ready */
		}
	}

	function hidePanelPreview() {
		const host = document.getElementById("zw-local-stage");
		if (host) host.style.display = "none";
	}

	g.zwSendAvatar = async function zwSendAvatar(tabId, message) {
		if (message && message.action === "show") showPanelPreview(message.payload);
		if (message && message.action === "hide") hidePanelPreview();
		if (tabId == null) return { ok: true, panel: true };

		let tab;
		try {
			tab = await chrome.tabs.get(tabId);
		} catch {
			return { ok: true, panel: true, error: "That tab is gone." };
		}

		const url = tab.url || "";
		const pending = tab.pendingUrl || "";
		if (restricted(url) || pending && restricted(pending)) {
			return { ok: true, panel: true };
		}

		const payload = { type: "AVATAR", ...message };
		try {
			return await chrome.tabs.sendMessage(tabId, payload);
		} catch {
			try {
				await inject(tabId);
				return await chrome.tabs.sendMessage(tabId, payload);
			} catch (error) {
				return {
					ok: true,
					panel: true,
					error: error instanceof Error ? error.message : "Reload the website tab once, then try again."
				};
			}
		}
	};
})(globalThis);
