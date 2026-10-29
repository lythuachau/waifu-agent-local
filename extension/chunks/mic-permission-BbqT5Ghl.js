import "./_virtual_wxt-html-plugins-BsPm7yBB.js";
//#region src/entrypoints/mic-permission/main.ts
/**
* Grants the extension microphone access. The side panel cannot show Chrome's permission
* prompt, but once the extension origin is allowed here, the side panel can use the mic.
*/
var status = document.getElementById("status");
var button = document.getElementById("allow");
button.addEventListener("click", async () => {
	try {
		(await navigator.mediaDevices.getUserMedia({ audio: true })).getTracks().forEach((track) => track.stop());
		status.textContent = "Done. You can close this tab and use voice input in the side panel.";
		status.className = "ok";
		button.hidden = true;
		setTimeout(() => window.close(), 1500);
	} catch (error) {
		status.textContent = `Microphone access was not granted (${error.name}). You can allow it from the site settings icon in the address bar, then try again.`;
		status.className = "error";
	}
});
//#endregion
