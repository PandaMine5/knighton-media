import { extrasData, episodeData } from "./episodeList.js";
import { encodeText, generateReport, getMetadataKey, capitalizeFirstLetter, formatType } from "./misc.js";

const extrasContainer = document.querySelector(".extras__container");
const episodeContainer = document.querySelector(".episode__container");

const TYPE_MAP = {
	tr: { data: extrasData, name: "trailer", letter: "TR" },
	ms: { data: extrasData, name: "minisode", letter: "MS" },
	ws: { data: extrasData, name: "webisode", letter: "WS" },
	mv: { data: extrasData, name: "minimovie", letter: "MV" },
	rm: { data: extrasData, name: "rookie_mission", letter: "RM" },	
	ep: { data: episodeData, name: "episode", letter: "EP" }
};

const urlParams = new URLSearchParams(location.search);

let activeTypeKey = "ep";

for (const key in TYPE_MAP) {
	if (urlParams.has(TYPE_MAP[key].name)) {
		activeTypeKey = key;
		break;
	}
}

export const activeType = TYPE_MAP[activeTypeKey];
const data = activeType.data;
export const rawIndex = parseInt(urlParams.get(activeType.name));

const typeData = activeType.data.filter(ep => ep.type === activeType.name);
const episodeIndex = typeData.findIndex(ep => ep.number === rawIndex);

if (episodeIndex === -1) {
	window.location.href = "episode.html?episode=1";
}

export const ep = typeData[episodeIndex];

function getAirdate() {
	const datePart = ep.metadata.split("·")[1].trim();
	const [monthStr, dayWithComma, year] = datePart.split(" ");

	const day = dayWithComma.replace(",", "");
	const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(monthStr) + 1;

	let today = new Date();
	let airdate = new Date(`${year}-${month}-${day}`);

	return Math.trunc((today.setHours(0, 0, 0, 0) - airdate) / (1000 * 60 * 60 * 24));
}

/*
fetch("https://archive.org/download/knighton-media-nk/W02%20-%20Jestro%20the%20Bad%E2%80%A6%20the%20Really%2C%20Really%20Bad.mp4", { 
 	method: "HEAD"
})
.then(res => {
 	const sizeBytes = res.headers.get("Content-Length");
 	const sizeMB = (Number(sizeBytes) / (1024 * 1024)).toFixed(2);

 	console.log(`${sizeMB} MB`);
});*/


const downloadFile = ep.scheme_metadata && ep.mp4_link && !ep.m3u8_link
        ? ep.mp4_link
        : getMetadataKey(ep.scheme_metadata, "download");

