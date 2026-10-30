(() => {
	if (globalThis.__zwPageTextHook) return;
	globalThis.__zwPageTextHook = true;
	const proto = CanvasRenderingContext2D.prototype;
	const origFill = proto.fillText;
	const origStroke = proto.strokeText;
	const widthDesc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "width");
	function dumpEl() {
		let el = document.getElementById("zw-canvas-text-dump");
		if (!el) {
			el = document.createElement("div");
			el.id = "zw-canvas-text-dump";
			el.setAttribute("hidden", "");
			el.setAttribute("data-waifu-agent-not-interactive", "true");
			el.style.cssText = "display:none!important;position:absolute;width:0;height:0;overflow:hidden;";
			(document.documentElement || document.body)?.appendChild(el);
		}
		return el;
	}
	function canvasLine(c) {
		return Array.isArray(c.__zwLine) ? c.__zwLine.join("") : "";
	}
	function canvasArea(c) {
		const r = c.getBoundingClientRect();
		const w = r.width || c.width || 0;
		const h = r.height || c.height || 0;
		return w * h;
	}
	function isReaderCanvas(c) {
		return /novel-reader__canvas|reader__canvas/i.test(c.className || "");
	}
	/** Novel body only: named reader canvas, else the largest canvas that has text. */
	function pickReaderCanvas() {
		const canvases = [...document.querySelectorAll("canvas")];
		const named = canvases.filter(isReaderCanvas);
		const pool = named.length ? named : canvases;
		let best = null;
		for (const c of pool) {
			const line = canvasLine(c).trim();
			if (!line) continue;
			const area = canvasArea(c);
			if (!best || line.length > best.line.length || line.length === best.line.length && area > best.area) {
				best = { c, line, area };
			}
		}
		return best;
	}
	function publish() {
		const picked = pickReaderCanvas();
		const el = dumpEl();
		if (!el.isConnected) return;
		el.textContent = picked ? picked.line : "";
		el.setAttribute("data-zw-canvas", picked ? String(picked.c.className || "largest") : "");
	}
	let raf = 0;
	function schedulePublish() {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = 0;
			try {
				publish();
			} catch {}
		});
	}
	function capture(text, canvas) {
		if (!canvas || text == null) return;
		const s = String(text);
		if (!s || s === "(*)") return;
		if (!Array.isArray(canvas.__zwLine)) canvas.__zwLine = [];
		canvas.__zwLine.push(s);
		schedulePublish();
	}
	proto.fillText = function (text, x, y, maxWidth) {
		try {
			capture(text, this.canvas);
		} catch {}
		return maxWidth === void 0 ? origFill.call(this, text, x, y) : origFill.call(this, text, x, y, maxWidth);
	};
	proto.strokeText = function (text, x, y, maxWidth) {
		try {
			capture(text, this.canvas);
		} catch {}
		return maxWidth === void 0 ? origStroke.call(this, text, x, y) : origStroke.call(this, text, x, y, maxWidth);
	};
	if (widthDesc && widthDesc.set && widthDesc.get) {
		Object.defineProperty(HTMLCanvasElement.prototype, "width", {
			configurable: true,
			enumerable: widthDesc.enumerable,
			get() {
				return widthDesc.get.call(this);
			},
			set(v) {
				this.__zwLine = [];
				return widthDesc.set.call(this, v);
			}
		});
	}
})();
