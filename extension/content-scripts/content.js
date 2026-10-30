(function() {
	if (globalThis.__zwWaifuContentLoaded) return;
	globalThis.__zwWaifuContentLoaded = true;
	var __vite_style__ = document.createElement("style");
	__vite_style__.textContent = "._wrapper_1ooyb_1 {\n	position: fixed;\n	inset: 0;\n	z-index: 2147483641; /* 确保在所有元素之上，除了 panel */\n	cursor: wait;\n	overflow: hidden;\n\n	display: none;\n}\n\n._wrapper_1ooyb_1._visible_1ooyb_11 {\n	display: block;\n}\n/* AI 光标样式 */\n._cursor_a9twe_2 {\n	position: absolute;\n	width: var(--cursor-size, 75px);\n	height: var(--cursor-size, 75px);\n	pointer-events: none;\n	z-index: 10000;\n}\n\n._cursorBorder_a9twe_10 {\n	position: absolute;\n	width: 100%;\n	height: 100%;\n	/* ZeroWeight orange */\n	background: linear-gradient(45deg, rgb(232, 168, 115), rgb(201, 125, 67));\n	mask-image: url(\"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%20fill='none'%3e%3cg%3e%3cpath%20d='M%2015%2042%20L%2015%2036.99%20Q%2015%2031.99%2023.7%2031.99%20L%2028.05%2031.99%20Q%2032.41%2031.99%2032.41%2021.99%20L%2032.41%2017%20Q%2032.41%2012%2041.09%2016.95%20L%2076.31%2037.05%20Q%2085%2042%2076.31%2046.95%20L%2041.09%2067.05%20Q%2032.41%2072%2032.41%2062.01%20L%2032.41%2057.01%20Q%2032.41%2052.01%2023.7%2052.01%20L%2019.35%2052.01%20Q%2015%2052.01%2015%2047.01%20Z'%20fill='none'%20stroke='%23000000'%20stroke-width='6'%20stroke-miterlimit='10'%20style='stroke:%20light-dark(rgb(0,%200,%200),%20rgb(255,%20255,%20255));'/%3e%3c/g%3e%3c/svg%3e\");\n	mask-size: 100% 100%;\n	mask-repeat: no-repeat;\n\n	transform-origin: center;\n	transform: rotate(-135deg) scale(1.2);\n	margin-left: -10px;\n	margin-top: -18px;\n}\n\n._cursorFilling_a9twe_26 {\n	position: absolute;\n	width: 100%;\n	height: 100%;\n	background: url(\"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3e%3cdefs%3e%3c/defs%3e%3cg%20xmlns='http://www.w3.org/2000/svg'%20style='filter:%20drop-shadow(light-dark(rgba(0,%200,%200,%200.4),%20rgba(237,%20237,%20237,%200.4))%203px%204px%204px);'%3e%3cpath%20d='M%2015%2042%20L%2015%2036.99%20Q%2015%2031.99%2023.7%2031.99%20L%2028.05%2031.99%20Q%2032.41%2031.99%2032.41%2021.99%20L%2032.41%2017%20Q%2032.41%2012%2041.09%2016.95%20L%2076.31%2037.05%20Q%2085%2042%2076.31%2046.95%20L%2041.09%2067.05%20Q%2032.41%2072%2032.41%2062.01%20L%2032.41%2057.01%20Q%2032.41%2052.01%2023.7%2052.01%20L%2019.35%2052.01%20Q%2015%2052.01%2015%2047.01%20Z'%20fill='%23ffffff'%20stroke='none'%20style='fill:%20%23ffffff;'/%3e%3c/g%3e%3c/svg%3e\");\n	background-size: 100% 100%;\n	background-repeat: no-repeat;\n\n	transform-origin: center;\n	transform: rotate(-135deg) scale(1.2);\n	margin-left: -10px;\n	margin-top: -18px;\n}\n\n._cursorRipple_a9twe_40 {\n	position: absolute;\n	width: 100%;\n	height: 100%;\n	pointer-events: none;\n	margin-left: -50%;\n	margin-top: -50%;\n\n	&::after {\n		content: '';\n		opacity: 0;\n		position: absolute;\n		inset: 0;\n		border: 4px solid rgba(218, 146, 83, 1);\n		border-radius: 50%;\n	}\n}\n\n._cursor_a9twe_2._clicking_a9twe_58 ._cursorRipple_a9twe_40::after {\n	animation: _cursor-ripple_a9twe_1 300ms ease-out forwards;\n}\n\n@keyframes _cursor-ripple_a9twe_1 {\n	0% {\n		transform: scale(0);\n		opacity: 1;\n	}\n	100% {\n		transform: scale(2);\n		opacity: 0;\n	}\n}\n/*$vite$:1*/";
	document.head.appendChild(__vite_style__);
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	//#endregion
	//#region ../../node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region ../page-controller/src/utils/index.ts
	function isHTMLElement(el) {
		return !!el && el.nodeType === 1;
	}
	function isInputElement(el) {
		return el?.nodeType === 1 && el.tagName === "INPUT";
	}
	function isTextAreaElement(el) {
		return el?.nodeType === 1 && el.tagName === "TEXTAREA";
	}
	function isSelectElement(el) {
		return el?.nodeType === 1 && el.tagName === "SELECT";
	}
	/** Iframe offset for translating element coordinates to top-frame viewport. */
	function getIframeOffset(element) {
		const frame = element.ownerDocument.defaultView?.frameElement;
		if (!frame) return {
			x: 0,
			y: 0
		};
		const rect = frame.getBoundingClientRect();
		return {
			x: rect.left,
			y: rect.top
		};
	}
	/**
	* Get native value setter from the element's own prototype (iframe-safe).
	* @note for React
	*/
	function getNativeValueSetter(element) {
		return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value").set;
	}
	async function waitFor(seconds) {
		await new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
	}
	/**
	* Move the visual pointer to a position within an element.
	* @param x - x coordinate in the element's document viewport
	* @param y - y coordinate in the element's document viewport
	*/
	async function movePointerToElement(element, x, y) {
		const offset = getIframeOffset(element);
		window.dispatchEvent(new CustomEvent("WaifuAgent::MovePointerTo", { detail: {
			x: x + offset.x,
			y: y + offset.y
		} }));
		await waitFor(.3);
	}
	async function clickPointer() {
		window.dispatchEvent(new CustomEvent("WaifuAgent::ClickPointer"));
	}
	async function enablePassThrough() {
		window.dispatchEvent(new CustomEvent("WaifuAgent::EnablePassThrough"));
	}
	async function disablePassThrough() {
		window.dispatchEvent(new CustomEvent("WaifuAgent::DisablePassThrough"));
	}
	//#endregion
	//#region ../page-controller/src/actions.ts
	/**
	* Get the HTMLElement by index from a selectorMap.
	* @private Internal method, subject to change at any time.
	*/
	function getElementByIndex(selectorMap, index) {
		const interactiveNode = selectorMap.get(index);
		if (!interactiveNode) throw new Error(`No interactive element found at index ${index}`);
		const element = interactiveNode.ref;
		if (!element) throw new Error(`Element at index ${index} does not have a reference`);
		if (!isHTMLElement(element)) throw new Error(`Element at index ${index} is not an HTMLElement`);
		return element;
	}
	var lastClickedElement = null;
	function blurLastClickedElement() {
		if (lastClickedElement) {
			lastClickedElement.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
			lastClickedElement.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));
			lastClickedElement.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
			lastClickedElement.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
			lastClickedElement.blur();
			lastClickedElement = null;
		}
	}
	function normalizeText(text) {
		return text.replace(/\u00a0/g, " ").trim();
	}
	function contentMatches(element, text) {
		return normalizeText(element.innerText) === normalizeText(text);
	}
	/** Focus a contenteditable and select all of its content, so the next insert replaces it. */
	async function selectAllContent(element) {
		element.focus();
		const doc = element.ownerDocument;
		const selection = (doc.defaultView || window).getSelection();
		const range = doc.createRange();
		range.selectNodeContents(element);
		selection?.removeAllRanges();
		selection?.addRange(range);
		await waitFor(.05);
	}
	var KEY_CODES = {
		Enter: 13,
		Escape: 27,
		Tab: 9,
		Backspace: 8,
		Delete: 46,
		" ": 32,
		ArrowUp: 38,
		ArrowDown: 40,
		ArrowLeft: 37,
		ArrowRight: 39
	};
	/** Keys `pressKeyElement` can press, by their `KeyboardEvent.key` value (`' '` is Space). */
	var SUPPORTED_KEYS = Object.keys(KEY_CODES);
	/**
	* Press a key on `element`: keydown → (keypress) → keyup.
	*
	* Synthetic key events never trigger the browser's default action, so the one default
	* that matters is reproduced: Enter in a form field submits the form, unless the page
	* handled the key itself (e.g. a comment box or search box with its own Enter handler).
	*
	* @returns whether the page handled the keydown (called `preventDefault`)
	* @private Internal method, subject to change at any time.
	*/
	async function pressKeyElement(element, key) {
		const keyCode = KEY_CODES[key];
		if (keyCode === void 0) throw new Error(`Unsupported key "${key}". Supported: ${SUPPORTED_KEYS.join(", ")}`);
		const init = {
			key,
			code: key === " " ? "Space" : key,
			keyCode,
			which: keyCode,
			bubbles: true,
			cancelable: true,
			composed: true
		};
		const keydown = new KeyboardEvent("keydown", init);
		element.dispatchEvent(keydown);
		if (key === "Enter") element.dispatchEvent(new KeyboardEvent("keypress", {
			...init,
			charCode: 13
		}));
		element.dispatchEvent(new KeyboardEvent("keyup", init));
		if (key === "Enter" && !keydown.defaultPrevented && isInputElement(element) && element.form) element.form.requestSubmit();
		await waitFor(.2);
		return keydown.defaultPrevented;
	}
	/**
	* The link a click on `element` would open in a new tab, if any.
	* `_blank` and named targets open a new tab; `_self`, `_top` and `_parent` do not.
	*/
	function newTabLink(element) {
		const link = element.closest("a");
		if (!link?.target || [
			"_self",
			"_top",
			"_parent"
		].includes(link.target)) return null;
		return link;
	}
	/**
	* Run `click` with `link` temporarily retargeted to the current tab.
	* The page's own markup is restored afterwards, even if the click throws.
	*/
	async function withLinkInSameTab(link, click) {
		const target = link.target;
		link.target = "_self";
		try {
			return await click();
		} finally {
			link.target = target;
		}
	}
	/**
	* Simulate a full click following W3C Pointer Events + UI Events spec order:
	* pointerover/enter → mouseover/enter → pointerdown → mousedown → [focus] →
	* pointerup → mouseup → click
	*
	* @private Internal method, subject to change at any time.
	*/
	async function clickElement(element) {
		blurLastClickedElement();
		lastClickedElement = element;
		await scrollIntoViewIfNeeded(element);
		const frame = element.ownerDocument.defaultView?.frameElement;
		if (frame) await scrollIntoViewIfNeeded(frame);
		const rect = element.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		await movePointerToElement(element, x, y);
		await clickPointer();
		await waitFor(.1);
		const doc = element.ownerDocument;
		await enablePassThrough();
		const hitTarget = doc.elementFromPoint(x, y);
		await disablePassThrough();
		const target = hitTarget instanceof HTMLElement && element.contains(hitTarget) ? hitTarget : element;
		const pointerOpts = {
			bubbles: true,
			cancelable: true,
			clientX: x,
			clientY: y,
			pointerType: "mouse"
		};
		const mouseOpts = {
			bubbles: true,
			cancelable: true,
			clientX: x,
			clientY: y,
			button: 0
		};
		target.dispatchEvent(new PointerEvent("pointerover", pointerOpts));
		target.dispatchEvent(new PointerEvent("pointerenter", {
			...pointerOpts,
			bubbles: false
		}));
		target.dispatchEvent(new MouseEvent("mouseover", mouseOpts));
		target.dispatchEvent(new MouseEvent("mouseenter", {
			...mouseOpts,
			bubbles: false
		}));
		target.dispatchEvent(new PointerEvent("pointerdown", pointerOpts));
		target.dispatchEvent(new MouseEvent("mousedown", mouseOpts));
		element.focus({ preventScroll: true });
		target.dispatchEvent(new PointerEvent("pointerup", pointerOpts));
		target.dispatchEvent(new MouseEvent("mouseup", mouseOpts));
		target.click();
		await waitFor(.2);
	}
	/**
	* @private Internal method, subject to change at any time.
	*/
	async function inputTextElement(element, text) {
		const isContentEditable = element.isContentEditable;
		if (!isInputElement(element) && !isTextAreaElement(element) && !isContentEditable) throw new Error("Element is not an input, textarea, or contenteditable");
		await clickElement(element);
		if (isContentEditable) {
			await selectAllContent(element);
			element.ownerDocument.execCommand("insertText", false, text);
			await waitFor(.1);
			if (!contentMatches(element, text)) {
				await selectAllContent(element);
				if (element.dispatchEvent(new InputEvent("beforeinput", {
					bubbles: true,
					cancelable: true,
					inputType: "insertText",
					data: text
				}))) {
					element.innerText = text;
					element.dispatchEvent(new InputEvent("input", {
						bubbles: true,
						inputType: "insertText",
						data: text
					}));
				}
				await waitFor(.1);
			}
			if (!contentMatches(element, text)) {
				const actual = normalizeText(element.innerText);
				throw new Error(`The editor did not accept the text. It now contains: "${actual.slice(0, 200)}"`);
			}
			element.dispatchEvent(new Event("change", { bubbles: true }));
		} else getNativeValueSetter(element).call(element, text);
		if (!isContentEditable) element.dispatchEvent(new Event("input", { bubbles: true }));
		await waitFor(.1);
	}
	/**
	* @todo browser-use version is very complex and supports menu tags, need to follow up
	* @private Internal method, subject to change at any time.
	*/
	async function selectOptionElement(selectElement, optionText) {
		if (!isSelectElement(selectElement)) throw new Error("Element is not a select element");
		const option = Array.from(selectElement.options).find((opt) => opt.textContent?.trim() === optionText.trim());
		if (!option) throw new Error(`Option with text "${optionText}" not found in select element`);
		selectElement.value = option.value;
		selectElement.dispatchEvent(new Event("change", { bubbles: true }));
		await waitFor(.1);
	}
	/**
	* @private Internal method, subject to change at any time.
	*/
	async function scrollIntoViewIfNeeded(element) {
		const el = element;
		if (typeof el.scrollIntoViewIfNeeded === "function") el.scrollIntoViewIfNeeded();
		else element.scrollIntoView({
			behavior: "auto",
			block: "center",
			inline: "nearest"
		});
	}
	function remainingScrollY(el, down) {
		if (!el) return 0;
		return down ? el.scrollHeight - el.clientHeight - el.scrollTop : el.scrollTop;
	}
	function fireWheel(dy, at) {
		const x = Math.floor(window.innerWidth / 2);
		const y = Math.floor(window.innerHeight / 2);
		const hit = at || document.elementFromPoint(x, y) || document.body;
		const init = {
			bubbles: true,
			cancelable: true,
			composed: true,
			deltaX: 0,
			deltaY: dy,
			deltaZ: 0,
			deltaMode: 0,
			clientX: x,
			clientY: y,
			view: window
		};
		hit.dispatchEvent(new WheelEvent("wheel", init));
		(hit.parentElement || document).dispatchEvent(new WheelEvent("wheel", init));
	}
	async function fireArrow(down) {
		const key = down ? "ArrowDown" : "ArrowUp";
		const target = document.activeElement instanceof HTMLElement ? document.activeElement : document.body;
		await pressKeyElement(target, key);
	}
	async function gestureScroll(dy, at) {
		const beforeY = window.scrollY;
		const beforeUrl = location.href;
		fireWheel(dy, at);
		fireWheel(Math.sign(dy) * Math.max(Math.abs(dy), window.innerHeight * .8), at);
		await waitFor(.15);
		await fireArrow(dy > 0);
		await waitFor(.2);
		if (location.href !== beforeUrl || Math.abs(window.scrollY - beforeY) > 1) return true;
		return false;
	}
	function pickOverflowY(down) {
		const bigEnough = (node) => node.clientHeight >= window.innerHeight * .35;
		const canScroll = (node) => Boolean(node && /(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 4 && bigEnough(node));
		let el = document.activeElement;
		while (el && !canScroll(el) && el !== document.body) el = el.parentElement;
		if (canScroll(el)) return el;
		const ranked = Array.from(document.querySelectorAll("div,main,section,ul,ol")).filter(canScroll).sort((a, b) => remainingScrollY(b, down) - remainingScrollY(a, down));
		return ranked[0] || document.scrollingElement || document.documentElement;
	}
	async function scrollVertically(scroll_amount, element) {
		const dy = scroll_amount;
		const down = dy > 0;
		if (element) {
			const targetElement = element;
			let currentElement = targetElement;
			let scrollSuccess = false;
			let scrolledElement = null;
			let scrollDelta = 0;
			let attempts = 0;
			while (currentElement && attempts < 10) {
				const computedStyle = window.getComputedStyle(currentElement);
				const hasScrollableY = /(auto|scroll|overlay)/.test(computedStyle.overflowY) || computedStyle.scrollbarWidth && computedStyle.scrollbarWidth !== "auto" || computedStyle.scrollbarGutter && computedStyle.scrollbarGutter !== "auto";
				const canScrollVertically = currentElement.scrollHeight > currentElement.clientHeight;
				if (hasScrollableY && canScrollVertically) {
					const beforeScroll = currentElement.scrollTop;
					const maxScroll = currentElement.scrollHeight - currentElement.clientHeight;
					let scrollAmount = dy / 3;
					if (scrollAmount > 0) scrollAmount = Math.min(scrollAmount, maxScroll - beforeScroll);
					else scrollAmount = Math.max(scrollAmount, -beforeScroll);
					currentElement.scrollTop = beforeScroll + scrollAmount;
					const actualScrollDelta = currentElement.scrollTop - beforeScroll;
					if (Math.abs(actualScrollDelta) > .5) {
						scrollSuccess = true;
						scrolledElement = currentElement;
						scrollDelta = actualScrollDelta;
						break;
					}
				}
				if (currentElement === document.body || currentElement === document.documentElement) break;
				currentElement = currentElement.parentElement;
				attempts++;
			}
			if (scrollSuccess) return `Scrolled container (${scrolledElement?.tagName}) by ${scrollDelta}px`;
			if (await gestureScroll(dy, targetElement)) return `✅ Sent wheel/${down ? "ArrowDown" : "ArrowUp"} on ${targetElement.tagName} (feed-style page).`;
			return `No scrollable container found for element (${targetElement.tagName})`;
		}
		const el = pickOverflowY(down);
		if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
			const scrollBefore = window.scrollY;
			window.scrollBy(0, dy);
			const scrolled = window.scrollY - scrollBefore;
			if (Math.abs(scrolled) >= 1) return `✅ Scrolled page by ${scrolled}px.`;
			if (await gestureScroll(dy, el)) return `✅ Sent wheel/${down ? "ArrowDown" : "ArrowUp"} (document had no overflow).`;
			return down ? `⚠️ Already at the bottom of the page, cannot scroll down further.` : `⚠️ Already at the top of the page, cannot scroll up further.`;
		}
		const warningMsg = `The document is not scrollable. Falling back to container scroll.`;
		const scrollBefore = el.scrollTop;
		const remain = remainingScrollY(el, down);
		el.scrollBy({ top: dy, behavior: "auto" });
		await waitFor(.1);
		const scrolled = el.scrollTop - scrollBefore;
		if (Math.abs(scrolled) >= 1) return `✅ ${warningMsg} Scrolled container (${el.tagName}) by ${scrolled}px.`;
		if (await gestureScroll(dy, el)) return `✅ Sent wheel/${down ? "ArrowDown" : "ArrowUp"} after container scrollTop did not move.`;
		const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
		if (hit && hit !== el && await gestureScroll(dy, hit)) return `✅ Sent wheel/${down ? "ArrowDown" : "ArrowUp"} on the element under the cursor.`;
		return down ? `⚠️ ${warningMsg} Already at the bottom of container (${el.tagName}), cannot scroll down further.` : `⚠️ ${warningMsg} Already at the top of container (${el.tagName}), cannot scroll up further.`;
	}
	async function scrollHorizontally(scroll_amount, element) {
		if (element) {
			const targetElement = element;
			let currentElement = targetElement;
			let scrollSuccess = false;
			let scrolledElement = null;
			let scrollDelta = 0;
			let attempts = 0;
			const dx = scroll_amount;
			while (currentElement && attempts < 10) {
				const computedStyle = window.getComputedStyle(currentElement);
				const hasScrollableX = /(auto|scroll|overlay)/.test(computedStyle.overflowX) || computedStyle.scrollbarWidth && computedStyle.scrollbarWidth !== "auto" || computedStyle.scrollbarGutter && computedStyle.scrollbarGutter !== "auto";
				const canScrollHorizontally = currentElement.scrollWidth > currentElement.clientWidth;
				if (hasScrollableX && canScrollHorizontally) {
					const beforeScroll = currentElement.scrollLeft;
					const maxScroll = currentElement.scrollWidth - currentElement.clientWidth;
					let scrollAmount = dx / 3;
					if (scrollAmount > 0) scrollAmount = Math.min(scrollAmount, maxScroll - beforeScroll);
					else scrollAmount = Math.max(scrollAmount, -beforeScroll);
					currentElement.scrollLeft = beforeScroll + scrollAmount;
					const actualScrollDelta = currentElement.scrollLeft - beforeScroll;
					if (Math.abs(actualScrollDelta) > .5) {
						scrollSuccess = true;
						scrolledElement = currentElement;
						scrollDelta = actualScrollDelta;
						break;
					}
				}
				if (currentElement === document.body || currentElement === document.documentElement) break;
				currentElement = currentElement.parentElement;
				attempts++;
			}
			if (scrollSuccess) return `Scrolled container (${scrolledElement?.tagName}) horizontally by ${scrollDelta}px`;
			else return `No horizontally scrollable container found for element (${targetElement.tagName})`;
		}
		const dx = scroll_amount;
		const bigEnough = (el) => el.clientWidth >= window.innerWidth * .5;
		const canScroll = (el) => Boolean(el && /(auto|scroll|overlay)/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth && bigEnough(el));
		let el = document.activeElement;
		while (el && !canScroll(el) && el !== document.body) el = el.parentElement;
		el = canScroll(el) ? el : Array.from(document.querySelectorAll("*")).find(canScroll) || document.scrollingElement || document.documentElement;
		if (el === document.scrollingElement || el === document.documentElement || el === document.body) {
			const scrollBefore = window.scrollX;
			const scrollMax = document.documentElement.scrollWidth - window.innerWidth;
			window.scrollBy(dx, 0);
			const scrollAfter = window.scrollX;
			const scrolled = scrollAfter - scrollBefore;
			if (Math.abs(scrolled) < 1) return dx > 0 ? `⚠️ Already at the right edge of the page, cannot scroll right further.` : `⚠️ Already at the left edge of the page, cannot scroll left further.`;
			const reachedRight = dx > 0 && scrollAfter >= scrollMax - 1;
			const reachedLeft = dx < 0 && scrollAfter <= 1;
			if (reachedRight) return `✅ Scrolled page by ${scrolled}px. Reached the right edge of the page.`;
			if (reachedLeft) return `✅ Scrolled page by ${scrolled}px. Reached the left edge of the page.`;
			return `✅ Scrolled page horizontally by ${scrolled}px.`;
		} else {
			const warningMsg = `The document is not scrollable. Falling back to container scroll.`;
			console.log(`[PageController] ${warningMsg}`);
			const scrollBefore = el.scrollLeft;
			const scrollMax = el.scrollWidth - el.clientWidth;
			el.scrollBy({
				left: dx,
				behavior: "smooth"
			});
			await waitFor(.1);
			const scrollAfter = el.scrollLeft;
			const scrolled = scrollAfter - scrollBefore;
			if (Math.abs(scrolled) < 1) return dx > 0 ? `⚠️ ${warningMsg} Already at the right edge of container (${el.tagName}), cannot scroll right further.` : `⚠️ ${warningMsg} Already at the left edge of container (${el.tagName}), cannot scroll left further.`;
			const reachedRight = dx > 0 && scrollAfter >= scrollMax - 1;
			const reachedLeft = dx < 0 && scrollAfter <= 1;
			if (reachedRight) return `✅ ${warningMsg} Scrolled container (${el.tagName}) by ${scrolled}px. Reached the right edge.`;
			if (reachedLeft) return `✅ ${warningMsg} Scrolled container (${el.tagName}) by ${scrolled}px. Reached the left edge.`;
			return `✅ ${warningMsg} Scrolled container (${el.tagName}) horizontally by ${scrolled}px.`;
		}
	}
	//#endregion
	//#region ../page-controller/src/dom/dom_tree/index.js
	/**
	* @file port from browser-use
	* @see https://github.com/browser-use/browser-use/commits/main/browser_use/dom/dom_tree/index.js
	* @match 0.5.9 d51b6e73daff7165fdd3e44debd667e7f5f7fdc5
	*
	* search @edit for all the changed lines.
	*
	* @edit export
	* @edit add interactiveBlacklist interactiveWhitelist
	* @edit adjustable opacity
	* @edit direct dom ref
	* @edit @workaround input.checked
	* @edit smaller zIndex for highlight
	* @edit no need for xpath
	* @edit add `extra` field for extra data
	* @edit scrollable element detection
	* @edit add `data-browser-use-ignore` attribute
	* @edit improve `sampleRect`, filter out rects with 0 area
	* @edit exclude aria-hidden elements
	* @edit make sure attributes exist for interactive candidates.
	* @edit fix "aria-*" attributes check
	*/
	var dom_tree_default = (args = {
		doHighlightElements: true,
		focusHighlightIndex: -1,
		viewportExpansion: 0,
		debugMode: false,
		/**
		* @edit
		*/
		/** @type {Element[]} */
		interactiveBlacklist: [],
		/** @type {Element[]} */
		interactiveWhitelist: [],
		highlightOpacity: .1,
		highlightLabelOpacity: .5
	}) => {
		/**
		* @edit
		*/
		const { interactiveBlacklist, interactiveWhitelist, highlightOpacity, highlightLabelOpacity } = args;
		const { doHighlightElements, focusHighlightIndex, viewportExpansion, debugMode } = args;
		let highlightIndex = 0;
		/**
		* @edit add `extra` field for extra data
		*/
		const extraData = /* @__PURE__ */ new WeakMap();
		function addExtraData(element, data) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
			extraData.set(element, {
				...extraData.get(element),
				...data
			});
		}
		const DOM_CACHE = {
			boundingRects: /* @__PURE__ */ new WeakMap(),
			clientRects: /* @__PURE__ */ new WeakMap(),
			computedStyles: /* @__PURE__ */ new WeakMap(),
			clearCache: () => {
				DOM_CACHE.boundingRects = /* @__PURE__ */ new WeakMap();
				DOM_CACHE.clientRects = /* @__PURE__ */ new WeakMap();
				DOM_CACHE.computedStyles = /* @__PURE__ */ new WeakMap();
			}
		};
		/**
		* Gets the cached bounding rect for an element.
		*
		* @param {HTMLElement} element - The element to get the bounding rect for.
		* @returns {DOMRect | null} The cached bounding rect, or null if the element is not found.
		*/
		function getCachedBoundingRect(element) {
			if (!element) return null;
			if (DOM_CACHE.boundingRects.has(element)) return DOM_CACHE.boundingRects.get(element);
			const rect = element.getBoundingClientRect();
			if (rect) DOM_CACHE.boundingRects.set(element, rect);
			return rect;
		}
		/**
		* Gets the cached computed style for an element.
		*
		* @param {HTMLElement} element - The element to get the computed style for.
		* @returns {CSSStyleDeclaration | null} The cached computed style, or null if the element is not found.
		*/
		function getCachedComputedStyle(element) {
			if (!element) return null;
			if (DOM_CACHE.computedStyles.has(element)) return DOM_CACHE.computedStyles.get(element);
			const style = window.getComputedStyle(element);
			if (style) DOM_CACHE.computedStyles.set(element, style);
			return style;
		}
		/**
		* Gets the cached client rects for an element.
		*
		* @param {HTMLElement} element - The element to get the client rects for.
		* @returns {DOMRectList | null} The cached client rects, or null if the element is not found.
		*/
		function getCachedClientRects(element) {
			if (!element) return null;
			if (DOM_CACHE.clientRects.has(element)) return DOM_CACHE.clientRects.get(element);
			const rects = element.getClientRects();
			if (rects) DOM_CACHE.clientRects.set(element, rects);
			return rects;
		}
		/**
		* Hash map of DOM nodes indexed by their highlight index.
		*
		* @type {Object<string, any>}
		*/
		const DOM_HASH_MAP = {};
		const ID = { current: 0 };
		const HIGHLIGHT_CONTAINER_ID = "playwright-highlight-container";
		/**
		* Highlights an element in the DOM and returns the index of the next element.
		*
		* @param {HTMLElement} element - The element to highlight.
		* @param {number} index - The index of the element.
		* @param {HTMLElement | null} parentIframe - The parent iframe node.
		* @returns {number} The index of the next element.
		*/
		function highlightElement(element, index, parentIframe = null) {
			if (!element) return index;
			const overlays = [];
			/**
			* @type {HTMLElement | null}
			*/
			let label = null;
			let labelWidth = 20;
			let labelHeight = 16;
			let cleanupFn = null;
			try {
				let container = document.getElementById(HIGHLIGHT_CONTAINER_ID);
				if (!container) {
					container = document.createElement("div");
					container.id = HIGHLIGHT_CONTAINER_ID;
					container.style.position = "fixed";
					container.style.pointerEvents = "none";
					container.style.top = "0";
					container.style.left = "0";
					container.style.width = "100%";
					container.style.height = "100%";
					/**
					* @edit smaller zIndex for highlight
					*/
					container.style.zIndex = "2147483640";
					container.style.backgroundColor = "transparent";
					document.body.appendChild(container);
				}
				const rects = element.getClientRects();
				if (!rects || rects.length === 0) return index;
				const colors = [
					"#FF0000",
					"#00FF00",
					"#0000FF",
					"#FFA500",
					"#800080",
					"#008080",
					"#FF69B4",
					"#4B0082",
					"#FF4500",
					"#2E8B57",
					"#DC143C",
					"#4682B4"
				];
				let baseColor = colors[index % colors.length];
				/**
				* @edit adjustable opacity
				*/
				const backgroundColor = baseColor + Math.floor(highlightOpacity * 255).toString(16).padStart(2, "0");
				baseColor = baseColor + Math.floor(highlightLabelOpacity * 255).toString(16).padStart(2, "0");
				let iframeOffset = {
					x: 0,
					y: 0
				};
				if (parentIframe) {
					const iframeRect = parentIframe.getBoundingClientRect();
					iframeOffset.x = iframeRect.left;
					iframeOffset.y = iframeRect.top;
				}
				const fragment = document.createDocumentFragment();
				for (const rect of rects) {
					if (rect.width === 0 || rect.height === 0) continue;
					const overlay = document.createElement("div");
					overlay.style.position = "fixed";
					overlay.style.border = `2px solid ${baseColor}`;
					overlay.style.backgroundColor = backgroundColor;
					overlay.style.pointerEvents = "none";
					overlay.style.boxSizing = "border-box";
					const top = rect.top + iframeOffset.y;
					const left = rect.left + iframeOffset.x;
					overlay.style.top = `${top}px`;
					overlay.style.left = `${left}px`;
					overlay.style.width = `${rect.width}px`;
					overlay.style.height = `${rect.height}px`;
					fragment.appendChild(overlay);
					overlays.push({
						element: overlay,
						initialRect: rect
					});
				}
				const firstRect = rects[0];
				label = document.createElement("div");
				label.className = "playwright-highlight-label";
				label.style.position = "fixed";
				label.style.background = baseColor;
				label.style.color = "white";
				label.style.padding = "1px 4px";
				label.style.borderRadius = "4px";
				label.style.fontSize = `${Math.min(12, Math.max(8, firstRect.height / 2))}px`;
				label.textContent = index.toString();
				labelWidth = label.offsetWidth > 0 ? label.offsetWidth : labelWidth;
				labelHeight = label.offsetHeight > 0 ? label.offsetHeight : labelHeight;
				const firstRectTop = firstRect.top + iframeOffset.y;
				const firstRectLeft = firstRect.left + iframeOffset.x;
				let labelTop = firstRectTop + 2;
				let labelLeft = firstRectLeft + firstRect.width - labelWidth - 2;
				if (firstRect.width < labelWidth + 4 || firstRect.height < labelHeight + 4) {
					labelTop = firstRectTop - labelHeight - 2;
					labelLeft = firstRectLeft + firstRect.width - labelWidth;
					if (labelLeft < iframeOffset.x) labelLeft = firstRectLeft;
				}
				labelTop = Math.max(0, Math.min(labelTop, window.innerHeight - labelHeight));
				labelLeft = Math.max(0, Math.min(labelLeft, window.innerWidth - labelWidth));
				label.style.top = `${labelTop}px`;
				label.style.left = `${labelLeft}px`;
				fragment.appendChild(label);
				const updatePositions = () => {
					const newRects = element.getClientRects();
					let newIframeOffset = {
						x: 0,
						y: 0
					};
					if (parentIframe) {
						const iframeRect = parentIframe.getBoundingClientRect();
						newIframeOffset.x = iframeRect.left;
						newIframeOffset.y = iframeRect.top;
					}
					overlays.forEach((overlayData, i) => {
						if (i < newRects.length) {
							const newRect = newRects[i];
							const newTop = newRect.top + newIframeOffset.y;
							const newLeft = newRect.left + newIframeOffset.x;
							overlayData.element.style.top = `${newTop}px`;
							overlayData.element.style.left = `${newLeft}px`;
							overlayData.element.style.width = `${newRect.width}px`;
							overlayData.element.style.height = `${newRect.height}px`;
							overlayData.element.style.display = newRect.width === 0 || newRect.height === 0 ? "none" : "block";
						} else overlayData.element.style.display = "none";
					});
					if (newRects.length < overlays.length) for (let i = newRects.length; i < overlays.length; i++) overlays[i].element.style.display = "none";
					if (label && newRects.length > 0) {
						const firstNewRect = newRects[0];
						const firstNewRectTop = firstNewRect.top + newIframeOffset.y;
						const firstNewRectLeft = firstNewRect.left + newIframeOffset.x;
						let newLabelTop = firstNewRectTop + 2;
						let newLabelLeft = firstNewRectLeft + firstNewRect.width - labelWidth - 2;
						if (firstNewRect.width < labelWidth + 4 || firstNewRect.height < labelHeight + 4) {
							newLabelTop = firstNewRectTop - labelHeight - 2;
							newLabelLeft = firstNewRectLeft + firstNewRect.width - labelWidth;
							if (newLabelLeft < newIframeOffset.x) newLabelLeft = firstNewRectLeft;
						}
						newLabelTop = Math.max(0, Math.min(newLabelTop, window.innerHeight - labelHeight));
						newLabelLeft = Math.max(0, Math.min(newLabelLeft, window.innerWidth - labelWidth));
						label.style.top = `${newLabelTop}px`;
						label.style.left = `${newLabelLeft}px`;
						label.style.display = "block";
					} else if (label) label.style.display = "none";
				};
				const throttleFunction = (func, delay) => {
					let lastCall = 0;
					return (...args) => {
						const now = performance.now();
						if (now - lastCall < delay) return;
						lastCall = now;
						return func(...args);
					};
				};
				const throttledUpdatePositions = throttleFunction(updatePositions, 16);
				window.addEventListener("scroll", throttledUpdatePositions, true);
				window.addEventListener("resize", throttledUpdatePositions);
				cleanupFn = () => {
					window.removeEventListener("scroll", throttledUpdatePositions, true);
					window.removeEventListener("resize", throttledUpdatePositions);
					overlays.forEach((overlay) => overlay.element.remove());
					if (label) label.remove();
				};
				container.appendChild(fragment);
				return index + 1;
			} finally {
				if (cleanupFn) (window._highlightCleanupFunctions = window._highlightCleanupFunctions || []).push(cleanupFn);
			}
		}
		/**
		* @edit scrollable element detection
		* Checks if an element is scrollable. if so, return the scrollable distance on each direction (left right top bottom). if not return null.
		* @note distance smaller than 4 will be considered as not scrollable.
		* @note only check block elements, not inline elements.
		*/
		function isScrollableElement(element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;
			const style = getCachedComputedStyle(element);
			if (!style) return null;
			const display = style.display;
			if (display === "inline" || display === "inline-block") return null;
			const overflowX = style.overflowX;
			const overflowY = style.overflowY;
			const hasScrollbarSignal = style.scrollbarWidth && style.scrollbarWidth !== "auto" || style.scrollbarGutter && style.scrollbarGutter !== "auto";
			const scrollableX = overflowX === "auto" || overflowX === "scroll";
			const scrollableY = overflowY === "auto" || overflowY === "scroll";
			if (!scrollableX && !scrollableY && !hasScrollbarSignal) return null;
			const scrollWidth = element.scrollWidth - element.clientWidth;
			const scrollHeight = element.scrollHeight - element.clientHeight;
			const threshold = 4;
			if (scrollWidth < threshold && scrollHeight < threshold) return null;
			if (!scrollableY && !hasScrollbarSignal && scrollWidth < threshold) return null;
			if (!scrollableX && !hasScrollbarSignal && scrollHeight < threshold) return null;
			const distanceToTop = element.scrollTop;
			const distanceToLeft = element.scrollLeft;
			const scrollData = {
				top: distanceToTop,
				right: element.scrollWidth - element.clientWidth - element.scrollLeft,
				bottom: element.scrollHeight - element.clientHeight - element.scrollTop,
				left: distanceToLeft
			};
			addExtraData(element, {
				scrollable: true,
				scrollData
			});
			return scrollData;
		}
		/**
		* Checks if a text node is visible.
		*
		* @param {Text} textNode - The text node to check.
		* @returns {boolean} Whether the text node is visible.
		*/
		function isTextNodeVisible(textNode) {
			try {
				if (viewportExpansion === -1) {
					const parentElement = textNode.parentElement;
					if (!parentElement) return false;
					try {
						return parentElement.checkVisibility({
							checkOpacity: true,
							checkVisibilityCSS: true
						});
					} catch (e) {
						const style = window.getComputedStyle(parentElement);
						return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
					}
				}
				const range = document.createRange();
				range.selectNodeContents(textNode);
				const rects = range.getClientRects();
				if (!rects || rects.length === 0) return false;
				let isAnyRectVisible = false;
				let isAnyRectInViewport = false;
				for (const rect of rects) if (rect.width > 0 && rect.height > 0) {
					isAnyRectVisible = true;
					if (!(rect.bottom < -viewportExpansion || rect.top > window.innerHeight + viewportExpansion || rect.right < -viewportExpansion || rect.left > window.innerWidth + viewportExpansion)) {
						isAnyRectInViewport = true;
						break;
					}
				}
				if (!isAnyRectVisible || !isAnyRectInViewport) return false;
				const parentElement = textNode.parentElement;
				if (!parentElement) return false;
				try {
					return parentElement.checkVisibility({
						checkOpacity: true,
						checkVisibilityCSS: true
					});
				} catch (e) {
					const style = window.getComputedStyle(parentElement);
					return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
				}
			} catch (e) {
				console.warn("Error checking text node visibility:", e);
				return false;
			}
		}
		/**
		* Checks if an element is accepted.
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is accepted.
		*/
		function isElementAccepted(element) {
			if (!element || !element.tagName) return false;
			const alwaysAccept = /* @__PURE__ */ new Set([
				"body",
				"div",
				"main",
				"article",
				"section",
				"nav",
				"header",
				"footer"
			]);
			const tagName = element.tagName.toLowerCase();
			if (alwaysAccept.has(tagName)) return true;
			return !(/* @__PURE__ */ new Set([
				"svg",
				"script",
				"style",
				"link",
				"meta",
				"noscript",
				"template"
			])).has(tagName);
		}
		/**
		* Checks if an element is visible.
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is visible.
		*/
		function isElementVisible(element) {
			const style = getCachedComputedStyle(element);
			return element.offsetWidth > 0 && element.offsetHeight > 0 && style?.visibility !== "hidden" && style?.display !== "none";
		}
		/**
		* Checks if an element is interactive.
		*
		* lots of comments, and uncommented code - to show the logic of what we already tried
		*
		* One of the things we tried at the beginning was also to use event listeners, and other fancy class, style stuff -> what actually worked best was just combining most things with computed cursor style :)
		*
		* @param {HTMLElement} element - The element to check.
		*/
		function isInteractiveElement(element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
			/**
			* @edit add interactiveBlacklist interactiveWhitelist
			*/
			if (interactiveBlacklist.includes(element)) return false;
			if (interactiveWhitelist.includes(element)) return true;
			const tagName = element.tagName.toLowerCase();
			const style = getCachedComputedStyle(element);
			const interactiveCursors = /* @__PURE__ */ new Set([
				"pointer",
				"move",
				"text",
				"grab",
				"grabbing",
				"cell",
				"copy",
				"alias",
				"all-scroll",
				"col-resize",
				"context-menu",
				"crosshair",
				"e-resize",
				"ew-resize",
				"help",
				"n-resize",
				"ne-resize",
				"nesw-resize",
				"ns-resize",
				"nw-resize",
				"nwse-resize",
				"row-resize",
				"s-resize",
				"se-resize",
				"sw-resize",
				"vertical-text",
				"w-resize",
				"zoom-in",
				"zoom-out"
			]);
			const nonInteractiveCursors = /* @__PURE__ */ new Set([
				"not-allowed",
				"no-drop",
				"wait",
				"progress",
				"initial",
				"inherit"
			]);
			/**
			* Checks if an element has an interactive pointer.
			*
			* @param {HTMLElement} element - The element to check.
			* @returns {boolean} Whether the element has an interactive pointer.
			*/
			function doesElementHaveInteractivePointer(element) {
				if (element.tagName.toLowerCase() === "html") return false;
				if (style?.cursor && interactiveCursors.has(style.cursor)) return true;
				return false;
			}
			if (doesElementHaveInteractivePointer(element)) return true;
			const interactiveElements = /* @__PURE__ */ new Set([
				"a",
				"button",
				"input",
				"select",
				"textarea",
				"details",
				"summary",
				"label",
				"option",
				"optgroup",
				"fieldset",
				"legend"
			]);
			const explicitDisableTags = /* @__PURE__ */ new Set(["disabled", "readonly"]);
			if (interactiveElements.has(tagName)) {
				if (style?.cursor && nonInteractiveCursors.has(style.cursor)) return false;
				for (const disableTag of explicitDisableTags) if (element.hasAttribute(disableTag) || element.getAttribute(disableTag) === "true" || element.getAttribute(disableTag) === "") return false;
				if (element.disabled) return false;
				if (element.readOnly) return false;
				if (element.inert) return false;
				return true;
			}
			const role = element.getAttribute("role");
			const ariaRole = element.getAttribute("aria-role");
			if (element.getAttribute("contenteditable") === "true" || element.isContentEditable) return true;
			if (element.classList && (element.classList.contains("button") || element.classList.contains("dropdown-toggle") || element.getAttribute("data-index") || element.getAttribute("data-toggle") === "dropdown" || element.getAttribute("aria-haspopup") === "true")) return true;
			const interactiveRoles = /* @__PURE__ */ new Set([
				"button",
				"menu",
				"menubar",
				"menuitem",
				"menuitemradio",
				"menuitemcheckbox",
				"radio",
				"checkbox",
				"tab",
				"switch",
				"slider",
				"spinbutton",
				"combobox",
				"searchbox",
				"textbox",
				"listbox",
				"option",
				"scrollbar"
			]);
			if (interactiveElements.has(tagName) || role && interactiveRoles.has(role) || ariaRole && interactiveRoles.has(ariaRole)) return true;
			try {
				if (typeof getEventListeners === "function") {
					const listeners = getEventListeners(element);
					for (const eventType of [
						"click",
						"mousedown",
						"mouseup",
						"dblclick"
					]) if (listeners[eventType] && listeners[eventType].length > 0) return true;
				}
				const getEventListenersForNode = element?.ownerDocument?.defaultView?.getEventListenersForNode || window.getEventListenersForNode;
				if (typeof getEventListenersForNode === "function") {
					const listeners = getEventListenersForNode(element);
					for (const eventType of [
						"click",
						"mousedown",
						"mouseup",
						"keydown",
						"keyup",
						"submit",
						"change",
						"input",
						"focus",
						"blur"
					]) for (const listener of listeners) if (listener.type === eventType) return true;
				}
				for (const attr of [
					"onclick",
					"onmousedown",
					"onmouseup",
					"ondblclick"
				]) if (element.hasAttribute(attr) || typeof element[attr] === "function") return true;
			} catch (e) {}
			/**
			* @edit scrollable element detection
			*/
			if (isScrollableElement(element)) return true;
			return false;
		}
		/**
		* Checks if an element is the topmost element at its position.
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is the topmost element at its position.
		*/
		function isTopElement(element) {
			if (viewportExpansion === -1) return true;
			const rects = getCachedClientRects(element);
			if (!rects || rects.length === 0) return false;
			let isAnyRectInViewport = false;
			for (const rect of rects) if (rect.width > 0 && rect.height > 0 && !(rect.bottom < -viewportExpansion || rect.top > window.innerHeight + viewportExpansion || rect.right < -viewportExpansion || rect.left > window.innerWidth + viewportExpansion)) {
				isAnyRectInViewport = true;
				break;
			}
			if (!isAnyRectInViewport) return false;
			if (element.ownerDocument !== window.document) return true;
			/**
			* @edit improve `sampleRect`, filter out rects with 0 area
			*/
			let rect = Array.from(rects).find((r) => r.width > 0 && r.height > 0);
			if (!rect) return false;
			const shadowRoot = element.getRootNode();
			if (shadowRoot instanceof ShadowRoot) {
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;
				try {
					const topEl = shadowRoot.elementFromPoint(centerX, centerY);
					if (!topEl) return false;
					let current = topEl;
					while (current && current !== shadowRoot) {
						if (current === element) return true;
						current = current.parentElement;
					}
					return false;
				} catch (e) {
					return true;
				}
			}
			const margin = 5;
			return [
				{
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				},
				{
					x: rect.left + margin,
					y: rect.top + margin
				},
				{
					x: rect.right - margin,
					y: rect.bottom - margin
				}
			].some(({ x, y }) => {
				try {
					const topEl = document.elementFromPoint(x, y);
					if (!topEl) return false;
					let current = topEl;
					while (current && current !== document.documentElement) {
						if (current === element) return true;
						current = current.parentElement;
					}
					return false;
				} catch (e) {
					return true;
				}
			});
		}
		/**
		* Checks if an element is within the expanded viewport.
		*
		* @param {HTMLElement} element - The element to check.
		* @param {number} viewportExpansion - The viewport expansion.
		* @returns {boolean} Whether the element is within the expanded viewport.
		*/
		function isInExpandedViewport(element, viewportExpansion) {
			if (viewportExpansion === -1) return true;
			const rects = element.getClientRects();
			if (!rects || rects.length === 0) {
				const boundingRect = getCachedBoundingRect(element);
				if (!boundingRect || boundingRect.width === 0 || boundingRect.height === 0) return false;
				return !(boundingRect.bottom < -viewportExpansion || boundingRect.top > window.innerHeight + viewportExpansion || boundingRect.right < -viewportExpansion || boundingRect.left > window.innerWidth + viewportExpansion);
			}
			for (const rect of rects) {
				if (rect.width === 0 || rect.height === 0) continue;
				if (!(rect.bottom < -viewportExpansion || rect.top > window.innerHeight + viewportExpansion || rect.right < -viewportExpansion || rect.left > window.innerWidth + viewportExpansion)) return true;
			}
			return false;
		}
		/**
		* Checks if an element is an interactive candidate.
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is an interactive candidate.
		*/
		const INTERACTIVE_ARIA_ATTRS = [
			"aria-expanded",
			"aria-checked",
			"aria-selected",
			"aria-pressed",
			"aria-haspopup",
			"aria-controls",
			"aria-owns",
			"aria-activedescendant",
			"aria-valuenow",
			"aria-valuetext",
			"aria-valuemax",
			"aria-valuemin",
			"aria-autocomplete"
		];
		function hasInteractiveAria(el) {
			for (let i = 0; i < INTERACTIVE_ARIA_ATTRS.length; i++) if (el.hasAttribute(INTERACTIVE_ARIA_ATTRS[i])) return true;
			return false;
		}
		function isInteractiveCandidate(element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
			const tagName = element.tagName.toLowerCase();
			if ((/* @__PURE__ */ new Set([
				"a",
				"button",
				"input",
				"select",
				"textarea",
				"details",
				"summary",
				"label"
			])).has(tagName)) return true;
			return element.hasAttribute("onclick") || element.hasAttribute("role") || element.hasAttribute("tabindex") || hasInteractiveAria(element) || element.hasAttribute("data-action") || element.getAttribute("contenteditable") === "true";
		}
		const DISTINCT_INTERACTIVE_TAGS = /* @__PURE__ */ new Set([
			"a",
			"button",
			"input",
			"select",
			"textarea",
			"summary",
			"details",
			"label",
			"option",
			"li"
		]);
		const DISTINCT_INTERACTIVE_ROLES = /* @__PURE__ */ new Set([
			"button",
			"link",
			"menuitem",
			"menuitemradio",
			"menuitemcheckbox",
			"radio",
			"checkbox",
			"tab",
			"switch",
			"slider",
			"spinbutton",
			"combobox",
			"searchbox",
			"textbox",
			"listbox",
			"listitem",
			"treeitem",
			"row",
			"option",
			"scrollbar"
		]);
		/**
		* Heuristically determines if an element should be considered as independently interactive,
		* even if it's nested inside another interactive container.
		*
		* This function helps detect deeply nested actionable elements (e.g., menu items within a button)
		* that may not be picked up by strict interactivity checks.
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is heuristically interactive.
		*/
		function isHeuristicallyInteractive(element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
			if (!isElementVisible(element)) return false;
			const hasInteractiveAttributes = element.hasAttribute("role") || element.hasAttribute("tabindex") || element.hasAttribute("onclick") || typeof element.onclick === "function";
			const hasInteractiveClass = /\b(btn|clickable|menu|item|entry|link)\b/i.test(element.className || "");
			const isInKnownContainer = Boolean(element.closest("button,a,[role=\"button\"],.menu,.dropdown,.list,.toolbar"));
			const hasVisibleChildren = [...element.children].some(isElementVisible);
			const isParentBody = element.parentElement && element.parentElement.isSameNode(document.body);
			return (isInteractiveElement(element) || hasInteractiveAttributes || hasInteractiveClass) && hasVisibleChildren && isInKnownContainer && !isParentBody;
		}
		/**
		* Checks if an element likely represents a distinct interaction
		* separate from its parent (if the parent is also interactive).
		*
		* @param {HTMLElement} element - The element to check.
		* @returns {boolean} Whether the element is a distinct interaction.
		*/
		function isElementDistinctInteraction(element) {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
			const tagName = element.tagName.toLowerCase();
			const role = element.getAttribute("role");
			if (tagName === "iframe") return true;
			if (DISTINCT_INTERACTIVE_TAGS.has(tagName)) return true;
			if (role && DISTINCT_INTERACTIVE_ROLES.has(role)) return true;
			if (element.isContentEditable || element.getAttribute("contenteditable") === "true") return true;
			if (element.hasAttribute("data-testid") || element.hasAttribute("data-cy") || element.hasAttribute("data-test")) return true;
			if (element.hasAttribute("onclick") || typeof element.onclick === "function") return true;
			if (hasInteractiveAria(element)) return true;
			try {
				const getEventListenersForNode = element?.ownerDocument?.defaultView?.getEventListenersForNode || window.getEventListenersForNode;
				if (typeof getEventListenersForNode === "function") {
					const listeners = getEventListenersForNode(element);
					for (const eventType of [
						"click",
						"mousedown",
						"mouseup",
						"keydown",
						"keyup",
						"submit",
						"change",
						"input",
						"focus",
						"blur"
					]) for (const listener of listeners) if (listener.type === eventType) return true;
				}
				if ([
					"onmousedown",
					"onmouseup",
					"onkeydown",
					"onkeyup",
					"onsubmit",
					"onchange",
					"oninput",
					"onfocus",
					"onblur"
				].some((attr) => element.hasAttribute(attr))) return true;
			} catch (e) {}
			if (isHeuristicallyInteractive(element)) return true;
			if (extraData.get(element)?.scrollable) return true;
			return false;
		}
		/**
		* Handles the logic for deciding whether to highlight an element and performing the highlight.
		* @param {
		{
		tagName: string;
		attributes: Record<string, string>;
		xpath: any;
		children: never[];
		isVisible?: boolean;
		isTopElement?: boolean;
		isInteractive?: boolean;
		isInViewport?: boolean;
		highlightIndex?: number;
		shadowRoot?: boolean;
		}} nodeData - The node data object.
		* @param {HTMLElement} node - The node to highlight.
		* @param {HTMLElement | null} parentIframe - The parent iframe node.
		* @param {boolean} isParentHighlighted - Whether the parent node is highlighted.
		* @returns {boolean} Whether the element was highlighted.
		*/
		function handleHighlighting(nodeData, node, parentIframe, isParentHighlighted) {
			if (!nodeData.isInteractive) return false;
			let shouldHighlight = false;
			if (!isParentHighlighted) shouldHighlight = true;
			else if (isElementDistinctInteraction(node)) shouldHighlight = true;
			else shouldHighlight = false;
			if (shouldHighlight) {
				nodeData.isInViewport = isInExpandedViewport(node, viewportExpansion);
				if (nodeData.isInViewport || viewportExpansion === -1) {
					nodeData.highlightIndex = highlightIndex++;
					if (doHighlightElements) {
						if (focusHighlightIndex >= 0) {
							if (focusHighlightIndex === nodeData.highlightIndex) highlightElement(node, nodeData.highlightIndex, parentIframe);
						} else highlightElement(node, nodeData.highlightIndex, parentIframe);
						return true;
					}
				}
			}
			return false;
		}
		/**
		* Creates a node data object for a given node and its descendants.
		*
		* @param {HTMLElement} node - The node to process.
		* @param {HTMLElement | null} parentIframe - The parent iframe node.
		* @param {boolean} isParentHighlighted - Whether the parent node is highlighted.
		* @returns {string | null} The ID of the node data object, or null if the node is not processed.
		*/
		function buildDomTree(node, parentIframe = null, isParentHighlighted = false) {
			if (!node || node.id === HIGHLIGHT_CONTAINER_ID || node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) return null;
			if (!node || node.id === HIGHLIGHT_CONTAINER_ID) return null;
			/**
			* @edit add `data-browser-use-ignore` attribute
			*/
			if (node.dataset?.browserUseIgnore === "true" || node.dataset?.waifuAgentIgnore === "true") return null;
			/**
			* @edit exclude aria-hidden elements
			*/
			if (node.getAttribute && node.getAttribute("aria-hidden") === "true") return null;
			if (node === document.body) {
				const nodeData = {
					tagName: "body",
					attributes: {},
					xpath: "/body",
					children: []
				};
				for (const child of node.childNodes) {
					const domElement = buildDomTree(child, parentIframe, false);
					if (domElement) nodeData.children.push(domElement);
				}
				const id = `${ID.current++}`;
				DOM_HASH_MAP[id] = nodeData;
				return id;
			}
			if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) return null;
			if (node.nodeType === Node.TEXT_NODE) {
				const textContent = node.textContent?.trim();
				if (!textContent) return null;
				const parentElement = node.parentElement;
				if (!parentElement || parentElement.tagName.toLowerCase() === "script") return null;
				const id = `${ID.current++}`;
				DOM_HASH_MAP[id] = {
					type: "TEXT_NODE",
					text: textContent,
					isVisible: isTextNodeVisible(node)
				};
				return id;
			}
			if (node.nodeType === Node.ELEMENT_NODE && !isElementAccepted(node)) return null;
			if (viewportExpansion !== -1 && !node.shadowRoot) {
				const rect = getCachedBoundingRect(node);
				const style = getCachedComputedStyle(node);
				const isFixedOrSticky = style && (style.position === "fixed" || style.position === "sticky");
				const hasSize = node.offsetWidth > 0 || node.offsetHeight > 0;
				if (!rect || !isFixedOrSticky && !hasSize && (rect.bottom < -viewportExpansion || rect.top > window.innerHeight + viewportExpansion || rect.right < -viewportExpansion || rect.left > window.innerWidth + viewportExpansion)) return null;
			}
			/**
			* @type {
			{
			tagName: string;
			attributes: Record<string, string | null>;
			xpath: any;
			children: never[];
			isVisible?: boolean;
			isTopElement?: boolean;
			isInteractive?: boolean;
			isInViewport?: boolean;
			highlightIndex?: number;
			shadowRoot?: boolean;
			}
			} nodeData - The node data object.
			*/
			const nodeData = {
				tagName: node.tagName.toLowerCase(),
				attributes: {},
				/**
				* @edit no need for xpath
				*/
				children: []
			};
			if (isInteractiveCandidate(node) || node.tagName.toLowerCase() === "iframe" || node.tagName.toLowerCase() === "body") {
				const attributeNames = node.getAttributeNames?.() || [];
				for (const name of attributeNames) {
					const value = node.getAttribute(name);
					nodeData.attributes[name] = value;
				}
				/**
				* @edit @workaround input.checked
				*/
				if (node.tagName.toLowerCase() === "input" && (node.type === "checkbox" || node.type === "radio")) nodeData.attributes.checked = node.checked ? "true" : "false";
			}
			let nodeWasHighlighted = false;
			if (node.nodeType === Node.ELEMENT_NODE) {
				nodeData.isVisible = isElementVisible(node);
				if (nodeData.isVisible) {
					nodeData.isTopElement = isTopElement(node);
					const role = node.getAttribute("role");
					const isMenuContainer = role === "menu" || role === "menubar" || role === "listbox";
					if (nodeData.isTopElement || isMenuContainer) {
						nodeData.isInteractive = isInteractiveElement(node);
						nodeWasHighlighted = handleHighlighting(nodeData, node, parentIframe, isParentHighlighted);
						/**
						* @edit direct dom ref
						*/
						nodeData.ref = node;
						/**
						* @edit make sure attributes exist for interactive candidates.
						* @note if the element failed the isInteractiveCandidate, attributes would be empty.
						*/
						if (nodeData.isInteractive && Object.keys(nodeData.attributes).length === 0) {
							const attributeNames = node.getAttributeNames?.() || [];
							for (const name of attributeNames) {
								const value = node.getAttribute(name);
								nodeData.attributes[name] = value;
							}
						}
					}
				}
			}
			if (node.tagName) {
				const tagName = node.tagName.toLowerCase();
				if (tagName === "iframe") try {
					const iframeDoc = node.contentDocument || node.contentWindow?.document;
					if (iframeDoc) for (const child of iframeDoc.childNodes) {
						const domElement = buildDomTree(child, node, false);
						if (domElement) nodeData.children.push(domElement);
					}
				} catch (e) {
					console.warn("Unable to access iframe:", e);
				}
				else if (node.isContentEditable || node.getAttribute("contenteditable") === "true" || node.id === "tinymce" || node.classList.contains("mce-content-body") || tagName === "body" && node.getAttribute("data-id")?.startsWith("mce_")) for (const child of node.childNodes) {
					const domElement = buildDomTree(child, parentIframe, nodeWasHighlighted);
					if (domElement) nodeData.children.push(domElement);
				}
				else {
					if (node.shadowRoot) {
						nodeData.shadowRoot = true;
						for (const child of node.shadowRoot.childNodes) {
							const domElement = buildDomTree(child, parentIframe, nodeWasHighlighted);
							if (domElement) nodeData.children.push(domElement);
						}
					}
					for (const child of node.childNodes) {
						const domElement = buildDomTree(child, parentIframe, nodeWasHighlighted || isParentHighlighted);
						if (domElement) nodeData.children.push(domElement);
					}
				}
			}
			if (nodeData.tagName === "a" && nodeData.children.length === 0 && !nodeData.attributes.href) {
				const rect = getCachedBoundingRect(node);
				if (!(rect && rect.width > 0 && rect.height > 0 || node.offsetWidth > 0 || node.offsetHeight > 0)) return null;
			}
			/**
			* @edit add `extra` field for extra data
			*/
			nodeData.extra = extraData.get(node) || null;
			const id = `${ID.current++}`;
			DOM_HASH_MAP[id] = nodeData;
			return id;
		}
		const rootId = buildDomTree(document.body);
		DOM_CACHE.clearCache();
		return {
			rootId,
			map: DOM_HASH_MAP
		};
	};
	//#endregion
	//#region ../page-controller/src/dom/index.ts
	var dom_exports = /* @__PURE__ */ __exportAll({
		cleanUpHighlights: () => cleanUpHighlights,
		flatTreeToString: () => flatTreeToString,
		getAllTextTillNextClickableElement: () => getAllTextTillNextClickableElement,
		getElementTextMap: () => getElementTextMap,
		getFlatTree: () => getFlatTree,
		getSelectorMap: () => getSelectorMap,
		resolveViewportExpansion: () => resolveViewportExpansion
	});
	/**
	* Viewport expansion for DOM tree extraction.
	* -1 means full page (no viewport restriction)
	* 0 means viewport only
	* positive values expand the viewport by that many pixels
	*
	* @note Since isTopElement depends on elementFromPoint,
	* it returns null when out of viewport, this feature has no practical use, only differ between -1 and 0
	*/
	var DEFAULT_VIEWPORT_EXPANSION = -1;
	function resolveViewportExpansion(viewportExpansion) {
		return viewportExpansion ?? DEFAULT_VIEWPORT_EXPANSION;
	}
	var SEMANTIC_TAGS = /* @__PURE__ */ new Set([
		"nav",
		"menu",
		"header",
		"footer",
		"aside",
		"dialog"
	]);
	/**
	* 用于检测可交互元素是否是新出现的。
	*/
	var newElementsCache = /* @__PURE__ */ new WeakMap();
	function getFlatTree(config) {
		const viewportExpansion = resolveViewportExpansion(config.viewportExpansion);
		const interactiveBlacklist = [];
		for (const item of config.interactiveBlacklist || []) if (typeof item === "function") interactiveBlacklist.push(item());
		else interactiveBlacklist.push(item);
		const interactiveWhitelist = [];
		for (const item of config.interactiveWhitelist || []) if (typeof item === "function") interactiveWhitelist.push(item());
		else interactiveWhitelist.push(item);
		const elements = dom_tree_default({
			doHighlightElements: true,
			debugMode: true,
			focusHighlightIndex: -1,
			viewportExpansion,
			interactiveBlacklist,
			interactiveWhitelist,
			highlightOpacity: config.highlightOpacity ?? 0,
			highlightLabelOpacity: config.highlightLabelOpacity ?? .1
		});
		const currentUrl = window.location.href;
		/**
		* 标记新出现的元素
		* @todo browser-use 使用 hash(位置，属性等信息) 来判断是否同一个元素，
		*       能够解决 1. 元素被删除后重新添加 2. 页面卸载 等问题。
		*       这里先简单做.
		*/
		for (const nodeId in elements.map) {
			const node = elements.map[nodeId];
			if (node.isInteractive && node.ref) {
				const ref = node.ref;
				if (!newElementsCache.has(ref)) {
					newElementsCache.set(ref, currentUrl);
					node.isNew = true;
				}
			}
		}
		return elements;
	}
	var globRegexCache = /* @__PURE__ */ new Map();
	function globToRegex(pattern) {
		let regex = globRegexCache.get(pattern);
		if (!regex) {
			const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
			regex = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`);
			globRegexCache.set(pattern, regex);
		}
		return regex;
	}
	function matchAttributes(attrs, patterns) {
		const result = {};
		for (const pattern of patterns) if (pattern.includes("*")) {
			const regex = globToRegex(pattern);
			for (const key of Object.keys(attrs)) if (regex.test(key) && attrs[key].trim()) result[key] = attrs[key].trim();
		} else {
			const value = attrs[pattern];
			if (value && value.trim()) result[pattern] = value.trim();
		}
		return result;
	}
	/**
	* The page as text for the LLM (the counterpart of browser-use's
	* `views::clickable_elements_to_string`), for example:
	* ``` text
	* [0]<a aria-label=Home />
	* [1]<div >Waifu Agent
	* Your anime AI companion />
	* [2]<a >Docs />
	* Plain text on the page is listed as it is.
	* [3]<a role=button>Get started />
	* ```
	* Interactive elements are numbered, so the LLM can act on them by index. Indentation
	* shows nesting.
	*
	* @todo Redact sensitive data
	*/
	function flatTreeToString(flatTree, includeAttributes = [], keepSemanticTags = false) {
		const DEFAULT_INCLUDE_ATTRIBUTES = [
			"title",
			"type",
			"checked",
			"name",
			"role",
			"value",
			"placeholder",
			"data-date-format",
			"alt",
			"aria-label",
			"aria-expanded",
			"data-state",
			"aria-checked",
			"id",
			"for",
			"target",
			"aria-haspopup",
			"aria-controls",
			"aria-owns",
			"contenteditable"
		];
		const includeAttrs = [...includeAttributes, ...DEFAULT_INCLUDE_ATTRIBUTES];
		const capTextLength = (text, maxLength) => {
			if (text.length > maxLength) return text.substring(0, maxLength) + "...";
			return text;
		};
		const buildTreeNode = (nodeId) => {
			const node = flatTree.map[nodeId];
			if (!node) return null;
			if (node.type === "TEXT_NODE") {
				const textNode = node;
				return {
					type: "text",
					text: textNode.text,
					isVisible: textNode.isVisible,
					parent: null,
					children: []
				};
			} else {
				const elementNode = node;
				const children = [];
				if (elementNode.children) for (const childId of elementNode.children) {
					const child = buildTreeNode(childId);
					if (child) {
						child.parent = null;
						children.push(child);
					}
				}
				return {
					type: "element",
					tagName: elementNode.tagName,
					attributes: elementNode.attributes ?? {},
					isVisible: elementNode.isVisible ?? false,
					isInteractive: elementNode.isInteractive ?? false,
					isTopElement: elementNode.isTopElement ?? false,
					isNew: elementNode.isNew ?? false,
					highlightIndex: elementNode.highlightIndex,
					parent: null,
					children,
					extra: elementNode.extra ?? {}
				};
			}
		};
		const setParentReferences = (node, parent = null) => {
			node.parent = parent;
			for (const child of node.children) setParentReferences(child, node);
		};
		const rootNode = buildTreeNode(flatTree.rootId);
		if (!rootNode) return "";
		setParentReferences(rootNode);
		const hasParentWithHighlightIndex = (node) => {
			let current = node.parent;
			while (current) {
				if (current.type === "element" && current.highlightIndex !== void 0) return true;
				current = current.parent;
			}
			return false;
		};
		const processNode = (node, depth, result) => {
			let nextDepth = depth;
			const depthStr = "	".repeat(depth);
			if (node.type === "element") {
				const isSemantic = keepSemanticTags && node.tagName && SEMANTIC_TAGS.has(node.tagName);
				if (node.highlightIndex !== void 0) {
					nextDepth += 1;
					const text = getAllTextTillNextClickableElement(node);
					let attributesHtmlStr = "";
					if (includeAttrs.length > 0 && node.attributes) {
						const attributesToInclude = matchAttributes(node.attributes, includeAttrs);
						const keys = Object.keys(attributesToInclude);
						if (keys.length > 1) {
							const keysToRemove = /* @__PURE__ */ new Set();
							const seenValues = {};
							for (const key of keys) {
								const value = attributesToInclude[key];
								if (value.length > 5) {
									if (value in seenValues) keysToRemove.add(key);
									else seenValues[value] = key;
								}
							}
							for (const key of keysToRemove) delete attributesToInclude[key];
						}
						if (attributesToInclude.role === node.tagName) delete attributesToInclude.role;
						for (const attr of [
							"aria-label",
							"placeholder",
							"title"
						]) if (attributesToInclude[attr] && attributesToInclude[attr].toLowerCase().trim() === text.toLowerCase().trim()) delete attributesToInclude[attr];
						if (Object.keys(attributesToInclude).length > 0) attributesHtmlStr = Object.entries(attributesToInclude).map(([key, value]) => `${key}=${capTextLength(value, 20)}`).join(" ");
					}
					let line = `${depthStr}${node.isNew ? `*[${node.highlightIndex}]` : `[${node.highlightIndex}]`}<${node.tagName ?? ""}`;
					if (attributesHtmlStr) line += ` ${attributesHtmlStr}`;
					/**
					* @edit scrollable 数据
					*/
					if (node.extra) {
						if (node.extra.scrollable) {
							let scrollDataText = "";
							if (node.extra.scrollData?.left) scrollDataText += `left=${node.extra.scrollData.left}, `;
							if (node.extra.scrollData?.top) scrollDataText += `top=${node.extra.scrollData.top}, `;
							if (node.extra.scrollData?.right) scrollDataText += `right=${node.extra.scrollData.right}, `;
							if (node.extra.scrollData?.bottom) scrollDataText += `bottom=${node.extra.scrollData.bottom}`;
							line += ` data-scrollable="${scrollDataText}"`;
						}
					}
					if (text) {
						const trimmedText = text.trim();
						if (!attributesHtmlStr) line += " ";
						line += `>${trimmedText}`;
					} else if (!attributesHtmlStr) line += " ";
					line += " />";
					result.push(line);
				}
				const emitSemantic = isSemantic && node.highlightIndex === void 0;
				const mark = emitSemantic ? result.length : -1;
				if (emitSemantic) {
					result.push(`${depthStr}<${node.tagName}>`);
					nextDepth += 1;
				}
				for (const child of node.children) processNode(child, nextDepth, result);
				if (emitSemantic) {
					if (result.length === mark + 1) result.pop();
					else result.push(`${depthStr}</${node.tagName}>`);
				}
			} else if (node.type === "text") {
				if (hasParentWithHighlightIndex(node)) return;
				if (node.parent && node.parent.type === "element" && node.parent.isVisible && node.parent.isTopElement) result.push(`${depthStr}${node.text ?? ""}`);
			}
		};
		const result = [];
		processNode(rootNode, 0, result);
		return result.join("\n");
	}
	var getAllTextTillNextClickableElement = (node, maxDepth = -1) => {
		const textParts = [];
		const collectText = (currentNode, currentDepth) => {
			if (maxDepth !== -1 && currentDepth > maxDepth) return;
			if (currentNode.type === "element" && currentNode !== node && currentNode.highlightIndex !== void 0) return;
			if (currentNode.type === "text" && currentNode.text) textParts.push(currentNode.text);
			else if (currentNode.type === "element") for (const child of currentNode.children) collectText(child, currentDepth + 1);
		};
		collectText(node, 0);
		return textParts.join("\n").trim();
	};
	function getSelectorMap(flatTree) {
		const selectorMap = /* @__PURE__ */ new Map();
		const keys = Object.keys(flatTree.map);
		for (const key of keys) {
			const node = flatTree.map[key];
			if (node.isInteractive && typeof node.highlightIndex === "number") selectorMap.set(node.highlightIndex, node);
		}
		return selectorMap;
	}
	function getElementTextMap(simplifiedHTML) {
		const lines = simplifiedHTML.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
		const elementTextMap = /* @__PURE__ */ new Map();
		for (const line of lines) {
			const match = /^\*?\[(\d+)\]<[^>]+>([^<]*)/.exec(line);
			if (match) {
				const index = parseInt(match[1], 10);
				elementTextMap.set(index, line);
			}
		}
		return elementTextMap;
	}
	function cleanUpHighlights() {
		const cleanupFunctions = window._highlightCleanupFunctions || [];
		for (const cleanup of cleanupFunctions) if (typeof cleanup === "function") cleanup();
		window._highlightCleanupFunctions = [];
	}
	window.addEventListener("popstate", () => {
		cleanUpHighlights();
	});
	window.addEventListener("hashchange", () => {
		cleanUpHighlights();
	});
	window.addEventListener("beforeunload", () => {
		cleanUpHighlights();
	});
	var navigation = window.navigation;
	if (navigation && typeof navigation.addEventListener === "function") navigation.addEventListener("navigate", () => {
		cleanUpHighlights();
	});
	else {
		let currentUrl = window.location.href;
		setInterval(() => {
			if (window.location.href !== currentUrl) {
				currentUrl = window.location.href;
				cleanUpHighlights();
			}
		}, 500);
	}
	//#endregion
	//#region ../page-controller/src/dom/getPageInfo.ts
	function getPageInfo() {
		const viewport_width = window.innerWidth;
		const viewport_height = window.innerHeight;
		const page_width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth || 0);
		const page_height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight || 0);
		const scroll_x = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
		const scroll_y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
		const pixels_below = Math.max(0, page_height - (window.innerHeight + scroll_y));
		const pixels_right = Math.max(0, page_width - (window.innerWidth + scroll_x));
		return {
			viewport_width,
			viewport_height,
			page_width,
			page_height,
			scroll_x,
			scroll_y,
			pixels_above: scroll_y,
			pixels_below,
			pages_above: viewport_height > 0 ? scroll_y / viewport_height : 0,
			pages_below: viewport_height > 0 ? pixels_below / viewport_height : 0,
			total_pages: viewport_height > 0 ? page_height / viewport_height : 0,
			current_page_position: scroll_y / Math.max(1, page_height - viewport_height),
			pixels_left: scroll_x,
			pixels_right
		};
	}
	function antiCopyCanvases() {
		const nodes = [...document.querySelectorAll("canvas")];
		const hit = [];
		for (const c of nodes) {
			const r = c.getBoundingClientRect();
			if (r.width < 80 || r.height < 36) continue;
			if (r.bottom < 0 || r.top > window.innerHeight) continue;
			hit.push(c);
		}
		const paper = document.querySelector("[data-reading-content-type], .novel-reader__paper, article");
		const paperText = (paper?.innerText || "").replace(/\s+/g, " ").trim();
		const named = hit.filter((c) => /novel-reader__canvas|reader__canvas/i.test(c.className || ""));
		if (named.length) return named;
		if (hit.length >= 2 && (paperText.length < 240 || /đang mở|đang tải|loading/i.test(paperText))) return hit;
		return [];
	}
	async function ocrAntiCopyCanvases() {
		const canvases = antiCopyCanvases().slice(0, 10);
		if (!canvases.length || !chrome?.runtime?.sendMessage) return "";
		const parts = [];
		for (const c of canvases) {
			let dataUrl = "";
			try {
				dataUrl = c.toDataURL("image/png");
			} catch {
				continue;
			}
			if (!dataUrl || dataUrl.length < 80) continue;
			const resp = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ type: "ZW_OCR", image: dataUrl }, (r) => resolve(r || null));
			});
			if (resp?.text) parts.push(String(resp.text).trim());
		}
		return parts.filter(Boolean).join("\n");
	}
	//#endregion
	//#region ../page-controller/src/patches/react.ts
	function patchReact(pageController) {
		const reactRootElements = document.querySelectorAll("[data-reactroot], [data-reactid], [data-react-checksum], #root, #app, [id^=\"root-\"], [id^=\"app-\"], #adex-wrapper, #adex-root");
		for (const element of reactRootElements) element.setAttribute("data-waifu-agent-not-interactive", "true");
	}
	/**
	* @todo (Heavy, might have false negatives) Interaction detection, if element width/height equals body offsetWidth/Height, consider it root element and non-interactive (React often attaches many events to root elements, causing false positives)
	*/
	//#endregion
	//#region ../../node_modules/ai-motion/build/Motion.js
	/**
	* AI Motion - WebGL2 animated border with AI-style glow effects
	*
	* @author Simon<gaomeng1900@gmail.com>
	* @license MIT
	* @repository https://github.com/gaomeng1900/ai-motion
	*/
	function computeBorderGeometry(pixelWidth, pixelHeight, borderWidth, glowWidth) {
		const shortSide = Math.max(1, Math.min(pixelWidth, pixelHeight));
		const totalThick = Math.min(Math.min(borderWidth, 20) + glowWidth, shortSide);
		const insetX = Math.min(totalThick, Math.floor(pixelWidth / 2));
		const insetY = Math.min(totalThick, Math.floor(pixelHeight / 2));
		const toClipX = (x) => x / pixelWidth * 2 - 1;
		const toClipY = (y) => y / pixelHeight * 2 - 1;
		const x0 = 0;
		const x1 = pixelWidth;
		const y0 = 0;
		const y1 = pixelHeight;
		const xi0 = insetX;
		const xi1 = pixelWidth - insetX;
		const yi0 = insetY;
		const yi1 = pixelHeight - insetY;
		const X0 = toClipX(x0);
		const X1 = toClipX(x1);
		const Y0 = toClipY(y0);
		const Y1 = toClipY(y1);
		const Xi0 = toClipX(xi0);
		const Xi1 = toClipX(xi1);
		const Yi0 = toClipY(yi0);
		const Yi1 = toClipY(yi1);
		const u0 = 0;
		const v0 = 0;
		const u1 = 1;
		const v1 = 1;
		const ui0 = insetX / pixelWidth;
		const ui1 = 1 - insetX / pixelWidth;
		const vi0 = insetY / pixelHeight;
		const vi1 = 1 - insetY / pixelHeight;
		return {
			positions: new Float32Array([
				X0,
				Y0,
				X1,
				Y0,
				X0,
				Yi0,
				X0,
				Yi0,
				X1,
				Y0,
				X1,
				Yi0,
				X0,
				Yi1,
				X1,
				Yi1,
				X0,
				Y1,
				X0,
				Y1,
				X1,
				Yi1,
				X1,
				Y1,
				X0,
				Yi0,
				Xi0,
				Yi0,
				X0,
				Yi1,
				X0,
				Yi1,
				Xi0,
				Yi0,
				Xi0,
				Yi1,
				Xi1,
				Yi0,
				X1,
				Yi0,
				Xi1,
				Yi1,
				Xi1,
				Yi1,
				X1,
				Yi0,
				X1,
				Yi1
			]),
			uvs: new Float32Array([
				u0,
				v0,
				u1,
				v0,
				u0,
				vi0,
				u0,
				vi0,
				u1,
				v0,
				u1,
				vi0,
				u0,
				vi1,
				u1,
				vi1,
				u0,
				v1,
				u0,
				v1,
				u1,
				vi1,
				u1,
				v1,
				u0,
				vi0,
				ui0,
				vi0,
				u0,
				vi1,
				u0,
				vi1,
				ui0,
				vi0,
				ui0,
				vi1,
				ui1,
				vi0,
				u1,
				vi0,
				ui1,
				vi1,
				ui1,
				vi1,
				u1,
				vi0,
				u1,
				vi1
			])
		};
	}
	/**
	* AI Motion - WebGL2 animated border with AI-style glow effects
	*
	* @author Simon<gaomeng1900@gmail.com>
	* @license MIT
	* @repository https://github.com/gaomeng1900/ai-motion
	*/
	function compileShader(gl, type, source) {
		const shader = gl.createShader(type);
		if (!shader) throw new Error("Failed to create shader");
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader) || "Unknown shader error";
			gl.deleteShader(shader);
			throw new Error(info);
		}
		return shader;
	}
	function createProgram(gl, vertexSource, fragmentSource) {
		const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
		const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
		const program = gl.createProgram();
		if (!program) throw new Error("Failed to create program");
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program) || "Unknown link error";
			gl.deleteProgram(program);
			gl.deleteShader(vs);
			gl.deleteShader(fs);
			throw new Error(info);
		}
		gl.deleteShader(vs);
		gl.deleteShader(fs);
		return program;
	}
	/**
	* AI Motion - WebGL2 animated border with AI-style glow effects
	*
	* @author Simon<gaomeng1900@gmail.com>
	* @license MIT
	* @repository https://github.com/gaomeng1900/ai-motion
	*/
	function parseColor(colorStr) {
		const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (!match) throw new Error(`Invalid color format: ${colorStr}`);
		const [, r, g, b] = match;
		return [
			parseInt(r) / 255,
			parseInt(g) / 255,
			parseInt(b) / 255
		];
	}
	var fragmentShaderSource, vertexShaderSource, DEFAULT_COLORS, Motion;
	var init_Motion = __esmMin((() => {
		fragmentShaderSource = `#version 300 es
precision lowp float;
in vec2 vUV;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBorderWidth;
uniform float uGlowWidth;
uniform float uBorderRadius;
uniform vec3 uColors[4];
uniform float uGlowExponent;
uniform float uGlowFactor;
const float PI = 3.14159265359;
const float TWO_PI = 2.0 * PI;
const float HALF_PI = 0.5 * PI;
const vec4 startPositions = vec4(0.0, PI, HALF_PI, 1.5 * PI);
const vec4 speeds = vec4(-1.9, -1.9, -1.5, 2.1);
const vec4 innerRadius = vec4(PI * 0.8, PI * 0.7, PI * 0.3, PI * 0.1);
const vec4 outerRadius = vec4(PI * 1.2, PI * 0.9, PI * 0.6, PI * 0.4);
float random(vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec2 random2(vec2 st) {
return vec2(random(st), random(st + 1.0));
}
float aaStep(float edge, float d) {
float width = fwidth(d);
return smoothstep(edge - width * 0.5, edge + width * 0.5, d);
}
float aaFract(float x) {
float f = fract(x);
float w = fwidth(x);
float smooth_f = f * (1.0 - smoothstep(1.0 - w, 1.0, f));
return smooth_f;
}
float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
vec2 q = abs(p) - b + r;
return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}
float getInnerGlow(vec2 p, vec2 b, float radius) {
float dist_x = b.x - abs(p.x);
float dist_y = b.y - abs(p.y);
float glow_x = smoothstep(radius, 0.0, dist_x);
float glow_y = smoothstep(radius, 0.0, dist_y);
return 1.0 - (1.0 - glow_x) * (1.0 - glow_y);
}
float getVignette(vec2 uv) {
vec2 vignetteUv = uv;
vignetteUv = vignetteUv * (1.0 - vignetteUv);
float vignette = vignetteUv.x * vignetteUv.y * 25.0;
vignette = pow(vignette, 0.16);
vignette = 1.0 - vignette;
return vignette;
}
float uvToAngle(vec2 uv) {
vec2 center = vec2(0.5);
vec2 dir = uv - center;
return atan(dir.y, dir.x) + PI;
}
void main() {
vec2 uv = vUV;
vec2 pos = uv * uResolution;
vec2 centeredPos = pos - uResolution * 0.5;
vec2 size = uResolution - uBorderWidth;
vec2 halfSize = size * 0.5;
float dBorderBox = sdRoundedBox(centeredPos, halfSize, uBorderRadius);
float border = aaStep(0.0, dBorderBox);
float glow = getInnerGlow(centeredPos, halfSize, uGlowWidth);
float vignette = getVignette(uv);
glow *= vignette;
float posAngle = uvToAngle(uv);
vec4 lightCenter = mod(startPositions + speeds * uTime, TWO_PI);
vec4 angleDist = abs(posAngle - lightCenter);
vec4 disToLight = min(angleDist, TWO_PI - angleDist) / TWO_PI;
float intensityBorder[4];
intensityBorder[0] = 1.0;
intensityBorder[1] = smoothstep(0.4, 0.0, disToLight.y);
intensityBorder[2] = smoothstep(0.4, 0.0, disToLight.z);
intensityBorder[3] = smoothstep(0.2, 0.0, disToLight.w) * 0.5;
vec3 borderColor = vec3(0.0);
for(int i = 0; i < 4; i++) {
borderColor = mix(borderColor, uColors[i], intensityBorder[i]);
}
borderColor *= 1.1;
borderColor = clamp(borderColor, 0.0, 1.0);
float intensityGlow[4];
intensityGlow[0] = smoothstep(0.9, 0.0, disToLight.x);
intensityGlow[1] = smoothstep(0.7, 0.0, disToLight.y);
intensityGlow[2] = smoothstep(0.4, 0.0, disToLight.z);
intensityGlow[3] = smoothstep(0.1, 0.0, disToLight.w) * 0.7;
vec4 breath = smoothstep(0.0, 1.0, sin(uTime * 1.0 + startPositions * PI) * 0.2 + 0.8);
vec3 glowColor = vec3(0.0);
glowColor += uColors[0] * intensityGlow[0] * breath.x;
glowColor += uColors[1] * intensityGlow[1] * breath.y;
glowColor += uColors[2] * intensityGlow[2] * breath.z;
glowColor += uColors[3] * intensityGlow[3] * breath.w * glow;
glow = pow(glow, uGlowExponent);
glow *= random(pos + uTime) * 0.1 + 1.0;
glowColor *= glow * uGlowFactor;
glowColor = clamp(glowColor, 0.0, 1.0);
vec3 color = mix(glowColor, borderColor + glowColor * 0.2, border);
float alpha = mix(glow, 1.0, border);
outColor = vec4(color, alpha);
}`;
		vertexShaderSource = `#version 300 es
in vec2 aPosition;
in vec2 aUV;
out vec2 vUV;
void main() {
vUV = aUV;
gl_Position = vec4(aPosition, 0.0, 1.0);
}`;
		DEFAULT_COLORS = [
			"rgb(57, 182, 255)",
			"rgb(189, 69, 251)",
			"rgb(255, 87, 51)",
			"rgb(255, 214, 0)"
		];
		Motion = class {
			element;
			canvas;
			options;
			running = false;
			disposed = false;
			startTime = 0;
			lastTime = 0;
			rafId = null;
			glr;
			observer;
			constructor(options = {}) {
				this.options = {
					width: options.width ?? 600,
					height: options.height ?? 600,
					ratio: options.ratio ?? window.devicePixelRatio ?? 1,
					borderWidth: options.borderWidth ?? 8,
					glowWidth: options.glowWidth ?? 200,
					borderRadius: options.borderRadius ?? 8,
					mode: options.mode ?? "light",
					...options
				};
				this.canvas = document.createElement("canvas");
				if (this.options.classNames) this.canvas.className = this.options.classNames;
				if (this.options.styles) Object.assign(this.canvas.style, this.options.styles);
				this.canvas.style.display = "block";
				this.canvas.style.transformOrigin = "center";
				this.canvas.style.pointerEvents = "none";
				this.element = this.canvas;
				this.setupGL();
				if (!this.options.skipGreeting) this.greet();
			}
			start() {
				if (this.disposed) throw new Error("Motion instance has been disposed.");
				if (this.running) return;
				if (!this.glr) {
					console.error("WebGL resources are not initialized.");
					return;
				}
				this.running = true;
				this.startTime = performance.now();
				this.resize(this.options.width ?? 600, this.options.height ?? 600, this.options.ratio);
				this.glr.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
				this.glr.gl.useProgram(this.glr.program);
				this.glr.gl.uniform2f(this.glr.uResolution, this.canvas.width, this.canvas.height);
				this.checkGLError(this.glr.gl, "start: after initial setup");
				const loop = () => {
					if (!this.running || !this.glr) return;
					this.rafId = requestAnimationFrame(loop);
					const now = performance.now();
					if (now - this.lastTime < 1e3 / 32) return;
					this.lastTime = now;
					const t = (now - this.startTime) * .001;
					this.render(t);
				};
				this.rafId = requestAnimationFrame(loop);
			}
			pause() {
				if (this.disposed) throw new Error("Motion instance has been disposed.");
				this.running = false;
				if (this.rafId !== null) cancelAnimationFrame(this.rafId);
			}
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				this.running = false;
				if (this.rafId !== null) cancelAnimationFrame(this.rafId);
				const { gl, vao, positionBuffer, uvBuffer, program } = this.glr;
				if (vao) gl.deleteVertexArray(vao);
				if (positionBuffer) gl.deleteBuffer(positionBuffer);
				if (uvBuffer) gl.deleteBuffer(uvBuffer);
				gl.deleteProgram(program);
				if (this.observer) this.observer.disconnect();
				this.canvas.remove();
			}
			resize(width, height, ratio) {
				if (this.disposed) throw new Error("Motion instance has been disposed.");
				this.options.width = width;
				this.options.height = height;
				if (ratio) this.options.ratio = ratio;
				if (!this.running) return;
				const { gl, program, vao, positionBuffer, uvBuffer, uResolution } = this.glr;
				const dpr = ratio ?? this.options.ratio ?? window.devicePixelRatio ?? 1;
				const desiredWidth = Math.max(1, Math.floor(width * dpr));
				const desiredHeight = Math.max(1, Math.floor(height * dpr));
				this.canvas.style.width = `${width}px`;
				this.canvas.style.height = `${height}px`;
				if (this.canvas.width !== desiredWidth || this.canvas.height !== desiredHeight) {
					this.canvas.width = desiredWidth;
					this.canvas.height = desiredHeight;
				}
				gl.viewport(0, 0, this.canvas.width, this.canvas.height);
				this.checkGLError(gl, "resize: after viewport setup");
				const { positions, uvs } = computeBorderGeometry(this.canvas.width, this.canvas.height, this.options.borderWidth * dpr, this.options.glowWidth * dpr);
				gl.bindVertexArray(vao);
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
				const aPosition = gl.getAttribLocation(program, "aPosition");
				gl.enableVertexAttribArray(aPosition);
				gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
				this.checkGLError(gl, "resize: after position buffer update");
				gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
				const aUV = gl.getAttribLocation(program, "aUV");
				gl.enableVertexAttribArray(aUV);
				gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
				this.checkGLError(gl, "resize: after UV buffer update");
				gl.useProgram(program);
				gl.uniform2f(uResolution, this.canvas.width, this.canvas.height);
				gl.uniform1f(this.glr.uBorderWidth, this.options.borderWidth * dpr);
				gl.uniform1f(this.glr.uGlowWidth, this.options.glowWidth * dpr);
				gl.uniform1f(this.glr.uBorderRadius, this.options.borderRadius * dpr);
				this.checkGLError(gl, "resize: after uniform updates");
				const now = performance.now();
				this.lastTime = now;
				const t = (now - this.startTime) * .001;
				this.render(t);
			}
			/**
			* Automatically resizes the canvas to match the dimensions of the given element.
			* @note using ResizeObserver
			*/
			autoResize(sourceElement) {
				if (this.observer) this.observer.disconnect();
				this.observer = new ResizeObserver(() => {
					const rect = sourceElement.getBoundingClientRect();
					this.resize(rect.width, rect.height);
				});
				this.observer.observe(sourceElement);
			}
			fadeIn() {
				if (this.disposed) throw new Error("Motion instance has been disposed.");
				return new Promise((resolve, reject) => {
					const animation = this.canvas.animate([{
						opacity: 0,
						transform: "scale(1.2)"
					}, {
						opacity: 1,
						transform: "scale(1)"
					}], {
						duration: 300,
						easing: "ease-out",
						fill: "forwards"
					});
					animation.onfinish = () => resolve();
					animation.oncancel = () => reject("canceled");
				});
			}
			fadeOut() {
				if (this.disposed) throw new Error("Motion instance has been disposed.");
				return new Promise((resolve, reject) => {
					const animation = this.canvas.animate([{
						opacity: 1,
						transform: "scale(1)"
					}, {
						opacity: 0,
						transform: "scale(1.2)"
					}], {
						duration: 300,
						easing: "ease-in",
						fill: "forwards"
					});
					animation.onfinish = () => resolve();
					animation.oncancel = () => reject("canceled");
				});
			}
			checkGLError(gl, context) {
				let error = gl.getError();
				if (error !== gl.NO_ERROR) {
					console.group(`🔴 WebGL Error in ${context}`);
					while (error !== gl.NO_ERROR) {
						const errorName = this.getGLErrorName(gl, error);
						console.error(`${errorName} (0x${error.toString(16)})`);
						error = gl.getError();
					}
					console.groupEnd();
				}
			}
			getGLErrorName(gl, error) {
				switch (error) {
					case gl.INVALID_ENUM: return "INVALID_ENUM";
					case gl.INVALID_VALUE: return "INVALID_VALUE";
					case gl.INVALID_OPERATION: return "INVALID_OPERATION";
					case gl.INVALID_FRAMEBUFFER_OPERATION: return "INVALID_FRAMEBUFFER_OPERATION";
					case gl.OUT_OF_MEMORY: return "OUT_OF_MEMORY";
					case gl.CONTEXT_LOST_WEBGL: return "CONTEXT_LOST_WEBGL";
					default: return "UNKNOWN_ERROR";
				}
			}
			setupGL() {
				const gl = this.canvas.getContext("webgl2", {
					antialias: false,
					alpha: true
				});
				if (!gl) throw new Error("WebGL2 is required but not available.");
				const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
				this.checkGLError(gl, "setupGL: after createProgram");
				const vao = gl.createVertexArray();
				gl.bindVertexArray(vao);
				this.checkGLError(gl, "setupGL: after VAO creation");
				const { positions, uvs } = computeBorderGeometry(this.canvas.width || 2, this.canvas.height || 2, this.options.borderWidth, this.options.glowWidth);
				const positionBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
				const aPosition = gl.getAttribLocation(program, "aPosition");
				gl.enableVertexAttribArray(aPosition);
				gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
				this.checkGLError(gl, "setupGL: after position buffer setup");
				const uvBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
				const aUV = gl.getAttribLocation(program, "aUV");
				gl.enableVertexAttribArray(aUV);
				gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
				this.checkGLError(gl, "setupGL: after UV buffer setup");
				const uResolution = gl.getUniformLocation(program, "uResolution");
				const uTime = gl.getUniformLocation(program, "uTime");
				const uBorderWidth = gl.getUniformLocation(program, "uBorderWidth");
				const uGlowWidth = gl.getUniformLocation(program, "uGlowWidth");
				const uBorderRadius = gl.getUniformLocation(program, "uBorderRadius");
				const uColors = gl.getUniformLocation(program, "uColors");
				const uGlowExponent = gl.getUniformLocation(program, "uGlowExponent");
				const uGlowFactor = gl.getUniformLocation(program, "uGlowFactor");
				gl.useProgram(program);
				gl.uniform1f(uBorderWidth, this.options.borderWidth);
				gl.uniform1f(uGlowWidth, this.options.glowWidth);
				gl.uniform1f(uBorderRadius, this.options.borderRadius);
				if (this.options.mode === "dark") {
					gl.uniform1f(uGlowExponent, 2);
					gl.uniform1f(uGlowFactor, 1.8);
				} else {
					gl.uniform1f(uGlowExponent, 1);
					gl.uniform1f(uGlowFactor, 1);
				}
				const colorVecs = (this.options.colors || DEFAULT_COLORS).map(parseColor);
				for (let i = 0; i < colorVecs.length; i++) gl.uniform3f(gl.getUniformLocation(program, `uColors[${i}]`), ...colorVecs[i]);
				this.checkGLError(gl, "setupGL: after uniform setup");
				gl.bindVertexArray(null);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				this.glr = {
					gl,
					program,
					vao,
					positionBuffer,
					uvBuffer,
					uResolution,
					uTime,
					uBorderWidth,
					uGlowWidth,
					uBorderRadius,
					uColors
				};
			}
			render(t) {
				if (!this.glr) return;
				const { gl, program, vao, uTime } = this.glr;
				gl.useProgram(program);
				gl.bindVertexArray(vao);
				gl.uniform1f(uTime, t);
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.CULL_FACE);
				gl.disable(gl.BLEND);
				gl.clearColor(0, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.drawArrays(gl.TRIANGLES, 0, 24);
				this.checkGLError(gl, "render: after draw call");
				gl.bindVertexArray(null);
			}
			greet() {
				console.log(`%c🌈 ai-motion 0.4.8 🌈`, "background: linear-gradient(90deg, #39b6ff, #bd45fb, #ff5733, #ffd600); color: white; text-shadow: 0 0 2px rgba(0, 0, 0, 0.2); font-weight: bold; font-size: 1em; padding: 2px 12px; border-radius: 6px;");
			}
		};
	}));
	//#endregion
	//#region ../page-controller/src/mask/checkDarkMode.ts
	/**
	* A comprehensive function to determine if the page is currently in a dark theme.
	* Heuristic check. Only work for common patterns. Return false by default.
	*/
	function isPageDark() {
		try {
			if (hasDarkModeClass()) return true;
			if (hasDarkModeDataAttribute()) return true;
			if (isColorSchemeDark()) return true;
			if (isBackgroundDark()) return true;
			if (isMainContentBackgroundDark()) return true;
			if (isTextColorLight()) return true;
			return false;
		} catch (error) {
			console.warn("Error determining if page is dark:", error);
			return false;
		}
	}
	/**
	* Checks for common dark mode CSS classes on the html or body elements.
	*/
	function hasDarkModeClass() {
		const DEFAULT_DARK_MODE_CLASSES = [
			"dark",
			"dark-mode",
			"theme-dark",
			"night",
			"night-mode"
		];
		const htmlElement = document.documentElement;
		const bodyElement = document.body || document.documentElement;
		for (const className of DEFAULT_DARK_MODE_CLASSES) if (htmlElement.classList.contains(className) || bodyElement?.classList.contains(className)) return true;
		return false;
	}
	/**
	* Some UI frameworks use data attributes to indicate theme
	*/
	function hasDarkModeDataAttribute() {
		const htmlElement = document.documentElement;
		const bodyElement = document.body || document.documentElement;
		for (const attr of [
			"data-theme",
			"data-color-mode",
			"data-bs-theme",
			"data-mui-color-scheme"
		]) {
			const bodyValue = bodyElement?.getAttribute(attr);
			const htmlValue = htmlElement.getAttribute(attr);
			if (bodyValue?.toLowerCase() === "dark" || htmlValue?.toLowerCase() === "dark") return true;
		}
		return false;
	}
	/**
	* Checks the CSS `color-scheme` property and `<meta name="color-scheme">` tag.
	* Only "dark"/"only dark" counts as dark; "light dark" is ambiguous and ignored.
	*/
	function isColorSchemeDark() {
		const metaContent = document.querySelector("meta[name=\"color-scheme\"]")?.content.toLowerCase();
		if (metaContent === "dark" || metaContent === "only dark") return true;
		const colorScheme = window.getComputedStyle(document.documentElement).getPropertyValue("color-scheme").trim().toLowerCase();
		return colorScheme === "dark" || colorScheme === "only dark";
	}
	/**
	* Checks the background color of the body element to determine if the page is dark.
	*/
	function isBackgroundDark() {
		const htmlStyle = window.getComputedStyle(document.documentElement);
		const bodyStyle = window.getComputedStyle(document.body || document.documentElement);
		const htmlBgColor = htmlStyle.backgroundColor;
		const bodyBgColor = bodyStyle.backgroundColor;
		if (isColorDark(bodyBgColor)) return true;
		else if (bodyBgColor === "transparent" || bodyBgColor.startsWith("rgba(0, 0, 0, 0)")) return isColorDark(htmlBgColor);
		return false;
	}
	/**
	* Checks if the text color on the body is light, which implies a dark background.
	*/
	function isTextColorLight() {
		/** Luminance (0-255) above which body text is considered light */
		const LIGHT_TEXT_LUMINANCE = 200;
		const luminance = getLuminance(window.getComputedStyle(document.body || document.documentElement).color);
		return luminance !== null && luminance > LIGHT_TEXT_LUMINANCE;
	}
	/**
	* Checks the background color of major layout elements (#app, #root, etc.).
	* Many SPAs render into a container that may have its own dark background while
	* <body> remains transparent.
	*/
	function isMainContentBackgroundDark() {
		const { innerWidth: vw, innerHeight: vh } = window;
		const minArea = vw * vh * .5;
		for (const selector of [
			"#app",
			"#root",
			"#__next"
		]) {
			const el = document.querySelector(selector);
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			if (rect.width * rect.height < minArea) continue;
			if (isColorDark(window.getComputedStyle(el).backgroundColor)) return true;
		}
		return false;
	}
	/**
	* Parses an RGB or RGBA color string and returns an object with r, g, b properties.
	* @param {string} colorString - e.g., "rgb(34, 34, 34)" or "rgba(0, 0, 0, 0.5)"
	* @returns {{r: number, g: number, b: number}|null}
	*/
	function parseRgbColor(colorString) {
		const rgbMatch = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(colorString);
		if (!rgbMatch) return null;
		return {
			r: parseInt(rgbMatch[1]),
			g: parseInt(rgbMatch[2]),
			b: parseInt(rgbMatch[3])
		};
	}
	/**
	* Calculates the perceived luminance (0-255) of a CSS color string.
	* @param {string} colorString - e.g., "rgb(50, 50, 50)" or "rgba(0, 0, 0, 0.5)"
	* @returns {number|null} - The luminance, or null if the color is transparent or unparseable.
	*/
	function getLuminance(colorString) {
		if (!colorString || colorString === "transparent" || colorString.startsWith("rgba(0, 0, 0, 0)")) return null;
		const rgb = parseRgbColor(colorString);
		if (!rgb) return null;
		return .299 * rgb.r + .587 * rgb.g + .114 * rgb.b;
	}
	/**
	* Determines if a color is "dark" based on its calculated luminance.
	* @param {string} colorString - The CSS color string (e.g., "rgb(50, 50, 50)").
	* @param {number} threshold - A value between 0 and 255. Colors with luminance below this will be considered dark. Default is 128.
	*/
	function isColorDark(colorString, threshold = 128) {
		const luminance = getLuminance(colorString);
		return luminance !== null && luminance < threshold;
	}
	var init_checkDarkMode = __esmMin((() => {}));
	//#endregion
	//#region ../page-controller/src/mask/SimulatorMask.module.css
	var wrapper, visible, SimulatorMask_module_default;
	var init_SimulatorMask_module = __esmMin((() => {
		wrapper = "_wrapper_1ooyb_1";
		visible = "_visible_1ooyb_11";
		SimulatorMask_module_default = {
			wrapper,
			visible
		};
	}));
	//#endregion
	//#region ../page-controller/src/mask/cursor.module.css
	var cursor, cursorBorder, cursorFilling, cursorRipple, clicking, cursor_module_default;
	var init_cursor_module = __esmMin((() => {
		cursor = "_cursor_a9twe_2";
		cursorBorder = "_cursorBorder_a9twe_10";
		cursorFilling = "_cursorFilling_a9twe_26";
		cursorRipple = "_cursorRipple_a9twe_40";
		clicking = "_clicking_a9twe_58";
		cursor_module_default = {
			cursor,
			cursorBorder,
			cursorFilling,
			cursorRipple,
			clicking,
			"cursor-ripple": "_cursor-ripple_a9twe_1"
		};
	}));
	//#endregion
	//#region ../page-controller/src/mask/SimulatorMask.ts
	var SimulatorMask_exports = /* @__PURE__ */ __exportAll({
		MASK_GLOW_COLORS: () => MASK_GLOW_COLORS,
		SimulatorMask: () => SimulatorMask
	});
	var MASK_GLOW_COLORS, SimulatorMask;
	var init_SimulatorMask = __esmMin((() => {
		init_Motion();
		init_checkDarkMode();
		init_SimulatorMask_module();
		init_cursor_module();
		MASK_GLOW_COLORS = [
			"rgb(218, 146, 83)",
			"rgb(232, 168, 115)",
			"rgb(245, 158, 11)",
			"rgb(201, 125, 67)"
		];
		SimulatorMask = class extends EventTarget {
			shown = false;
			wrapper = document.createElement("div");
			motion = null;
			#disposed = false;
			#cursor = document.createElement("div");
			#currentCursorX = 0;
			#currentCursorY = 0;
			#targetCursorX = 0;
			#targetCursorY = 0;
			constructor() {
				super();
				this.wrapper.id = "waifu-agent-runtime_simulator-mask";
				this.wrapper.className = SimulatorMask_module_default.wrapper;
				this.wrapper.setAttribute("data-browser-use-ignore", "true");
				this.wrapper.setAttribute("data-waifu-agent-ignore", "true");
				try {
					const motion = new Motion({
						mode: isPageDark() ? "dark" : "light",
						colors: MASK_GLOW_COLORS,
						styles: {
							position: "absolute",
							inset: "0"
						}
					});
					this.motion = motion;
					this.wrapper.appendChild(motion.element);
					motion.autoResize(this.wrapper);
				} catch (e) {
					console.warn("[SimulatorMask] Motion overlay unavailable:", e);
				}
				this.wrapper.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("mousedown", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("mouseup", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("mousemove", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("wheel", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("keydown", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.wrapper.addEventListener("keyup", (e) => {
					e.stopPropagation();
					e.preventDefault();
				});
				this.#createCursor();
				document.body.appendChild(this.wrapper);
				this.#moveCursorToTarget();
				const movePointerToListener = (event) => {
					const { x, y } = event.detail;
					this.setCursorPosition(x, y);
				};
				const clickPointerListener = () => {
					this.triggerClickAnimation();
				};
				const enablePassThroughListener = () => {
					this.wrapper.style.pointerEvents = "none";
				};
				const disablePassThroughListener = () => {
					this.wrapper.style.pointerEvents = "auto";
				};
				window.addEventListener("WaifuAgent::MovePointerTo", movePointerToListener);
				window.addEventListener("WaifuAgent::ClickPointer", clickPointerListener);
				window.addEventListener("WaifuAgent::EnablePassThrough", enablePassThroughListener);
				window.addEventListener("WaifuAgent::DisablePassThrough", disablePassThroughListener);
				this.addEventListener("dispose", () => {
					window.removeEventListener("WaifuAgent::MovePointerTo", movePointerToListener);
					window.removeEventListener("WaifuAgent::ClickPointer", clickPointerListener);
					window.removeEventListener("WaifuAgent::EnablePassThrough", enablePassThroughListener);
					window.removeEventListener("WaifuAgent::DisablePassThrough", disablePassThroughListener);
				});
			}
			#createCursor() {
				this.#cursor.className = cursor_module_default.cursor;
				const rippleContainer = document.createElement("div");
				rippleContainer.className = cursor_module_default.cursorRipple;
				this.#cursor.appendChild(rippleContainer);
				const fillingLayer = document.createElement("div");
				fillingLayer.className = cursor_module_default.cursorFilling;
				this.#cursor.appendChild(fillingLayer);
				const borderLayer = document.createElement("div");
				borderLayer.className = cursor_module_default.cursorBorder;
				this.#cursor.appendChild(borderLayer);
				this.wrapper.appendChild(this.#cursor);
			}
			#moveCursorToTarget() {
				if (this.#disposed) return;
				const newX = this.#currentCursorX + (this.#targetCursorX - this.#currentCursorX) * .2;
				const newY = this.#currentCursorY + (this.#targetCursorY - this.#currentCursorY) * .2;
				const xDistance = Math.abs(newX - this.#targetCursorX);
				if (xDistance > 0) {
					if (xDistance < 2) this.#currentCursorX = this.#targetCursorX;
					else this.#currentCursorX = newX;
					this.#cursor.style.left = `${this.#currentCursorX}px`;
				}
				const yDistance = Math.abs(newY - this.#targetCursorY);
				if (yDistance > 0) {
					if (yDistance < 2) this.#currentCursorY = this.#targetCursorY;
					else this.#currentCursorY = newY;
					this.#cursor.style.top = `${this.#currentCursorY}px`;
				}
				requestAnimationFrame(() => this.#moveCursorToTarget());
			}
			setCursorPosition(x, y) {
				if (this.#disposed) return;
				this.#targetCursorX = x;
				this.#targetCursorY = y;
			}
			triggerClickAnimation() {
				if (this.#disposed) return;
				this.#cursor.classList.remove(cursor_module_default.clicking);
				this.#cursor.getBoundingClientRect();
				this.#cursor.classList.add(cursor_module_default.clicking);
			}
			show() {
				if (this.shown || this.#disposed) return;
				this.shown = true;
				this.motion?.start();
				this.motion?.fadeIn();
				this.wrapper.classList.add(SimulatorMask_module_default.visible);
				this.#currentCursorX = window.innerWidth / 2;
				this.#currentCursorY = window.innerHeight / 2;
				this.#targetCursorX = this.#currentCursorX;
				this.#targetCursorY = this.#currentCursorY;
				this.#cursor.style.left = `${this.#currentCursorX}px`;
				this.#cursor.style.top = `${this.#currentCursorY}px`;
			}
			hide() {
				if (!this.shown || this.#disposed) return;
				this.shown = false;
				this.motion?.fadeOut();
				this.motion?.pause();
				this.#cursor.classList.remove(cursor_module_default.clicking);
				setTimeout(() => {
					this.wrapper.classList.remove(SimulatorMask_module_default.visible);
				}, 800);
			}
			dispose() {
				this.#disposed = true;
				this.motion?.dispose();
				this.wrapper.remove();
				this.dispatchEvent(new Event("dispose"));
			}
		};
	}));
	//#endregion
	//#region ../page-controller/src/PageController.ts
	/**
	* Copyright (C) 2026 ZeroWeight AI
	* Copyright (C) 2025 Alibaba Group Holding Limited
	* All rights reserved.
	*
	* PageController - Manages DOM operations and element interactions.
	* Designed to be independent of LLM and can be tested in unit tests.
	* All public methods are async for potential remote calling support.
	*/
	/**
	* PageController manages DOM state and element interactions.
	* It provides async methods for all DOM operations, keeping state isolated.
	*
	* @lifecycle
	* - beforeUpdate: Emitted before the DOM tree is updated.
	* - afterUpdate: Emitted after the DOM tree is updated.
	*/
	var PageController = class extends EventTarget {
		config;
		/** Corresponds to eval_page in browser-use */
		flatTree = null;
		/**
		* All highlighted index-mapped interactive elements
		* Corresponds to DOMState.selector_map in browser-use
		*/
		selectorMap = /* @__PURE__ */ new Map();
		/** Index -> element text description mapping */
		elementTextMap = /* @__PURE__ */ new Map();
		/**
		* Simplified HTML for LLM consumption.
		* Corresponds to clickable_elements_to_string in browser-use
		*/
		simplifiedHTML = "<EMPTY>";
		/** last time the tree was updated */
		lastTimeUpdate = 0;
		/** Whether the tree has been indexed at least once */
		isIndexed = false;
		/** Visual mask overlay for blocking user interaction during automation */
		mask = null;
		maskReady = null;
		constructor(config = {}) {
			super();
			this.config = config;
			patchReact(this);
			if (config.enableMask) this.initMask();
		}
		/**
		* Initialize mask asynchronously (dynamic import to avoid CSS loading in Node)
		*/
		initMask() {
			if (this.maskReady !== null) return;
			this.maskReady = (async () => {
				const { SimulatorMask } = await Promise.resolve().then(() => (init_SimulatorMask(), SimulatorMask_exports));
				this.mask = new SimulatorMask();
			})();
		}
		/**
		* Get current page URL
		*/
		async getCurrentUrl() {
			return window.location.href;
		}
		/**
		* Get last tree update timestamp
		*/
		async getLastUpdateTime() {
			return this.lastTimeUpdate;
		}
		/**
		* Get structured browser state for LLM consumption.
		* Automatically calls updateTree() to refresh the DOM state.
		*/
		async getBrowserState() {
			const url = window.location.href;
			const title = document.title;
			const pi = getPageInfo();
			const viewportExpansion = resolveViewportExpansion(this.config.viewportExpansion);
			await this.updateTree();
			let content = this.simplifiedHTML;
			try {
				const ocr = await ocrAntiCopyCanvases();
				if (ocr) content = `${content}\n\n[Anti-copy canvas OCR]\n${ocr}`;
			} catch (error) {
				console.warn("[page] anti-copy OCR", error);
			}
			return {
				url,
				title,
				header: `${`Current Page: [${title}](${url})`}\n${`Page info: ${pi.viewport_width}x${pi.viewport_height}px viewport, ${pi.page_width}x${pi.page_height}px total page size, ${pi.pages_above.toFixed(1)} pages above, ${pi.pages_below.toFixed(1)} pages below, ${pi.total_pages.toFixed(1)} total pages, at ${(pi.current_page_position * 100).toFixed(0)}% of page`}\n\n${viewportExpansion === -1 ? "Interactive elements from top layer of the current page (full page):" : "Interactive elements from top layer of the current page inside the viewport:"}\n\n${pi.pixels_above > 4 && viewportExpansion !== -1 ? `... ${pi.pixels_above} pixels above (${pi.pages_above.toFixed(1)} pages) - scroll to see more ...` : "[Start of page]"}`,
				content,
				footer: pi.pixels_below > 4 && viewportExpansion !== -1 ? `... ${pi.pixels_below} pixels below (${pi.pages_below.toFixed(1)} pages) - scroll to see more ...` : "[End of page]"
			};
		}
		/**
		* Update DOM tree, returns simplified HTML for LLM.
		* This is the main method to refresh the page state.
		* Automatically bypasses mask during DOM extraction if enabled.
		*/
		async updateTree() {
			this.dispatchEvent(new Event("beforeUpdate"));
			this.lastTimeUpdate = Date.now();
			if (this.mask) this.mask.wrapper.style.pointerEvents = "none";
			cleanUpHighlights();
			const blacklist = [...this.config.interactiveBlacklist || [], ...Array.from(document.querySelectorAll("[data-waifu-agent-not-interactive]"))];
			this.flatTree = getFlatTree({
				...this.config,
				interactiveBlacklist: blacklist
			});
			this.simplifiedHTML = flatTreeToString(this.flatTree, this.config.includeAttributes, this.config.keepSemanticTags);
			this.selectorMap.clear();
			this.selectorMap = getSelectorMap(this.flatTree);
			this.elementTextMap.clear();
			this.elementTextMap = getElementTextMap(this.simplifiedHTML);
			this.isIndexed = true;
			if (this.mask) this.mask.wrapper.style.pointerEvents = "auto";
			this.dispatchEvent(new Event("afterUpdate"));
			return this.simplifiedHTML;
		}
		/**
		* Clean up all element highlights
		*/
		async cleanUpHighlights() {
			console.log("[PageController] cleanUpHighlights");
			cleanUpHighlights();
		}
		/**
		* Ensure the tree has been indexed before any index-based operation.
		* Throws if updateTree() hasn't been called yet.
		*/
		assertIndexed() {
			if (!this.isIndexed) throw new Error("DOM tree not indexed yet. Can not perform actions on elements.");
		}
		/**
		* Click element by index
		*/
		async clickElement(index) {
			try {
				this.assertIndexed();
				const element = getElementByIndex(this.selectorMap, index);
				const elemText = this.elementTextMap.get(index);
				const link = newTabLink(element);
				if (link && this.config.openLinksInSameTab) {
					await withLinkInSameTab(link, () => clickElement(element));
					return {
						success: true,
						message: `✅ Clicked element (${elemText ?? index}). The link opened in the current tab.`
					};
				}
				await clickElement(element);
				if (link) return {
					success: true,
					message: `✅ Clicked element (${elemText ?? index}). ⚠️ Link opened in a new tab.`
				};
				return {
					success: true,
					message: `✅ Clicked element (${elemText ?? index}).`
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to click element: ${error}`
				};
			}
		}
		/**
		* Input text into element by index
		*/
		async inputText(index, text) {
			try {
				this.assertIndexed();
				const element = getElementByIndex(this.selectorMap, index);
				const elemText = this.elementTextMap.get(index);
				await inputTextElement(element, text);
				return {
					success: true,
					message: `✅ Input text (${text}) into element (${elemText ?? index}).`
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to input text: ${error}`
				};
			}
		}
		/**
		* Press a key on the element at `index`, or on the focused element when no index is given.
		* Use Enter to submit (search boxes, comment boxes, chat inputs), Escape to close dialogs.
		*/
		async pressKey(key, index) {
			try {
				let target;
				let label = "the focused element";
				if (index !== void 0) {
					this.assertIndexed();
					target = getElementByIndex(this.selectorMap, index);
					label = this.elementTextMap.get(index) ?? String(index);
					if (!target.contains(document.activeElement)) target.focus();
				} else {
					const active = document.activeElement;
					target = active instanceof HTMLElement ? active : document.body;
				}
				const handled = await pressKeyElement(target, key);
				return {
					success: true,
					message: `✅ Pressed ${key === " " ? "Space" : key} on ${label}${handled ? " (the page handled it)" : ""}.`
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to press key: ${error}`
				};
			}
		}
		/**
		* Select dropdown option by index and option text
		*/
		async selectOption(index, optionText) {
			try {
				this.assertIndexed();
				const element = getElementByIndex(this.selectorMap, index);
				const elemText = this.elementTextMap.get(index);
				await selectOptionElement(element, optionText);
				return {
					success: true,
					message: `✅ Selected option (${optionText}) in element (${elemText ?? index}).`
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to select option: ${error}`
				};
			}
		}
		/**
		* Scroll vertically
		*/
		async scroll(options) {
			try {
				const { down, numPages, pixels, index } = options;
				this.assertIndexed();
				return {
					success: true,
					message: await scrollVertically((pixels ?? numPages * window.innerHeight) * (down ? 1 : -1), index !== void 0 ? getElementByIndex(this.selectorMap, index) : null)
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to scroll: ${error}`
				};
			}
		}
		/**
		* Scroll horizontally
		*/
		async scrollHorizontally(options) {
			try {
				const { right, pixels, index } = options;
				this.assertIndexed();
				return {
					success: true,
					message: await scrollHorizontally(pixels * (right ? 1 : -1), index !== void 0 ? getElementByIndex(this.selectorMap, index) : null)
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Failed to scroll horizontally: ${error}`
				};
			}
		}
		/**
		* Execute arbitrary JavaScript on the page.
		* The optional `signal` is exposed to the script scope so cooperative code
		* can abort promptly when the task is stopped.
		*/
		async executeJavascript(script, signal) {
			try {
				const asyncFunction = eval(`(async (signal) => { ${script} })`);
				const result = await asyncFunction(signal);
				return {
					success: true,
					message: `✅ Executed JavaScript. Result: ${result}`
				};
			} catch (error) {
				return {
					success: false,
					message: `❌ Error executing JavaScript: ${error}`
				};
			}
		}
		/**
		* Show the visual mask overlay.
		* Only works after mask is setup.
		*/
		async showMask() {
			await this.maskReady;
			this.mask?.show();
		}
		/**
		* Hide the visual mask overlay.
		* Only works after mask is setup.
		*/
		async hideMask() {
			await this.maskReady;
			this.mask?.hide();
		}
		/**
		* Dispose and clean up resources
		*/
		dispose() {
			cleanUpHighlights();
			this.flatTree = null;
			this.selectorMap.clear();
			this.elementTextMap.clear();
			this.simplifiedHTML = "<EMPTY>";
			this.isIndexed = false;
			this.mask?.dispose();
			this.mask = null;
		}
	};
	//#endregion
	//#region src/lib/extensionContext.ts
	/**
	* When the extension is reloaded or updated, content scripts already injected into open
	* tabs keep running but lose the extension: every `chrome.*` call then throws
	* "Extension context invalidated". Such a script must stop itself, cleanly and quietly.
	*/
	function isExtensionContextValid() {
		try {
			return !!chrome.runtime?.id;
		} catch {
			return false;
		}
	}
	/** Call `onInvalidated` once, as soon as this script has lost its extension */
	function onExtensionContextInvalidated(onInvalidated, intervalMs = 1e3) {
		const timer = window.setInterval(() => {
			if (isExtensionContextValid()) return;
			window.clearInterval(timer);
			onInvalidated();
		}, intervalMs);
	}
	//#endregion
	//#region src/character/config.ts
	var ZEROWEIGHT_ORIGIN = "http://127.0.0.1:8787";
	var ZEROWEIGHT_API = `${ZEROWEIGHT_ORIGIN}/api/v1`;
	/**
	* The agent's LLM and Jev run through ZeroWeight's metered proxies (API-Public
	* `/llm/*` and `/jev/*`, 1 API credit per call), authenticated by the ZeroWeight key.
	* They speak the OpenAI and Jev protocols, so the clients only need these URLs.
	*
	* The server chooses the model (its `LLM_MODEL`, which also picks the provider) and
	* applies that model's request patches itself. This name is a placeholder the server
	* replaces; it must match no model family, so `@waifu-agent/llms` adds no patch meant
	* for a different model.
	*/
	var ZEROWEIGHT_LLM_BASE_URL = `${ZEROWEIGHT_API}/llm`;
	var ZEROWEIGHT_JEV_URL = `${ZEROWEIGHT_API}/jev/systemone`;
	/**
	* The companion's own words (her replies, her memory) go to a route of their own,
	* API-Public's `/companion/*` (its `COMPANION_MODEL`), and the agent's steps to `/llm/*`
	* (`LLM_MODEL`). Both are forced tool calls, so the route is what lets the server run each
	* on its own model. Same OpenAI protocol and pricing.
	*/
	var ZEROWEIGHT_COMPANION_BASE_URL = `${ZEROWEIGHT_API}/companion`;
	/**
	* Image understanding (API-Public `/vision/*`, 1 API credit per call): the same OpenAI
	* protocol on a model that reads images (the server's `VISION_MODEL`). The character uses it
	* to look at a screenshot of the page.
	*/
	var ZEROWEIGHT_VISION_BASE_URL = `${ZEROWEIGHT_API}/vision`;
	/**
	* The avatar frame takes the ratio (width / height) of her video, which the renderer only
	* knows once she has loaded; until then it is this.
	*/
	var AVATAR_FALLBACK_RATIO = 132 / 168;
	/**
	* Taller than this (height / width) and she is a full-body anime character rather than a
	* chibi bust, so she is shown larger: 9:16 is 1.78, 3:4 is 1.33.
	*/
	var AVATAR_FULL_BODY_MIN_ASPECT = 1.5;
	/** Default frame heights, CSS px, at scale 1 */
	var AVATAR_DEFAULT_HEIGHT = 280;
	var AVATAR_FULL_BODY_DEFAULT_HEIGHT = 630;
	/** The user's resize, as a multiple of the default height (shared by every avatar) */
	var AVATAR_MIN_SCALE = .5;
	var AVATAR_MAX_SCALE = 720 / 280;
	/** The frame's height at scale 1 for an avatar of this ratio (width / height) */
	function avatarDefaultHeight(ratio) {
		return 1 / ratio >= 1.5 ? 630 : 280;
	}
	//#endregion
	//#region src/character/avatarState.ts
	/** A gesture the renderer never reports complete stops holding up the reply after this */
	var GESTURE_TIMEOUT_MS = 1e4;
	/** How often the renderer is checked against the desired state */
	var RECONCILE_MS = 200;
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
	//#region src/character/overlay/mountAvatar.ts
	/**
	* Getting the renderer onto the page, ported from the ZeroWeight extension.
	*
	* The renderer instantiates WASM, which a content script may or may not be allowed to do
	* depending on the page's CSP. So it probes and picks the strongest surface that works:
	*   1. direct: the canvas in our shadow root, renderer loaded into this content script;
	*   2. frame: `avatar-frame.html` (an extension page, so our CSP applies) in the shadow root.
	* The chosen surface is logged; if neither works that is reported, never silent.
	*
	* Either way her speaking/listening state is held next to the renderer and enforced by
	* `keepAvatarState` (see `../avatarState.ts`), not sent as one-off `play()` calls, and her
	* video's size is reported once the renderer knows it, so the overlay can take its shape.
	*
	* Loading can stall without an error (the renderer has no timeout of its own), so every wait
	* here is abortable: on abort the surface is torn down and the mount rejects with the
	* signal's reason. The caller decides how long to wait (see `overlay.ts`).
	*/
	var EMPTY_WASM = new Uint8Array([
		0,
		97,
		115,
		109,
		1,
		0,
		0,
		0
	]);
	var FRAME_TIMEOUT_MS = 4e3;
	/** The renderer ran but could not load this bundle: a frame would not help */
	var AvatarLoadError = class extends Error {
		constructor(message = "The avatar bundle could not be loaded") {
			super(message);
			this.name = "AvatarLoadError";
		}
	};
	function canCompileWasm() {
		try {
			new WebAssembly.Module(EMPTY_WASM);
			return true;
		} catch {
			return false;
		}
	}
	
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

	function pageBlocksLocalhostFetch() {
		try {
			const h = location.hostname;
			if (h === "127.0.0.1" || h === "localhost") return false;
			return location.protocol === "https:";
		} catch {
			return false;
		}
	}
async function mountAvatar(container, payload, callbacks, signal) {
	if (payload && payload.zw_local) return mountLocalAvatar(container, payload, callbacks, signal);
		signal.throwIfAborted();
		const preferFrame = pageBlocksLocalhostFetch();
		if (preferFrame) {
			const framed = await mountFramed(container, payload, callbacks, signal);
			if (framed) return framed;
		}
		if (canCompileWasm()) {
			const direct = await mountDirect(container, payload, callbacks, signal);
			if (direct) return direct;
		}
		if (!preferFrame) {
			const framed = await mountFramed(container, payload, callbacks, signal);
			if (framed) return framed;
		}
		throw new Error("This page blocks both WebAssembly and extension frames, so the avatar cannot render here.");
	}
	/**
	* Load actions on first use rather than all at init: each loaded action stays in WASM
	* memory, and she renders in whichever tab is active. `speaking` and the greeting are
	* needed at once, so they are preloaded.
	*/
	var RENDER_OPTIONS = {
		lazyActions: true,
		preloadActions: ["speaking", "wave_hand"]
	};
	/** Rejects with the signal's reason once it aborts; never settles otherwise */
	function untilAborted(signal) {
		const fail = (reject) => reject(signal.reason instanceof Error ? signal.reason : new Error(String(signal.reason)));
		return new Promise((_, reject) => {
			if (signal.aborted) fail(reject);
			else signal.addEventListener("abort", () => fail(reject), { once: true });
		});
	}
	async function mountDirect(container, payload, { onError, onDimensions }, signal) {
		const canvas = document.createElement("canvas");
		canvas.style.cssText = "width:100%;height:100%;display:block;background:transparent;";
		container.appendChild(canvas);
		let renderer = null;
		try {
			const url = chrome.runtime.getURL("/renderer.js");
			renderer = new (await (Promise.race([import(
				/* @vite-ignore */
				url
), untilAborted(signal)]))).ZeroWeightRenderer();
			renderer.on("error", (error) => onError(error?.message ?? String(error)));
			renderer.on("dimensions", onDimensions);
			await Promise.race([renderer.init(canvas, {
				payload,
				...RENDER_OPTIONS
			}), untilAborted(signal)]);
			signal.throwIfAborted();
			if (renderer.state === "error") throw new AvatarLoadError();
			const started = renderer;
			const keeper = keepAvatarState(started);
			greet(started, keeper);
			return {
				surface: "direct",
				setState: (state) => keeper.set(state),
				gesture: (action, options) => keeper.gesture(action, options),
				destroy: () => {
					keeper.dispose();
					try {
						started.destroy();
					} catch {}
					canvas.remove();
				}
			};
		} catch (error) {
			canvas.remove();
			try {
				renderer?.destroy();
			} catch {}
			if (signal.aborted) throw error;
			if (error instanceof AvatarLoadError) {
				console.warn("[avatar] bundle load failed in the page; trying an extension frame");
				return null;
			}
			console.warn("[avatar] rendering directly failed here, trying a frame:", error);
			return null;
		}
	}
	async function mountFramed(container, payload, { onError, onDimensions }, signal) {
		const frame = document.createElement("iframe");
		frame.src = chrome.runtime.getURL("/avatar-frame.html");
		frame.allow = "autoplay";
		frame.style.cssText = "width:100%;height:100%;border:0;display:block;background:transparent;color-scheme:light;";
		frame.setAttribute("allowtransparency", "true");
		container.appendChild(frame);
		let onReady;
		let ready;
		try {
			ready = await Promise.race([new Promise((resolve) => {
				const timer = setTimeout(() => resolve(false), FRAME_TIMEOUT_MS);
				onReady = (event) => {
					if (event.source !== frame.contentWindow || event.data?.type !== "avatar-frame/ready") return;
					clearTimeout(timer);
					resolve(true);
				};
				window.addEventListener("message", onReady);
			}), untilAborted(signal)]);
		} catch (error) {
			frame.remove();
			throw error;
		} finally {
			if (onReady) window.removeEventListener("message", onReady);
		}
		if (!ready) {
			frame.remove();
			return null;
		}
		const origin = new URL(frame.src).origin;
		let gestureSeq = 0;
		const post = (message) => frame.contentWindow?.postMessage(message, origin);
		const onFrameMessage = (event) => {
			if (event.source !== frame.contentWindow) return;
			if (event.data?.type === "avatar-frame/error") onError(String(event.data.message));
			if (event.data?.type === "avatar-frame/dimensions") onDimensions(Number(event.data.width), Number(event.data.height));
		};
		let onStart;
		const started = new Promise((resolve, reject) => {
			onStart = (event) => {
				if (event.source !== frame.contentWindow) return;
				const type = event.data?.type;
				if (type !== "avatar-frame/started" && type !== "avatar-frame/error") return;
				if (type === "avatar-frame/started") resolve();
				else reject(new AvatarLoadError(String(event.data.message)));
			};
			window.addEventListener("message", onStart);
		});
		window.addEventListener("message", onFrameMessage);
		post({
			type: "avatar-frame/init",
			payload
		});
		try {
			await Promise.race([started, untilAborted(signal)]);
		} catch (error) {
			window.removeEventListener("message", onFrameMessage);
			frame.remove();
			throw error;
		} finally {
			if (onStart) window.removeEventListener("message", onStart);
		}
		return {
			surface: "frame",
			setState: (state) => post({
				type: "avatar-frame/state",
				state
			}),
			gesture: (action, options) => new Promise((resolve) => {
				const id = ++gestureSeq;
				const finish = () => {
					window.removeEventListener("message", onDone);
					clearTimeout(timeout);
					resolve();
				};
				const onDone = (event) => {
					if (event.source !== frame.contentWindow) return;
					if (event.data?.type === "avatar-frame/gesture-done" && event.data.id === id) finish();
				};
				const timeout = setTimeout(finish, GESTURE_TIMEOUT_MS + 1e3);
				window.addEventListener("message", onDone);
				post({
					type: "avatar-frame/gesture",
					action,
					id,
					optional: options?.optional
				});
			}),
			destroy: () => {
				window.removeEventListener("message", onFrameMessage);
				frame.remove();
			}
		};
	}
	/** Say hello once the wave has loaded, as the platform does (not while she is speaking) */
	function greet(renderer, keeper) {
		renderer.on("actionLoaded", (id) => {
			if (id === "wave_hand") keeper.gesture("wave_hand");
		});
	}
	//#endregion
	//#region src/character/overlay/overlay.ts
	var DEFAULT_LAYOUT = {
		right: 20,
		bottom: 20,
		scale: 1
	};
	var MARGIN = 16;
	/** How long one attempt to load her may take before it counts as stalled */
	var LOAD_TIMEOUT_MS = 3e4;
	/** A stalled load usually works on a fresh start, as a page reload showed */
	var LOAD_ATTEMPTS = 2;
	/** Her load stalled on every attempt */
	var AvatarLoadTimeoutError = class extends Error {
		constructor(attempts) {
			super(`The avatar did not finish loading (${attempts} attempts of ${LOAD_TIMEOUT_MS / 1e3}s). Reload the page to try again.`);
			this.name = "AvatarLoadTimeoutError";
		}
	};
	/** Played when the user double-clicks her, if her avatar has it */
	var POKE_ACTION = "poke_reaction";
	var CSS = `
:host { all: initial; }
.shell {
	position: fixed; z-index: 2147483647;
	background: transparent;
	touch-action: none;
}
.stage {
	position: relative; width: 100%; height: 100%;
	cursor: grab; -webkit-user-select: none; user-select: none;
}
.stage.dragging { cursor: grabbing; }
.stage canvas, .stage iframe, .stage img { pointer-events: none; background: transparent; }
.stage.loading canvas, .stage.loading iframe { visibility: hidden; }
.loader {
	position: absolute; left: 50%; top: 50%; width: 56px; height: 56px;
	margin: -28px 0 0 -28px; border-radius: 50%; pointer-events: none;
	display: grid; place-items: center;
	background: rgba(24,16,28,.55);
	-webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
	box-shadow: 0 8px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.08);
	animation: loader-in .3s ease-out both;
}
.loader svg { width: 36px; height: 36px; overflow: visible; animation: loader-spin 1.4s linear infinite; }
.loader .track { fill: none; stroke: rgba(255,255,255,.12); stroke-width: 3.5; }
.loader .arc {
	fill: none; stroke: url(#waifu-loader-gradient); stroke-width: 3.5; stroke-linecap: round;
	stroke-dasharray: 1 100; stroke-dashoffset: 0;
	filter: drop-shadow(0 0 4px rgba(255,143,192,.6));
	animation: loader-dash 1.4s ease-in-out infinite;
}
@keyframes loader-in { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: none; } }
@keyframes loader-spin { to { transform: rotate(360deg); } }
@keyframes loader-dash {
	0% { stroke-dasharray: 1 100; stroke-dashoffset: 0; }
	50% { stroke-dasharray: 60 100; stroke-dashoffset: -12; }
	100% { stroke-dasharray: 60 100; stroke-dashoffset: -87; }
}
.resize, .close {
	position: absolute; top: -2px; width: 18px; height: 18px;
	opacity: 0; transition: opacity .15s ease;
}
.resize { left: -2px; cursor: nwse-resize; }
.resize::after {
	content: ""; position: absolute; left: 4px; top: 4px; width: 9px; height: 9px;
	border-left: 2px solid rgba(232,168,115,.95); border-top: 2px solid rgba(232,168,115,.95);
	border-radius: 2px 0 0 0; filter: drop-shadow(0 1px 2px rgba(0,0,0,.8));
}
.close { right: -2px; cursor: pointer; }
.close::before, .close::after {
	content: ""; position: absolute; left: 3px; top: 8px; width: 12px; height: 2px;
	background: rgba(232,168,115,.95); border-radius: 1px;
	filter: drop-shadow(0 1px 2px rgba(0,0,0,.8));
}
.close::before { transform: rotate(45deg); }
.close::after { transform: rotate(-45deg); }
.shell:hover .resize, .shell:hover .close { opacity: .9; }
.close:hover { opacity: 1 !important; }
.poke-hit {
	position: absolute; width: 0; height: 0; pointer-events: none; z-index: 1;
}
.poke-hit > * { position: absolute; pointer-events: none; }
.poke-hit .burst {
	left: -34px; top: -34px; width: 68px; height: 68px; overflow: visible;
	animation: poke-burst .42s cubic-bezier(.2,1.6,.4,1) forwards;
}
.poke-hit .lines {
	left: -60px; top: -60px; width: 120px; height: 120px; overflow: visible;
	animation: poke-lines .38s ease-out forwards;
}
.poke-hit .star {
	left: -7px; top: -7px; width: 14px; height: 14px; overflow: visible;
	animation: poke-star .55s ease-out forwards;
}
.poke-hit .sfx {
	left: 10px; top: -46px; white-space: nowrap;
	font: 900 italic 20px/1 "Hiragino Maru Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
	color: #fff; letter-spacing: -1px;
	-webkit-text-stroke: 4px #2b1a2e; paint-order: stroke fill;
	text-shadow: 2px 2px 0 #ff6fa8;
	animation: poke-sfx .7s cubic-bezier(.2,1.4,.4,1) forwards;
}
@keyframes poke-burst {
	0% { transform: scale(.2) rotate(-20deg); opacity: 1; }
	45% { transform: scale(1.1) rotate(0deg); opacity: 1; }
	100% { transform: scale(1.25) rotate(8deg); opacity: 0; }
}
@keyframes poke-lines {
	0% { transform: scale(.4); opacity: 0; }
	30% { opacity: 1; }
	100% { transform: scale(1.15); opacity: 0; }
}
@keyframes poke-star {
	0% { transform: translate(0, 0) scale(.3) rotate(0deg); opacity: 1; }
	100% { transform: translate(var(--dx), var(--dy)) scale(1) rotate(180deg); opacity: 0; }
}
@keyframes poke-sfx {
	0% { transform: translateY(8px) scale(.4) rotate(-12deg); opacity: 0; }
	30% { transform: translateY(0) scale(1.15) rotate(-8deg); opacity: 1; }
	75% { transform: translateY(-4px) scale(1) rotate(-8deg); opacity: 1; }
	100% { transform: translateY(-10px) scale(1) rotate(-8deg); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
	.poke-hit .lines, .poke-hit .star { display: none; }
	.poke-hit .burst, .poke-hit .sfx { animation-duration: .5s; animation-timing-function: linear; }
	.loader .arc { animation: none; stroke-dasharray: 25 100; }
	.loader svg { animation-duration: 2.4s; }
}
`;
	var SVG_NS = "http://www.w3.org/2000/svg";
	/** Manga onomatopoeia for a light tap; one is picked per poke */
	var POKE_SFX = [
		"ぽこっ!",
		"ぺしっ!",
		"つん!"
	];
	/**
	* An anime-style impact at the point she was poked: a spiky starburst, speed lines, a few
	* sparkles and a sound effect. Purely visual; it removes itself when the burst finishes.
	*/
	function pokeEffect(stage, x, y) {
		const hit = div("poke-hit");
		hit.style.left = `${x}px`;
		hit.style.top = `${y}px`;
		const burst = svg("svg", {
			class: "burst",
			viewBox: "-34 -34 68 68"
		});
		const spikes = 12;
		const points = Array.from({ length: 24 }, (_, i) => {
			const angle = Math.PI * i / spikes;
			const radius = i % 2 === 0 ? 28 + Math.random() * 5 : 13 + Math.random() * 3;
			return `${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius).toFixed(1)}`;
		}).join(" ");
		burst.append(svg("polygon", {
			points,
			fill: "#fff6a8",
			stroke: "#2b1a2e",
			"stroke-width": "3",
			"stroke-linejoin": "round"
		}), svg("circle", {
			r: "9",
			fill: "#fff"
		}));
		const lines = svg("svg", {
			class: "lines",
			viewBox: "-60 -60 120 120"
		});
		for (let i = 0; i < 14; i++) {
			const angle = Math.PI * 2 * i / 14 + Math.random() * .2;
			const inner = 36 + Math.random() * 6;
			const outer = 52 + Math.random() * 8;
			const spread = .05;
			const at = (r, a) => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
			lines.append(svg("polygon", {
				points: `${at(inner, angle)} ${at(outer, angle - spread)} ${at(outer, angle + spread)}`,
				fill: "#2b1a2e"
			}));
		}
		hit.append(lines, burst);
		for (let i = 0; i < 4; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = 40 + Math.random() * 20;
			const star = svg("svg", {
				class: "star",
				viewBox: "-7 -7 14 14"
			});
			star.style.setProperty("--dx", `${Math.round(Math.cos(angle) * distance)}px`);
			star.style.setProperty("--dy", `${Math.round(Math.sin(angle) * distance)}px`);
			star.append(svg("path", {
				d: "M0,-7 L1.6,-1.6 7,0 1.6,1.6 0,7 -1.6,1.6 -7,0 -1.6,-1.6 Z",
				fill: i % 2 === 0 ? "#ff8fc0" : "#ffe066",
				stroke: "#2b1a2e",
				"stroke-width": "1"
			}));
			hit.append(star);
		}
		const sfx = div("sfx");
		sfx.textContent = POKE_SFX[Math.floor(Math.random() * POKE_SFX.length)];
		hit.append(sfx);
		stage.append(hit);
		sfx.addEventListener("animationend", () => hit.remove(), { once: true });
		setTimeout(() => hit.remove(), 1500);
	}
	/** An indeterminate ring: the renderer reports no overall progress while she loads */
	function loadingRing() {
		const loader = div("loader");
		loader.setAttribute("role", "progressbar");
		loader.setAttribute("aria-label", "Loading avatar");
		const ring = svg("svg", { viewBox: "0 0 36 36" });
		const defs = svg("defs", {});
		const gradient = svg("linearGradient", {
			id: "waifu-loader-gradient",
			x1: "0",
			y1: "0",
			x2: "1",
			y2: "1"
		});
		gradient.append(svg("stop", {
			offset: "0%",
			"stop-color": "#ffd1a6"
		}), svg("stop", {
			offset: "55%",
			"stop-color": "#e8a873"
		}), svg("stop", {
			offset: "100%",
			"stop-color": "#ff8fc0"
		}));
		defs.append(gradient);
		ring.append(defs, svg("circle", {
			class: "track",
			cx: "18",
			cy: "18",
			r: "16"
		}), svg("circle", {
			class: "arc",
			cx: "18",
			cy: "18",
			r: "16",
			pathLength: "100"
		}));
		loader.append(ring);
		return loader;
	}
	function svg(tag, attrs) {
		const node = document.createElementNS(SVG_NS, tag);
		for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
		return node;
	}
	async function mountOverlay(payload, layout, onLayoutChange, onExpired, onFailed, onClose, signal) {
		const host = document.createElement("div");
		host.setAttribute("data-waifu-agent-ignore", "true");
		host.setAttribute("data-waifu-agent-avatar", "");
		const root = host.attachShadow({ mode: "closed" });
		const style = document.createElement("style");
		style.textContent = CSS;
		const shell = div("shell");
		const stage = div("stage loading");
		const loader = loadingRing();
		const resize = div("resize");
		resize.title = "Drag to resize";
		const close = div("close");
		close.title = "Hide avatar";
		close.setAttribute("role", "button");
		close.setAttribute("aria-label", "Hide avatar");
		stage.append(loader, resize, close);
		shell.append(stage);
		root.append(style, shell);
		document.documentElement.appendChild(host);
		let current = { ...layout };
		/** Her video's width / height, once the renderer knows it */
		let ratio = AVATAR_FALLBACK_RATIO;
		/** The frame for a scale, fitted to the viewport (without changing the user's scale) */
		const size = (scale = current.scale) => {
			const base = avatarDefaultHeight(ratio);
			const height = clamp(base * scale, base * AVATAR_MIN_SCALE, Math.min(base * AVATAR_MAX_SCALE, innerHeight - 8));
			return {
				width: Math.round(height * ratio),
				height
			};
		};
		const apply = () => {
			const { width, height } = size();
			current = {
				...current,
				right: clamp(current.right, 0, Math.max(0, innerWidth - width)),
				bottom: clamp(current.bottom, 0, Math.max(0, innerHeight - height))
			};
			Object.assign(shell.style, {
				height: `${height}px`,
				width: `${width}px`,
				right: `${current.right}px`,
				bottom: `${current.bottom}px`,
				left: "auto",
				top: "auto"
			});
		};
		const commit = () => onLayoutChange({ ...current });
		apply();
		const onWindowResize = () => apply();
		window.addEventListener("resize", onWindowResize);
		const passThrough = () => host.style.pointerEvents = "none";
		const solid = () => host.style.pointerEvents = "";
		window.addEventListener("WaifuAgent::EnablePassThrough", passThrough);
		window.addEventListener("WaifuAgent::DisablePassThrough", solid);
		{
			let startX = 0;
			let startY = 0;
			let origin = current;
			let dragging = false;
			stage.addEventListener("dblclick", (e) => {
				if (e.target === resize || e.target === close) return;
				const box = stage.getBoundingClientRect();
				pokeEffect(stage, e.clientX - box.left, e.clientY - box.top);
				avatar?.gesture(POKE_ACTION, { optional: true });
			});
			stage.addEventListener("pointerdown", (e) => {
				if (e.button !== 0 || e.target === resize || e.target === close) return;
				dragging = true;
				stage.setPointerCapture(e.pointerId);
				stage.classList.add("dragging");
				startX = e.clientX;
				startY = e.clientY;
				origin = { ...current };
			});
			stage.addEventListener("pointermove", (e) => {
				if (!dragging) return;
				current = {
					...current,
					right: origin.right - (e.clientX - startX),
					bottom: origin.bottom - (e.clientY - startY)
				};
				apply();
			});
			const end = (e) => {
				if (!dragging) return;
				dragging = false;
				stage.classList.remove("dragging");
				if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
				commit();
			};
			stage.addEventListener("pointerup", end);
			stage.addEventListener("pointercancel", end);
		}
		{
			let startY = 0;
			let startHeight = 0;
			let sizing = false;
			resize.addEventListener("pointerdown", (e) => {
				e.stopPropagation();
				sizing = true;
				resize.setPointerCapture(e.pointerId);
				startY = e.clientY;
				startHeight = size().height;
			});
			resize.addEventListener("pointermove", (e) => {
				if (!sizing) return;
				e.stopPropagation();
				const base = avatarDefaultHeight(ratio);
				const scale = size((startHeight + (startY - e.clientY)) / base).height / base;
				current = {
					...current,
					scale
				};
				apply();
			});
			const finish = (e) => {
				if (!sizing) return;
				sizing = false;
				if (resize.hasPointerCapture(e.pointerId)) resize.releasePointerCapture(e.pointerId);
				commit();
			};
			resize.addEventListener("pointerup", finish);
			resize.addEventListener("pointercancel", finish);
		}
		close.addEventListener("pointerdown", (e) => e.stopPropagation());
		close.addEventListener("click", (e) => {
			e.stopPropagation();
			onClose();
		});
		let avatar = null;
		let removed = false;
		const teardown = () => {
			if (removed) return;
			removed = true;
			window.removeEventListener("resize", onWindowResize);
			window.removeEventListener("WaifuAgent::EnablePassThrough", passThrough);
			window.removeEventListener("WaifuAgent::DisablePassThrough", solid);
			avatar?.destroy();
			host.remove();
		};
		let mounted = false;
		let failure = null;
		const onRenderError = (message) => {
			if (/expired/i.test(message)) {
				console.warn("[avatar] payload expired; asking for a fresh one:", message);
				onExpired(message);
				return;
			}
			console.error("[avatar] could not render:", message);
			if (failure || removed) return;
			failure = message;
			if (!mounted) return;
			teardown();
			onFailed(message);
		};
		const onDimensions = (width, height) => {
			if (!(width > 0 && height > 0)) {
				console.warn(`[avatar] ignoring invalid video size ${width}x${height}`);
				return;
			}
			console.info(`[avatar] video ${width}x${height}`);
			ratio = width / height;
			if (!removed) apply();
		};
		try {
			for (let attempt = 1; !avatar; attempt++) {
				const timeout = new AbortController();
				const timer = setTimeout(() => timeout.abort(/* @__PURE__ */ new Error(`Loading stalled for ${LOAD_TIMEOUT_MS / 1e3}s`)), LOAD_TIMEOUT_MS);
				const attemptSignal = AbortSignal.any([signal, timeout.signal]);
				let abandoned = false;
				const live = (fn) => (...args) => {
					if (!abandoned) fn(...args);
				};
				try {
					avatar = await mountAvatar(stage, payload, {
						onError: live(onRenderError),
						onDimensions: live(onDimensions)
					}, attemptSignal);
				} catch (error) {
					abandoned = true;
					if (signal.aborted || !timeout.signal.aborted) throw error;
					if (attempt >= LOAD_ATTEMPTS) throw new AvatarLoadTimeoutError(attempt);
					console.warn(`[avatar] loading stalled for ${LOAD_TIMEOUT_MS / 1e3}s; starting over (attempt ${attempt + 1} of ${LOAD_ATTEMPTS})`);
				} finally {
					clearTimeout(timer);
				}
			}
			console.info(`[avatar] surface: ${avatar.surface}`);
		} catch (error) {
			teardown();
			throw error;
		}
		if (failure) {
			teardown();
			throw new Error(failure);
		}
		mounted = true;
		loader.remove();
		stage.classList.remove("loading");
		const rect = () => {
			const r = shell.getBoundingClientRect();
			return {
				left: Math.round(r.left),
				top: Math.round(r.top),
				width: Math.round(r.width),
				height: Math.round(r.height),
				viewportWidth: viewport().width,
				viewportHeight: viewport().height
			};
		};
		return {
			setState: (state) => avatar?.setState(state),
			gesture: (action) => avatar?.gesture(action) ?? Promise.resolve(),
			moveTo(position) {
				const vp = viewport();
				const { width, height } = size();
				const farRight = vp.width - width - MARGIN;
				const farBottom = vp.height - height - MARGIN;
				const middle = Math.round((vp.height - height) / 2);
				const [right, bottom] = {
					"bottom-right": [MARGIN, MARGIN],
					"bottom-left": [farRight, MARGIN],
					"top-right": [MARGIN, farBottom],
					"top-left": [farRight, farBottom],
					"middle-right": [MARGIN, middle],
					"middle-left": [farRight, middle]
				}[position];
				current = {
					...current,
					right,
					bottom
				};
				apply();
				commit();
				return rect();
			},
			rect,
			destroy: teardown
		};
	}
	/** The layout viewport, excluding scrollbars (what `position: fixed` offsets measure against) */
	function viewport() {
		const root = document.documentElement;
		return {
			width: root.clientWidth || innerWidth,
			height: root.clientHeight || innerHeight
		};
	}
	function div(className) {
		const node = document.createElement("div");
		node.className = className;
		return node;
	}
	function clamp(value, min, max) {
		return Math.round(Math.max(min, Math.min(max, value)));
	}
	//#endregion
	//#region src/character/overlay/content.ts
	/**
	* Content-script side of the avatar. The side panel owns the character (bundle, persona,
	* speech); this only shows her on the page and plays what it is told.
	*/
	var LAYOUT_KEY = "avatarLayout";
	var overlay = null;
	var mounting = null;
	/** Aborts `mounting`: hiding her mid-load takes the loading ring off the page at once */
	var mountController = null;
	/** Bumped by `hide`, so a mount that finishes after it is discarded */
	var generation = 0;
	/** The latest state the side panel asked for, applied to her as soon as she is mounted */
	var desiredState = "listening";
	function notifyPanel(event) {
		if (!isExtensionContextValid()) return;
		chrome.runtime.sendMessage(event).catch(() => {});
	}
	async function show(payload, replace = false) {
		if (replace) hide();
		if (mounting && mountController?.signal.aborted) await mounting.catch(() => {});
		if (overlay || mounting) return;
		const mine = ++generation;
		const controller = new AbortController();
		mountController = controller;
		mounting = mountWith(payload, mine, controller.signal);
		try {
			const mounted = await mounting;
			if (mine === generation) {
				overlay = mounted;
				overlay.setState(desiredState);
			} else mounted.destroy();
		} finally {
			if (mountController === controller) {
				mounting = null;
				mountController = null;
			}
		}
	}
	async function mountWith(payload, mine, signal) {
		const stored = (await chrome.storage.local.get(LAYOUT_KEY))[LAYOUT_KEY];
		return mountOverlay(payload, {
			...DEFAULT_LAYOUT,
			...migrateLayout(stored)
		}, saveLayout, (message) => notifyPanel({
			type: "AVATAR_EVENT",
			event: "expired",
			message
		}), (message) => {
			if (mine === generation) overlay = null;
			notifyPanel({
				type: "AVATAR_EVENT",
				event: "failed",
				message
			});
		}, () => {
			hide();
			notifyPanel({
				type: "AVATAR_EVENT",
				event: "closed"
			});
		}, signal);
	}
	function hide() {
		generation++;
		mountController?.abort(/* @__PURE__ */ new Error("The avatar was hidden while loading"));
		overlay?.destroy();
		overlay = null;
	}
	function migrateLayout(stored) {
		if (!stored) return {};
		const { height, ...layout } = stored;
		if (layout.scale === void 0 && typeof height === "number" && height > 0) layout.scale = height / 280;
		return layout;
	}
	/** Saves the layout; quietly skipped once the extension has been reloaded */
	function saveLayout(layout) {
		if (!isExtensionContextValid()) return;
		chrome.storage.local.set({ [LAYOUT_KEY]: layout }).catch(() => {});
	}
	/** @returns `retire`: take her off the page (the extension that owned her is gone) */
	function initAvatarOverlay() {
		chrome.runtime.onConnect.addListener((port) => {
			if (port.name !== "avatar-keepalive") return;
			port.onDisconnect.addListener(hide);
		});
		chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
			if (message?.type !== "AVATAR") return;
			switch (message.action) {
				case "show":
					show(message.payload, message.replace).then(() => sendResponse({ ok: true }), (error) => sendResponse({
						ok: false,
						error: error instanceof Error ? error.message : String(error)
					}));
					return true;
				case "hide":
					hide();
					sendResponse({ ok: true });
					return;
				case "state":
					desiredState = message.state;
					overlay?.setState(message.state);
					sendResponse({ ok: !!overlay });
					return;
				case "gesture":
					if (!overlay) {
						sendResponse({ ok: false });
						return;
					}
					overlay.gesture(message.name).then(() => sendResponse({ ok: true }));
					return true;
				case "move":
					sendResponse(overlay ? {
						ok: true,
						rect: overlay.moveTo(message.position)
					} : { ok: false });
					return;
				case "rect":
					sendResponse({
						ok: !!overlay,
						rect: overlay?.rect()
					});
					return;
			}
		});
		return hide;
	}
	/**
	* What the agent is told about the avatar each step, so it can move her when she covers
	* something it needs. Empty when she is not on this page.
	*/
	function avatarNote() {
		if (!overlay) return "";
		const r = overlay.rect();
		return `Your avatar is shown on this page near the ${(r.top + r.height / 2 < r.viewportHeight / 2 ? "top" : "bottom") + "-" + (r.left + r.width / 2 < r.viewportWidth / 2 ? "left" : "right")} (x=${r.left}, y=${r.top}, ${r.width}x${r.height}px of a ${r.viewportWidth}x${r.viewportHeight}px viewport). It floats above the page and hides whatever is under it from the element list. If it covers something you need, call move_avatar.`;
	}
	//#endregion
	//#region src/lib/viewportMedia.ts
	/**
	* Runs in the content script. Counts the pictures and videos the user can see right now,
	* which the page's text does not describe: when there are any, the character looks at a
	* screenshot as well as reading the page.
	*/
	/** Smaller than this (CSS px, each side) is an icon, avatar or logo, not something to look at */
	var MIN_SIDE = 120;
	function countViewportMedia(doc = document) {
		const viewportWidth = doc.defaultView?.innerWidth ?? 0;
		const viewportHeight = doc.defaultView?.innerHeight ?? 0;
		let count = 0;
		for (const element of doc.querySelectorAll("img, video, canvas, picture, svg")) {
			if (element.tagName === "IMG" && element.parentElement?.tagName === "PICTURE") continue;
			const rect = element.getBoundingClientRect();
			const width = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
			const height = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
			if (width >= MIN_SIDE && height >= MIN_SIDE) count++;
		}
		return count;
	}
	//#endregion
	//#region src/agent/RemotePageController.content.ts
	/**
	* content script for RemotePageController
	*/
	/** @returns `retire`: stop polling and remove everything this script put on the page */
	function initPageController() {
		let pageController = null;
		let intervalID = null;
		const myTabIdPromise = chrome.runtime.sendMessage({
			type: "PAGE_CONTROL",
			action: "get_my_tab_id"
		}).then((response) => {
			return response.tabId;
		}).catch((error) => {
			console.error("[RemotePageController.ContentScript]: Failed to get my tab id", error);
			return null;
		});
		function getPC() {
			if (!pageController) pageController = new PageController({
				enableMask: false,
				viewportExpansion: 400,
				openLinksInSameTab: true
			});
			return pageController;
		}
		const retire = () => {
			if (intervalID !== null) window.clearInterval(intervalID);
			intervalID = null;
			pageController?.dispose();
			pageController = null;
		};
		intervalID = window.setInterval(async () => {
			if (!isExtensionContextValid()) return retire();
			try {
				await syncMask();
			} catch (error) {
				if (!isExtensionContextValid()) return retire();
				console.error("[RemotePageController.ContentScript] mask sync failed:", error);
			}
		}, 500);
		async function syncMask() {
			const agentHeartbeat = (await chrome.storage.local.get("agentHeartbeat")).agentHeartbeat;
			const agentInTouch = typeof agentHeartbeat === "number" && Date.now() - agentHeartbeat < 2e3;
			const isAgentRunning = (await chrome.storage.local.get("isAgentRunning")).isAgentRunning;
			const currentTabId = (await chrome.storage.local.get("currentTabId")).currentTabId;
			if (isAgentRunning && agentInTouch && currentTabId === await myTabIdPromise) {
				const pc = getPC();
				pc.initMask();
				await pc.showMask();
			} else if (pageController) {
				pageController.hideMask();
				pageController.cleanUpHighlights();
			}
			if (!isAgentRunning && agentInTouch) {
				if (pageController) {
					pageController.dispose();
					pageController = null;
				}
			}
		}
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.type !== "PAGE_CONTROL") return;
			const { action, payload } = message;
			if (action === "count_viewport_media") {
				sendResponse({ count: countViewportMedia() });
				return;
			}
			const methodName = getMethodName(action);
			const pc = getPC();
			switch (action) {
				case "get_last_update_time":
				case "get_browser_state":
				case "update_tree":
				case "clean_up_highlights":
				case "click_element":
				case "input_text":
				case "select_option":
				case "press_key":
				case "scroll":
				case "scroll_horizontally":
				case "execute_javascript":
					pc[methodName](...payload || []).then((result) => {
						const note = action === "get_browser_state" ? avatarNote() : "";
						sendResponse(note ? {
							...result,
							header: `${result.header}\n\n${note}`
						} : result);
					}).catch((error) => sendResponse({
						success: false,
						error: error instanceof Error ? error.message : String(error)
					}));
					break;
				default: sendResponse({
					success: false,
					error: `Unknown PAGE_CONTROL action: ${action}`
				});
			}
			return true;
		});
		return retire;
	}
	function getMethodName(action) {
		switch (action) {
			case "get_last_update_time": return "getLastUpdateTime";
			case "get_browser_state": return "getBrowserState";
			case "update_tree": return "updateTree";
			case "clean_up_highlights": return "cleanUpHighlights";
			case "click_element": return "clickElement";
			case "input_text": return "inputText";
			case "select_option": return "selectOption";
			case "press_key": return "pressKey";
			case "scroll": return "scroll";
			case "scroll_horizontally": return "scrollHorizontally";
			case "execute_javascript": return "executeJavascript";
			default: return action;
		}
	}
	//#endregion
	//#region src/entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["<all_urls>"],
		runAt: "document_end",
		main() {
			console.debug(`[Content] Loaded on ${window.location.href}`);
			const retirePageController = initPageController();
			const retireAvatar = initAvatarOverlay();
			onExtensionContextInvalidated(() => {
				retirePageController();
				retireAvatar();
				console.info("[Content] Waifu Agent was reloaded; reload this page to reconnect it.");
			});
		}
	});
	//#endregion
	//#region ../../node_modules/wxt/dist/utils/internal/logger.mjs
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => ([...args], void 0),
		log: (...args) => ([...args], void 0),
		warn: (...args) => ([...args], void 0),
		error: (...args) => ([...args], void 0)
	};
	//#endregion
	//#region ../../node_modules/@wxt-dev/browser/src/index.mjs
	var browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = browser$1;
	//#endregion
	//#region ../../node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region ../../node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region ../../node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-plugins
	function initPlugins() {}
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?/Users/minhanh29/Desktop/Workspace/ZeroWeight/FE/zw-waifu-agent/packages/extension/src/entrypoints/content.ts
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => ([...args], void 0),
		log: (...args) => ([...args], void 0),
		warn: (...args) => ([...args], void 0),
		error: (...args) => ([...args], void 0)
	};
	var result = (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
	//#endregion
	return result;
})();
