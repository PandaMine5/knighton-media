import { WebHaptics } from "./lib/web-haptics.js";
import { episodeData } from "./episodeList.js";

const haptics = new WebHaptics();

document.querySelectorAll("button, a").forEach(element => {
	element.addEventListener("click", () => {
		haptics.trigger("medium");
	});
});

const getID = document.getElementById.bind(document);
const getSelector = document.querySelector.bind(document);

// Block IFrames
if (window.top !== window.self) {
	window.top.location.replace(window.self.location.href);
}

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatType(str) {
	return str.split("_").map(capitalizeFirstLetter).join(" ");
}

function getMetadataKey(str, key) {
	if (!str || typeof str !== "string") {
		return null;
	}

	const obj = Object.fromEntries(
		str.split("|").map(p => {
			const [k, ...rest] = p.split("=");
			return [k, decodeURIComponent(rest.join("="))];
		})
	);

	return key ? obj[key] : obj;
}

function encodeText(input) {
	const bytes = new TextEncoder().encode(input);
	let text = "";
	for (const b of bytes) {
		text += String.fromCharCode(b);
	}
	const reversed = btoa(text).replace("==", "").split("").reverse().join("");
	return btoa(reversed).replace("==", "");
}

function decodeText(input) {
	const unreversed = atob(input).split("").reverse().join("");
	const padded = unreversed + "=".repeat((4 - (unreversed.length % 4)) % 4);
	const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

async function checkCodecs() {
	if (!("mediaCapabilities" in navigator)) return {};

	const videoTests = {
		H264: 'video/mp4; codecs="avc1.640028"',
		HEVC: 'video/mp4; codecs="hvc1.1.6.L93.90"',
		VP09: 'video/webm; codecs="vp09.00.10.08"',
		AV01: 'video/mp4; codecs="av01.0.05M.08"'
	};
	const audioTests = {
		AAC_LC: 'audio/mp4; codecs="mp4a.40.2"',
		AAC_HE: 'audio/mp4; codecs="mp4a.40.29"',
		AAC_HE3: 'audio/mp4; codecs="mp4a.40.42"',
		OPUS: 'audio/webm; codecs="opus"'
	};

	const results = {};
	const videoPromises = Object.entries(videoTests).map(async ([name, type]) => {
		const r = await navigator.mediaCapabilities.decodingInfo({
			type: "file",
			video: { contentType: type, width: 1920, height: 1080, bitrate: 5_800_000, framerate: 60 }
		});
		results[name] = { supported: r.supported, smooth: r.smooth, powerEfficient: r.powerEfficient };
	});

	const audioPromises = Object.entries(audioTests).map(async ([name, type]) => {
		const r = await navigator.mediaCapabilities.decodingInfo({
			type: "file",
			audio: { contentType: type, channels: 2, bitrate: 256_000, samplerate: 48000 }
		});
		results[name] = { supported: r.supported, smooth: r.smooth, powerEfficient: r.powerEfficient };
	});

	await Promise.all([...videoPromises, ...audioPromises]);
	return results;
}

async function generateReport() {
	if (!localStorage.getItem("userID")) {
		localStorage.setItem("userID", crypto.randomUUID());
	}

	const gl = document.createElement("canvas").getContext("webgl");
	const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
	const gpuName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown";
	const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	const c = await checkCodecs();

	return JSON.stringify({
		report_id: localStorage.getItem("userID"),
		display: `Screen pixels: ${Math.round(screen.width * window.devicePixelRatio)}x${Math.round(screen.height * window.devicePixelRatio)} (${screen.colorDepth} bit) (${window.devicePixelRatio}px Ratio) | ` + `CSS pixels: ${screen.width}x${screen.height} | ` + `Viewport pixels: ${window.innerWidth}x${window.innerHeight} | ` + `Touch Screen: ${"ontouchstart" in window}`,
		device_characteristics: `Browser: ${navigator.userAgent},${navigator.languages} | ` + `Platform: ${navigator.platform}, ${navigator.vendor ?? "?"} | ` + `Dark UI: ${window.matchMedia("(prefers-color-scheme: dark)").matches} | ` + `RAM: ${navigator?.deviceMemory ?? "?"} GB | ` + `GPU: ${gpuName} (${navigator.hardwareConcurrency} Cores)`,
		server_characteristics: `Report Time: ${new Date()} | Video Serving Server: ${Intl.DateTimeFormat().resolvedOptions().timeZone} | Referrer: ${document.referrer ?? "?"}, Audio Track: ${localStorage.getItem("selectedAudioTrack") ?? "?"}, Quality: ${localStorage.getItem("selectedQuality") ?? "?"} | ` + `Connection: ${connection?.type ?? "?"} ${connection?.effectiveType ?? "?"} | ` + `Video Load Speed: ${(connection?.downlink / 8).toFixed(2) ?? "?"} MB | ` + `RTT: ${connection?.rtt ?? "?"} Ms | ` + `Local Storage Allowed: ${navigator.cookieEnabled}`,
		codecs: `H264: Supported: ${c.H264?.supported ?? "?"}, Smooth: ${c.H264?.smooth ?? "?"}, Hardware Decoding: ${c.H264?.powerEfficient ?? "?"} | ` + `HEVC: Supported: ${c.HEVC?.supported ?? "?"}, Smooth: ${c.HEVC?.smooth ?? "?"}, Hardware Decoding: ${c.HEVC?.powerEfficient ?? "?"} | ` + `VP09: Supported: ${c.VP09?.supported ?? "?"}, Smooth: ${c.VP09?.smooth ?? "?"}, Hardware Decoding: ${c.VP09?.powerEfficient ?? "?"} | ` + `AV01: Supported: ${c.AV01?.supported ?? "?"}, Smooth: ${c.AV01?.smooth ?? "?"}, Hardware Decoding: ${c.AV01?.powerEfficient ?? "?"} | ` + `AAC-LC: Supported: ${c.AAC_LC?.supported ?? "?"}, Smooth: ${c.AAC_LC?.smooth ?? "?"}, Hardware Decoding: ${c.AAC_LC?.powerEfficient ?? "?"} | ` + `AAC-HE: Supported: ${c.AAC_HE?.supported ?? "?"}, Smooth: ${c.AAC_HE?.smooth ?? "?"}, Hardware Decoding: ${c.AAC_HE?.powerEfficient ?? "?"} | ` + `AAC-HE3: Supported: ${c.AAC_HE3?.supported ?? "?"}, Smooth: ${c.AAC_HE3?.smooth ?? "?"}, Hardware Decoding: ${c.AAC_HE3?.powerEfficient ?? "?"} | ` + `OPUS: Supported: ${c.OPUS?.supported ?? "?"}, Smooth: ${c.OPUS?.smooth ?? "?"}, Hardware Decoding: ${c.OPUS?.powerEfficient ?? "?"}`,
		source: `© 2025-2026 Knighton Media. By PandaMine5. Page: ${document.location.href}. UUID: ${crypto.randomUUID()}`
	});
}

export { getID, getSelector, getMetadataKey, capitalizeFirstLetter, formatType };
export { encodeText, decodeText, checkCodecs, generateReport };
