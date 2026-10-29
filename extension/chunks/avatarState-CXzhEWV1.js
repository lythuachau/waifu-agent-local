/** A gesture the renderer never reports complete stops holding up the reply after this */
var GESTURE_TIMEOUT_MS = 1e4;
var SpeechState = class {
	apply;
	settleMs;
	#state = "listening";
	#settle = null;
	constructor(apply, settleMs = 400) {
		this.apply = apply;
		this.settleMs = settleMs;
	}
	get state() {
		return this.#state;
	}
	/** Audio has started playing */
	audioStarted() {
		this.#cancelSettle();
		this.#set("speaking");
	}
	/** Audio has stopped on its own; more may follow right away (the next chunk) */
	audioEnded() {
		if (this.#state !== "speaking" || this.#settle) return;
		this.#settle = setTimeout(() => {
			this.#settle = null;
			this.#set("listening");
		}, this.settleMs);
	}
	/** Nothing is playing and nothing will (stop, barge-in, a gesture): listening now */
	silence() {
		this.#cancelSettle();
		this.#set("listening");
	}
	dispose() {
		this.#cancelSettle();
	}
	#cancelSettle() {
		if (this.#settle) clearTimeout(this.#settle);
		this.#settle = null;
	}
	#set(state) {
		if (state === this.#state) return;
		this.#state = state;
		this.apply(state);
	}
};
function keepAvatarState(renderer, intervalMs = 200) {
	let desired = "listening";
	/** Gestures still playing; released when speech takes over or the keeper is disposed */
	const playing = /* @__PURE__ */ new Set();
	const releaseGestures = () => {
		for (const done of [...playing]) done();
	};
	const play = (action, fallback) => {
		try {
			renderer.play(action, fallback);
		} catch (error) {
			console.warn("[avatar] play failed", action, error);
		}
	};
	const reconcile = () => {
		if (renderer.state !== "ready") return;
		const target = renderer.getTargetAction();
		if (target === desired) return;
		if (desired === "listening" && target && isOneShot(renderer, target)) return;
		play(desired);
	};
	const timer = setInterval(reconcile, intervalMs);
	return {
		set(state) {
			desired = state;
			if (state === "speaking") releaseGestures();
			reconcile();
		},
		gesture(action, options) {
			if (desired === "speaking" || renderer.state !== "ready") return Promise.resolve();
			const kind = kindOf(renderer, action);
			if (!kind) {
				if (!options?.optional) console.warn(`[avatar] no action "${action}" on this avatar; skipping it`);
				return Promise.resolve();
			}
			return new Promise((resolve) => {
				let off = null;
				const done = () => {
					if (!playing.delete(done)) return;
					clearTimeout(timeout);
					off?.();
					resolve();
				};
				playing.add(done);
				const timeout = setTimeout(() => {
					console.warn(`[avatar] "${action}" did not report finishing; moving on`);
					done();
				}, GESTURE_TIMEOUT_MS);
				if (kind === "oneshot") off = renderer.onOneshotComplete((id) => id === action && done());
				play(action, "listening");
				if (kind !== "oneshot") done();
			});
		},
		dispose() {
			clearInterval(timer);
			releaseGestures();
		}
	};
}
function isOneShot(renderer, action) {
	if (action === "speaking" || action === "listening") return false;
	return kindOf(renderer, action) === "oneshot";
}
function kindOf(renderer, action) {
	try {
		return renderer.getActionMetadata()[action]?.kind;
	} catch {
		return;
	}
}
//#endregion
export { keepAvatarState as n, SpeechState as t };
