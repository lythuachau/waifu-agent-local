var background = (function() {
	//#region ../../node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
	//#endregion
	//#region src/agent/RemotePageController.background.ts
	/**
	* background logics for RemotePageController
	* - redirect messages from RemotePageController(Agent, extension pages) to ContentScript
	*/
	function handlePageControlMessage(message, sender, sendResponse) {
		const PREFIX = "[RemotePageController.background]";
		const debug = console.debug.bind(console, `\x1b[90m${PREFIX}\x1b[0m`);
		const { action, payload, targetTabId } = message;
		if (action === "get_my_tab_id") {
			debug("get_my_tab_id", sender.tab?.id);
			sendResponse({ tabId: sender.tab?.id || null });
			return;
		}
		chrome.tabs.sendMessage(targetTabId, {
			type: "PAGE_CONTROL",
			action,
			payload
		}).then((result) => {
			sendResponse(result);
		}).catch((error) => {
			console.error(PREFIX, error);
			sendResponse({
				success: false,
				error: error instanceof Error ? error.message : String(error)
			});
		});
		return true;
	}
	//#endregion
	//#region src/agent/TabsController.background.ts
	var PREFIX = "[TabsController.background]";
	var debug = console.debug.bind(console, `\x1b[90m${PREFIX}\x1b[0m`);
	/**
	* Resolve active tab.
	*
	* - `tabs.query({ active: true })` does not work in multi-window scenarios.
	* - Extension pages (the side panel) can resolve their own windowId.
	*   We just find the active tab within that window.
	* - Content scripts can't self-report a windowId.
	*   Chrome populates `sender.tab` for every content-script message,
	*   which is the tab hosting the script.
	*/
	async function resolveActiveTab(payload, sender) {
		const windowId = payload?.windowId;
		if (windowId != null) {
			debug("get_active_tab: resolving via caller-reported windowId", windowId);
			const [tab] = await chrome.tabs.query({
				active: true,
				windowId
			});
			if (!tab) throw new Error(`No active tab found in window ${windowId}.`);
			return tab;
		}
		if (sender.tab) {
			debug("get_active_tab: resolving via sender.tab (content script)", sender.tab.id);
			return sender.tab;
		}
		throw new Error("Cannot resolve active tab: caller reported no windowId and is not a content script (no sender.tab).");
	}
	function handleTabControlMessage(message, sender, sendResponse) {
		const { action, payload } = message;
		switch (action) {
			case "get_active_tab":
				debug("get_active_tab", payload);
				resolveActiveTab(payload, sender).then((tab) => {
					debug("get_active_tab: success", tab);
					sendResponse({
						success: true,
						tab
					});
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "get_tab_info":
				debug("get_tab_info", payload);
				chrome.tabs.get(payload.tabId).then((tab) => {
					debug("get_tab_info: success", tab);
					sendResponse(tab);
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "open_new_tab":
				debug("open_new_tab", payload);
				chrome.tabs.create({
					url: payload.url,
					windowId: payload.windowId,
					active: false
				}).then((newTab) => {
					debug("open_new_tab: success", newTab);
					sendResponse({
						success: true,
						tabId: newTab.id
					});
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "create_tab_group":
				debug("create_tab_group", payload);
				chrome.tabs.group({
					tabIds: payload.tabIds,
					createProperties: { windowId: payload.windowId }
				}).then((groupId) => {
					debug("create_tab_group: success", groupId);
					sendResponse({
						success: true,
						groupId
					});
				}).catch((error) => {
					console.error(PREFIX, "Failed to create tab group", error);
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "update_tab_group":
				debug("update_tab_group", payload);
				chrome.tabGroups.update(payload.groupId, payload.properties).then(() => {
					sendResponse({ success: true });
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "add_tab_to_group":
				debug("add_tab_to_group", payload);
				chrome.tabs.group({
					tabIds: payload.tabId,
					groupId: payload.groupId
				}).then(() => {
					sendResponse({ success: true });
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "navigate_tab":
				debug("navigate_tab", payload);
				chrome.tabs.update(payload.tabId, { url: payload.url }).then(() => {
					sendResponse({ success: true });
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "close_tab":
				debug("close_tab", payload);
				chrome.tabs.remove(payload.tabId).then(() => {
					sendResponse({ success: true });
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			case "get_window_tabs":
				chrome.tabs.query({ windowId: payload.windowId }).then((tabs) => {
					sendResponse({
						success: true,
						tabs
					});
				}).catch((error) => {
					sendResponse({ error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			default:
				sendResponse({ error: `Unknown action: ${action}` });
				return;
		}
	}
	//#endregion
	//#region src/entrypoints/background.ts
	var background_default = defineBackground(() => {
		console.log("[Background] Service Worker started");
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.type === "TAB_CONTROL") return handleTabControlMessage(message, sender, sendResponse);
			else if (message.type === "PAGE_CONTROL") return handlePageControlMessage(message, sender, sendResponse);
			else if (message.type === "ZW_INJECT") {
				const tabId = message.tabId;
				if (tabId == null || !chrome.scripting) {
					sendResponse({ ok: false, error: "scripting unavailable" });
					return;
				}
				chrome.scripting.executeScript({
					target: { tabId },
					files: ["content-scripts/content.js"]
				}).then(() => sendResponse({ ok: true })).catch((error) => sendResponse({
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				}));
				return true;
			} else if (message.type === "ZW_FETCH") {
				const url = String(message.url || "");
				let parsed;
				try {
					parsed = new URL(url);
				} catch {
					sendResponse({ ok: false, error: "bad url" });
					return;
				}
				const local = (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost") && parsed.port === "8787" && (parsed.protocol === "http:" || parsed.protocol === "https:");
				if (!local) {
					sendResponse({ ok: false, error: "not local api" });
					return;
				}
				fetch(url).then(async (r) => {
					const buffer = await r.arrayBuffer();
					sendResponse({
						ok: r.ok,
						status: r.status,
						contentType: r.headers.get("content-type") || "application/octet-stream",
						buffer
					});
				}).catch((error) => {
					sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
				});
				return true;
			} else if (message.type === "AVATAR_EVENT") {
				return;
			} else {
				sendResponse({ error: "Unknown message type" });
				return;
			}
		});
		chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
		const zwRestricted = (url) => !url || /^(chrome|edge|devtools|chrome-extension|about|brave|opera|vivaldi):/i.test(url) || /chromewebstore\.google\.com|chrome\.google\.com\/webstore/.test(url);
		const zwInjectAll = () => {
			if (!chrome.scripting) return;
			chrome.tabs.query({}).then((tabs) => {
				for (const tab of tabs) {
					if (!tab.id || zwRestricted(tab.url || "")) continue;
					chrome.scripting.executeScript({
						target: { tabId: tab.id },
						files: ["content-scripts/content.js"]
					}).catch(() => {});
				}
			}).catch(() => {});
		};
		chrome.runtime.onInstalled.addListener(zwInjectAll);
		zwInjectAll();
	});
	globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?/Users/minhanh29/Desktop/Workspace/ZeroWeight/FE/zw-waifu-agent/packages/extension/src/entrypoints/background.ts
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => ([...args], void 0),
		log: (...args) => ([...args], void 0),
		warn: (...args) => ([...args], void 0),
		error: (...args) => ([...args], void 0)
	};
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();