document.title = `${activeType.letter}${ep.number} - \"${ep.title}\" | Knighton Media`;
document.body.insertAdjacentHTML(
	"beforeend",
	`
    <div id="mainImageWrapper" class="main-episode__image-wrapper">
        <img class="main-episode__image" src="assets/episode-images/${ep.thumbnail}" fetchpriority="high" />
    </div>   
    <main class="global-margin">
        <div class="main-episode__container">
            <div class="main-episode__number">${formatType(activeType.name)} ${ep.number}</div> 
            <h1 class="main-episode__title">${ep.title}</h1>
			<div class="main-episode__button-wrapper">
			    <button id="playButton" class="primary-button"><svg class="svg-icon"><use href="#icon-play"></use></svg>Play</button>
			    <a id="downloadButton" class="primary-button round ${getMetadataKey(ep.scheme_metadata, "download") ?? "hidden"}" 
			       href="${encodeURI(`https://archive.org/download/knighton-media-nk/${downloadFile}?token=${btoa(crypto.randomUUID())} `)}"
			       target="_blank" 
			       rel="noreferrer"><svg class="svg-icon"><use href="#icon-download"></use></svg>                 
			    </a>
			</div>
            
            <div class="main-episode__meta-wrapper">
                <h3 class="main-episode__description">${ep.description}</h3>
                <div class="main-episode__meta">
                    ${ep.metadata}
                    <span class="main-episode__metatag bg ${ep.video_data[0].includes("1080p") ? "" : "hidden"}">FHD</span>
                    <span class="main-episode__metatag bg ${ep.video_data[0].includes("720p") || ep.video_data[0].includes("default") ? "" : "hidden"}">HD</span>
                    <span class="main-episode__metatag no-bg ${ep.video_data[2].includes("default") ? "" : "hidden"}">SDH</span>
                </div>      
            </div>      
        </div>       
        <div class="line-divider"></div>
        <div style="display: ${ep.rating ?? "none"}">
	        <div class="text-header margin-small">Rating</div>
	        <div class="rating__container">
	            <div class="rating__value">${ep.rating}</div>
	            <div class="rating__max">out 10.0</div>
	        </div>
	        <div class="line-divider"></div>
        </div>
        
        <div class="text-header">Information</div>
        <div class="info__container">
            <div class="info__title">Quality</div>
            <div class="info__description">${ep.video_data[0] === "default" ? "360p, 480p, 720p Low, 720p HD" : ep.video_data[0]}</div>            
            <div class="info__title">Audio</div>
            <div class="info__description">${ep.video_data[1] === "default" ? "English, Ukrainian, German, Romanian, Polish" : 
                                             ep.video_data[1] === "non-default" ? "English, Ukrainian, German, Polish" : ep.video_data[1]}</div>
            <div class="info__title">Subtitles (SDH)</div>
            <div class="info__description">${ep.video_data[2] === "default" ? "English, Ukrainian, German, Romanian, Polish" : ep.video_data[2]}</div>
            <div class="info__title">Video Filters</div>
            <div class="info__description">Default, Desaturated, Vibrant, Filmic, HDR</div>
            <div class="info__title">Timecode</div>
            <div class="info__description">${ep.timecode}</div>
            <div class="info__title">Air date</div>
            <div class="info__description">${getAirdate()} Days ago</div>       
            <div class="info__title">Publisher</div>
            <div class="info__description">PandaMine5</div>
        </div>        
        <div class="line-divider"></div>
        <div class="shelf__scroll-wrapper no-global-margin">
            <button class="shelf__scroll-button left" data-target=".episode__container">
                <svg class="svg-icon"><use href="#icon-chevron-left-long"></use></svg>
            </button>
            <div class="episode__container"></div>
            <button class="shelf__scroll-button right" data-target=".episode__container">
                <svg class="svg-icon" style="transform: scaleX(-1);"><use href="#icon-chevron-left-long"></use></svg>
            </button>
        </div>
        <div class="line-divider"></div>
        <div class="text-header">Report</div>
        <div class="about__carousel-container" id="report-log">
            <div class="about__description-box">
                <div class="about__title">Report Log</div>
                <div>If Knighton Media glitches or Video/Audio</span> doesn't work, copy & send me the report below. <a class="highlight--blue" href="legal.html#contact">Contact</a></div> 
                <div class="about__log-wrapper notranslate" translate="no"> 
                  <button class="about__log-copy-button" id="copyButton"><svg class="svg-icon highlight--blue"><use href="#icon-copy"></use></svg></button>
                  <div class="about__log" id="reportLog"></div>
                </div>
                <div>Which information is included: <a class="highlight--blue" href="legal.html">Read More</a></div>
            </div>
        </div>
    </main>
    
    <footer class="footer__info global-margin">
        <div class="line-divider"></div>       
        <div class="footer__links">
            <a class="footer__icon" onclick="navigator.clipboard.writeText('pandamine5x');"><svg class="svg-icon"><use href="#icon-discord"></use></svg></a>            
            <a class="footer__icon" href="https://github.com/pandamine5" target="_blank"><svg class="svg-icon"><use href="#icon-github"></use></svg></a>
            <a class="footer__icon" href="https://www.curseforge.com/members/pandamine5/projects" target="_blank"><svg class="svg-icon"><use href="#icon-curseforge"></use></svg></a>
        </div> 
        <div class="footer__links">
            <a class="footer__text" href="index.html#">Home</a>
            <a class="footer__text" href="legal.html#">Terms & Legal</a>            
            <a class="footer__text" href="legal.html#contact">Contact</a>            
        </div>
        <div class="footer__text">© 2025-2026 Knighton Media. By PandaMine5</div>
    </footer>
`);

const renderEpisodes = data => {
	let container = document.querySelector(".episode__container");

	const episodeHTML = data
		.filter(item => !(item.number === ep.number && item.type === ep.type))
		.map(ep => {
			let ratingValue = ep.rating;
			let ratingClass;
			const hours = new Date().getHours();
			const threeAmFilter = hours >= 3 && hours < 5;

			if (ratingValue >= 8.1) {
				ratingClass = "excellent";
			} else {
				ratingClass = "average";
			}

			if (threeAmFilter === true) {
				document.documentElement.setAttribute("dir", "rtl");
			}

			return `
	            <article class="episode__item" data-${ep.type}="${ep.number}">
	                <div class="episode__image-wrapper">
	                    <a class="episode__link" href="${ep.link}">	
				     	   <img class="episode__image ${threeAmFilter === true ? "three-am-filter" : ""}"
				                src="assets/episode-images/${ep.thumbnail}"
				                alt='Nexo Knights ${formatType(ep.type)} ${ep.number} - "${ep.title}" | Knighton Media'
				                decoding="async"
				                loading="lazy">
	                    </a>       
	                    <div class="episode__rating ${ratingClass}" style="display: ${ratingValue ?? "none"}">
	                        <svg class="svg-icon"><use href="#icon-star"></use></svg> ${ratingValue ?? ""}
	                    </div>
	                </div>
	                <div class="episode__info">
	                    <div class="episode__number">${formatType(ep.type).toUpperCase()} ${ep.number}</div>
	                    <div class="episode__title">${ep.title}</div>
	                    <div class="episode__description">${ep.description}</div>
	                    <div class="episode__metadata">${ep.metadata}</div>
	                </div>
	            </article>
           `;
		});

	container.innerHTML = episodeHTML.join("");
};
renderEpisodes(data);


// This scrolls episode to right by 1, scroll to left if it's last episode
requestAnimationFrame(() => {
	const container = document.querySelector(".episode__container");

	const currentIndexInFullData = data.findIndex(item => item.number === ep.number && item.type === ep.type);

	let targetIndexInFullData = currentIndexInFullData + 1;

	if (targetIndexInFullData >= data.length) {
		container.scrollLeft = container.scrollWidth;
		return;
	}

	const targetEpisode = data[targetIndexInFullData];
	const target = container.querySelector(`[data-${targetEpisode.type}="${targetEpisode.number}"]`);

	if (target) container.scrollLeft = target.offsetLeft;
});

const description = document.querySelector(".main-episode__description");
let isDescExpanded = false;
description.addEventListener("click", () => {
	description.style.webkitLineClamp = isDescExpanded ? "2" : "unset";
	isDescExpanded = !isDescExpanded;
});

const reportLog = document.getElementById("reportLog");
const copyButton = document.getElementById("copyButton");

// Report Log
const userData = await generateReport();
reportLog.textContent = userData;

copyButton.addEventListener("click", () => {
	navigator.clipboard.writeText(`Generated Report: ${userData} \n\nEncrypted: ${encodeText(userData)}`);
	const useElement = copyButton.querySelector("use");
	useElement?.setAttribute("href", "#icon-tick");
	setTimeout(() => useElement?.setAttribute("href", "#icon-copy"), 2_000);
});

// Shelf scroll buttons
document.querySelectorAll(".shelf__scroll-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const container = document.querySelector(btn.dataset.target);

        const scrollSize = container.clientWidth;
        const direction = btn.classList.contains("left") ? -1 : 1;

        container.scrollBy({ left: scrollSize * direction, behavior: "smooth" });
    });
});