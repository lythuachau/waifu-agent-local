(() => {
	if (globalThis.__zwPageTextHook) return;
	globalThis.__zwPageTextHook = true;
	const proto = CanvasRenderingContext2D.prototype;
	const origFill = proto.fillText;
	const origStroke = proto.strokeText;
	const widthDesc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "width");

	function el(id) {
		let n = document.getElementById(id);
		if (!n) {
			n = document.createElement("div");
			n.id = id;
			n.setAttribute("hidden", "");
			n.setAttribute("data-waifu-agent-not-interactive", "true");
			n.style.cssText = "display:none!important;position:absolute;width:0;height:0;overflow:hidden;";
			(document.documentElement || document.body)?.appendChild(n);
		}
		return n;
	}

	function captureCanvas(text, canvas) {
		if (!canvas || text == null) return;
		const s = String(text);
		if (!s || s === "(*)") return;
		if (!Array.isArray(canvas.__zwLine)) canvas.__zwLine = [];
		canvas.__zwLine.push(s);
		schedule();
	}

	proto.fillText = function (text, x, y, maxWidth) {
		try { captureCanvas(text, this.canvas); } catch {}
		return maxWidth === void 0 ? origFill.call(this, text, x, y) : origFill.call(this, text, x, y, maxWidth);
	};
	proto.strokeText = function (text, x, y, maxWidth) {
		try { captureCanvas(text, this.canvas); } catch {}
		return maxWidth === void 0 ? origStroke.call(this, text, x, y) : origStroke.call(this, text, x, y, maxWidth);
	};
	if (widthDesc && widthDesc.set && widthDesc.get) {
		Object.defineProperty(HTMLCanvasElement.prototype, "width", {
			configurable: true,
			enumerable: widthDesc.enumerable,
			get() { return widthDesc.get.call(this); },
			set(v) {
				this.__zwLine = [];
				return widthDesc.set.call(this, v);
			}
		});
	}

	function canvasDump() {
		const parts = [];
		for (const c of document.querySelectorAll("canvas")) {
			const line = Array.isArray(c.__zwLine) ? c.__zwLine.join("") : "";
			if (line.trim()) parts.push(line.trim());
		}
		return parts.join("\n\n");
	}

	function walkShadow(root, out, depth) {
		if (!root || depth > 8) return;
		let t = "";
		try { t = (root.innerText || root.textContent || "").trim(); } catch {}
		if (t.length > 40) out.push(t);
		const nodes = root.querySelectorAll ? root.querySelectorAll("*") : [];
		for (const n of nodes) {
			if (n.shadowRoot) walkShadow(n.shadowRoot, out, depth + 1);
		}
	}

	function svgText() {
		const bits = [];
		for (const n of document.querySelectorAll("svg text, svg tspan")) {
			const t = (n.textContent || "").trim();
			if (t) bits.push(t);
		}
		return bits.join(" ");
	}

	function readerBlocks() {
		const sel = [
			"article",
			"main",
			"[role='main']",
			".novel-reader",
			".chapter-content",
			"#chapter-content",
			".content-body",
			"#content",
			".entry-content",
			".post-content"
		].join(",");
		const parts = [];
		try {
			for (const n of document.querySelectorAll(sel)) {
				const t = (n.innerText || "").trim();
				if (t.length > 80) parts.push(t);
			}
		} catch {}
		return parts.sort((a, b) => b.length - a.length)[0] || "";
	}

	function pageDump() {
		const chunks = [];
		const block = readerBlocks();
		if (block) chunks.push(block);
		const svg = svgText();
		if (svg.length > 40) chunks.push(svg);
		try { walkShadow(document, chunks, 0); } catch {}
		let best = "";
		for (const c of chunks) if (c.length > best.length) best = c;
		return best;
	}

	function publish() {
		const canvas = canvasDump();
		const page = pageDump();
		const cEl = el("zw-canvas-text-dump");
		if (cEl.isConnected) cEl.textContent = canvas;
		const pEl = el("zw-page-text-dump");
		if (pEl.isConnected) pEl.textContent = page;
	}

	let raf = 0;
	function schedule() {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = 0;
			try { publish(); } catch {}
		});
	}

	["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach((type) => {
		document.addEventListener(type, () => schedule(), true);
	});
	new MutationObserver(() => schedule()).observe(document.documentElement, {
		subtree: true,
		childList: true,
		characterData: true
	});
	setInterval(schedule, 1500);
	schedule();

	let lastHref = location.href;
	function resetDrawnText() {
		for (const c of document.querySelectorAll("canvas")) c.__zwLine = [];
		const canvasEl = document.getElementById("zw-canvas-text-dump");
		if (canvasEl) canvasEl.textContent = "";
		const pageEl = document.getElementById("zw-page-text-dump");
		if (pageEl) pageEl.textContent = "";
	}
	function onLocationChange() {
		if (location.href === lastHref) return;
		lastHref = location.href;
		resetDrawnText();
		schedule();
	}
	const pushState = history.pushState;
	history.pushState = function () {
		const result = pushState.apply(this, arguments);
		onLocationChange();
		return result;
	};
	const replaceState = history.replaceState;
	history.replaceState = function () {
		const result = replaceState.apply(this, arguments);
		onLocationChange();
		return result;
	};
	window.addEventListener("popstate", onLocationChange);
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) schedule();
	});
	window.addEventListener("pageshow", () => schedule());
	setInterval(onLocationChange, 400);
})();
