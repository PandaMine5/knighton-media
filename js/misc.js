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
	const gl = document.createElement("canvas").getContext("webgl");
	const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
	const gpuName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown";
	const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	const c = await checkCodecs();

	return JSON.stringify({
		display:`Site: ${document.location.href}@${Math.round(screen.width * window.devicePixelRatio)}:${Math.round(screen.height * window.devicePixelRatio)}@${screen.colorDepth}@${window.devicePixelRatio}@${screen.width}:${screen.height}@${window.innerWidth}:${window.innerHeight}@${"ontouchstart" in window}`,
		device: `Browser:${navigator.userAgent},${navigator.languages}@${navigator.platform}@${navigator.vendor ?? "?"}@${window.matchMedia("(prefers-color-scheme: dark)").matches}@${navigator?.deviceMemory ?? "?"}GB@${gpuName}@(${navigator.hardwareConcurrency}C)`,
		server: `Report Time:${new Date()}@VS ${Intl.DateTimeFormat().resolvedOptions().timeZone}@Ref ${document.referrer ?? "?"}@AuT-${localStorage.getItem("selectedAudioTrack") ?? "?"}@VQ-${localStorage.getItem("selectedQuality") ?? "?"}@Cont-${connection?.type ?? "?"} ${connection?.effectiveType ?? "?"}@Contsp ${(connection?.downlink / 8).toFixed(2) ?? "?"}MB@Rt ${connection?.rtt ?? "?"}@: ${navigator.cookieEnabled}`,
		codecs: `H264:Sup: ${c.H264?.supported ?? "?"}@Fast: ${c.H264?.smooth ?? "?"}@HW: ${c.H264?.powerEfficient ?? "?"} ` + 
                `HEVC:Sup: ${c.HEVC?.supported ?? "?"}@Fast: ${c.HEVC?.smooth ?? "?"}@HW: ${c.HEVC?.powerEfficient ?? "?"} ` + 
                `VP09:Sup: ${c.VP09?.supported ?? "?"}@Fast: ${c.VP09?.smooth ?? "?"}@HW: ${c.VP09?.powerEfficient ?? "?"} ` + 
                `AV01:Sup: ${c.AV01?.supported ?? "?"}@Fast: ${c.AV01?.smooth ?? "?"}@HW: ${c.AV01?.powerEfficient ?? "?"} ` + 
                `AAC_LC:Sup: ${c.AAC_LC?.supported ?? "?"}@Fast: ${c.AAC_LC?.smooth ?? "?"}@HW: ${c.AAC_LC?.powerEfficient ?? "?"} ` + 
                `AAC_HE:Sup: ${c.AAC_HE?.supported ?? "?"}@Fast: ${c.AAC_HE?.smooth ?? "?"}@HW: ${c.AAC_HE?.powerEfficient ?? "?"} ` + 
                `AAC_HE3:Sup: ${c.AAC_HE3?.supported ?? "?"}@Fast: ${c.AAC_HE3?.smooth ?? "?"}@HW: ${c.AAC_HE3?.powerEfficient ?? "?"} ` + 
                `OPUS:Sup: ${c.OPUS?.supported ?? "?"}@Fast: ${c.OPUS?.smooth ?? "?"}@HW: ${c.OPUS?.powerEfficient ?? "?"}`
	});
}

export { getID, getSelector, getMetadataKey, capitalizeFirstLetter, formatType };
export { encodeText, decodeText, checkCodecs, generateReport };
