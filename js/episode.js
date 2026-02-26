import { extrasData, episodeData } from "./episodeList.js";
import { getMetadataKey } from "./misc.js";

const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const ratingOn = false;
const extrasContainer = document.querySelector(".extras__container");
const episodeContainer = document.querySelector(".episode__container");


const TYPE_MAP = {
  tr: { data: extrasData, name: "trailer", letter: "TR" },
  ms: { data: extrasData, name: "minisode", letter: "MS" },
  ws: { data: extrasData, name: "webisode", letter: "WS" },
  mv: { data: extrasData, name: "minimovie", letter: "MV" },  
  ep: { data: episodeData, name: "episode", letter: "EP" },  
};

const urlParams = new URLSearchParams(location.search);

let activeTypeKey = "ep";

for (const key in TYPE_MAP) {
  if (urlParams.has(TYPE_MAP[key].name)) {
    activeTypeKey = key;
    break;
  }
}

const activeType = TYPE_MAP[activeTypeKey];
const data = activeType.data;
const rawIndex = parseInt(urlParams.get(activeType.name));

const typeData = activeType.data.filter(ep => ep.type === activeType.name);
const episodeIndex = typeData.findIndex(ep => ep.number === rawIndex);

if (episodeIndex === -1) {
    window.location.href = "episode.html?episode=1";
}
 
export const ep = typeData[episodeIndex];

document.body.insertAdjacentHTML("beforeend", `
    <div id="mainImageWrapper" class="main-episode__image-wrapper">
        <img class="main-episode__image" src="assets/episode-images/${ep.thumbnail}" fetchpriority="high" />
    </div>   
    <main class="global-margin">
        <div class="main-episode__container">
            <div class="main-episode__number">${capitalizeFirstLetter(activeType.name)} ${ep.number}</div>            
            <h1 class="main-episode__title">${ep.title}</h1>
			<div class="main-episode__button-wrapper mb-2">
			    <button id="playButton" class="primary-button"><svg class="svg-icon"><use href="#icon-play"></use></svg>Play</button>
			    <!--<a id="downloadButton" class="primary-button round ${getMetadataKey(ep.scheme_metadata, 'download') ?? 'hidden'}" 
			       href="${ encodeURI(`https://archive.org/download/knighton-media-nk/${getMetadataKey(ep.scheme_metadata, 'download') || ''}?token=${crypto.randomUUID()}&sess=${btoa(crypto.randomUUID())}` )}"
			       target="_blank" 
			       rel="noopener noreferrer"><svg class="svg-icon"><use href="#icon-download"></use></svg>
			    </a>-->
			</div>
            
            <div class="main-episode__meta-wrapper">
                <h3 class="main-episode__description">${ep.description}</h3>
                <div class="main-episode__meta">
                    ${ep.metadata}
                    <span class="main-episode__metatag bg ${ep.video_data[0].includes('1080p') ? '' : 'hidden'}">FHD</span>
                    <span class="main-episode__metatag bg ${ep.video_data[0].includes('720p') ? '' : 'hidden'}">HD</span>
                    <span class="main-episode__metatag no-bg ${ep.video_data[2].includes('English') ? '' : 'hidden'}">CC</span>
                </div>      
            </div>      
        </div>       
        <div class="line-divider"></div>

        <div style="display: ${ep.rating ?? 'none'}">
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
            <div class="info__description">${ep.video_data[0]}</div>            
            <div class="info__title">Audio</div>
            <div class="info__description">${ep.video_data[1] === 'default' ? 'English, Ukranian, German, Romanian' : 
                                             ep.video_data[1] === 'non-default' ? 'English, Ukranian, German' : ep.video_data[1]}</div>
            <!--<div class="info__title">Subtitles (CC)</div>
            <div class="info__description">${ep.video_data[2]}</div>-->
            <div class="info__title">Capture Time</div>
            <div class="info__description">${ep.capture_time}</div>
            <div class="info__title">Publisher</div>
            <div class="info__description">PandaMine5</div>
        </div>
        <div class="line-divider"></div>
        <div class="episode__container"></div>
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
    <script type="application/ld+json">
		{
		  "@context": "https://schema.org",
		  "@type": "VideoObject",
		  "name": "${capitalizeFirstLetter(activeType.name)} ${ep.number} - \"${ep.title}\" | Knighton Media",
		  "description": "Watch Nexo Knights: ${capitalizeFirstLetter(activeType.name)} ${ep.number} - \"${ep.title}\" on Knighton Media.",
		  "thumbnailUrl": ["https://pandamine5.github.io/knighton-media/assets/episode-images/${ep.thumbnail}"],
		  "uploadDate": "2026-03-01T00:00:00+00:00",
		  "duration": "${getMetadataKey(ep.scheme_metadata, "duration")}",
		  "contentUrl": "https://archive.org/download/knighton-media-nk/${getMetadataKey(ep.scheme_metadata, "download")}",
		  "embedUrl": "https://pandamine5.github.io/knighton-media/episode.html?${activeType.name}=${rawIndex}",
		  "publisher": {
		    "@type": "Person",
		    "name": "PandaMine5",
		    "url": "https://avatars.githubusercontent.com/u/176819316"
		  }
		}
	</script>
`);

const renderEpisodes = (data) => {
    let container = document.querySelector(".episode__container");
   
    const episodeHTML = data
        .filter(item => !(item.number === ep.number && item.type === ep.type))
        .map((ep) => {
            let ratingValue = ep.rating;
            let ratingClass;

            if (ratingValue >= 8.0) {
                ratingClass = "excellent";
            } else {
                ratingClass = "average";
            }
            
            return (`
	            <article class="episode__item" data-${ep.type}="${ep.number}">
	                <div class="episode__image-wrapper">
	                    <a href="${ep.link || '404.html'}">
	                        <img class="episode__image"
	                             src="assets/episode-images/${ep.thumbnail}" 
	                             al="Nexo Knights Episode ${ep.number} - ${ep.title} | Knighton Media" 
	                             loading="lazy">
	                    </a>       
	                    <div class="episode__rating ${ratingClass}" style="display: ${ratingValue ?? 'none'}">
	                        <svg class="svg-icon"><use href="#icon-star"></use></svg> ${ratingValue}
	                    </div>
	                </div>
	                <div class="episode__info">
	                    <div class="episode__number">${(ep.type).toUpperCase()} ${ep.number}</div>
	                    <div class="episode__title">${ep.title}</div>
	                    <div class="episode__description">${ep.description}</div>
	                    <div class="episode__metadata">${ep.metadata}</div>
	                </div>
	            </article>
           `);
        });

    container.innerHTML = episodeHTML.join("");
};

renderEpisodes(data);
document.title = `${activeType.letter}${ep.number} - \"${ep.title}\" | Knighton Media`;


// Scroll episode item to right by 1, scroll to left if it's last episode
requestAnimationFrame(() => {
  const container = document.querySelector(".episode__container");
  
  const currentIndexInFullData = data.findIndex(item => 
    item.number === ep.number && item.type === ep.type
  );
    
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