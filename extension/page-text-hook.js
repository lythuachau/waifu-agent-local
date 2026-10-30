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
	function publish() {
		const canvases = document.querySelectorAll("canvas");
		const parts = [];
		for (const c of canvases) {
			const line = Array.isArray(c.__zwLine) ? c.__zwLine.join("") : "";
			if (line.trim()) parts.push(line.trim());
		}
		const el = dumpEl();
		if (el.isConnected) el.textContent = parts.join("\n\n");
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
