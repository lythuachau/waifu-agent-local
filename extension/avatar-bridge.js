/**
 * Local Waifu Agent overlay bridge.
 *
 * Chrome blocks content scripts on chrome://, the Web Store, and NTP.
 * Tabs opened before "Load unpacked" also miss the content script until reload.
 *
 * This file:
 *   1. Injects content-scripts/content.js on demand (scripting permission).
 *   2. Does not navigate chrome:// (Manage extension, NTP, …) to /stage.
 *   3. Mounts the 3D avatar in the side panel as soon as the tool is ready,
 *      so she is visible even when the active tab is chrome:// / NTP.
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

	let panelIframe = null;
	let panelOrigin = "";
	let panelKey = "";
	let panelPayload = null;

	function payloadKey(p) {
		if (!p) return "";
		if (p.zw_local) return "local:" + (p.id || p.image || "");
		return String(p.sig || p.id || "");
	}

	function panelStage() {
		let host = document.getElementById("zw-local-stage");
		if (host) return host;
		host = document.createElement("div");
		host.id = "zw-local-stage";
		host.setAttribute("aria-hidden", "true");
		host.style.cssText = [
			"position:fixed",
			"right:2px",
			"bottom:86px",
			"width:176px",
			"height:264px",
			"z-index:40",
			"pointer-events:none",
			"display:flex",
			"align-items:flex-end",
			"justify-content:center"
		].join(";");
		(document.body || document.documentElement).appendChild(host);
		return host;
	}

	function showPanelPng(host, payload) {
		host.replaceChildren();
		panelIframe = null;
		panelOrigin = "";
		panelKey = payloadKey(payload);
		const img = document.createElement("img");
		img.alt = "";
		img.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;object-position:bottom center;filter:drop-shadow(0 10px 18px rgba(0,0,0,.45));";
		if (payload && payload.image) img.src = payload.image;
		host.appendChild(img);
	}

	function showPanel3d(host, payload) {
		const key = payloadKey(payload);
		if (panelIframe && panelKey === key) return;
		host.replaceChildren();
		panelKey = key;
		panelPayload = payload;
		const frame = document.createElement("iframe");
		frame.src = chrome.runtime.getURL("/avatar-frame.html");
		frame.allow = "autoplay";
		frame.style.cssText = "width:100%;height:100%;border:0;display:block;background:transparent;color-scheme:light;pointer-events:none;";
		frame.setAttribute("allowtransparency", "true");
		panelIframe = frame;
		host.appendChild(frame);
	}

	window.addEventListener("message", (event) => {
		if (!panelIframe || event.source !== panelIframe.contentWindow) return;
		if (event.data?.type === "avatar-frame/ready") {
			try { panelOrigin = new URL(panelIframe.src).origin; } catch { panelOrigin = "*"; }
			panelIframe.contentWindow.postMessage({ type: "avatar-frame/init", payload: panelPayload }, panelOrigin);
		}
		if (event.data?.type === "avatar-frame/error") {
			console.warn("[avatar-bridge] panel 3D failed:", event.data.message);
			const host = document.getElementById("zw-local-stage");
			const img = panelPayload && (panelPayload.image || panelPayload.payload && panelPayload.payload.image);
			if (host && img) showPanelPng(host, { zw_local: true, image: img });
		}
	});

	function showPanelPreview(payload) {
		try {
			const host = panelStage();
			host.style.display = "flex";
			if (!payload) return;
			if (payload.zw_local) showPanelPng(host, payload);
			else showPanel3d(host, payload);
		} catch {
			/* side panel DOM not ready */
		}
	}

	function hidePanelPreview() {
		const host = document.getElementById("zw-local-stage");
		if (host) host.style.display = "none";
	}

	function panelSetState(state) {
		if (!state || !panelIframe || !panelIframe.contentWindow) return;
		panelIframe.contentWindow.postMessage({ type: "avatar-frame/state", state }, panelOrigin || "*");
	}

	function panelGesture(name, optional) {
		if (!name || !panelIframe || !panelIframe.contentWindow) return;
		panelIframe.contentWindow.postMessage({
			type: "avatar-frame/gesture",
			action: name,
			id: Date.now(),
			optional: optional === true
		}, panelOrigin || "*");
	}

	g.zwSendAvatar = async function zwSendAvatar(tabId, message) {
		if (message && message.action === "show") showPanelPreview(message.payload);
		if (message && message.action === "hide") hidePanelPreview();
		if (message && message.action === "state") panelSetState(message.state);
		if (message && message.action === "gesture") panelGesture(message.name, message.optional);
		if (tabId == null) return { ok: true, panel: true };

		let tab;
		try {
			tab = await chrome.tabs.get(tabId);
		} catch {
			return { ok: true, panel: true, error: "That tab is gone." };
		}

		const url = tab.url || "";
		const pending = tab.pendingUrl || "";
		if (restricted(url) || restricted(pending)) {
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
