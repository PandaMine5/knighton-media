import { episodeData, trailerData, minisodeData, webisodeData } from "./episodeList.js";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


const ratingOn = false;

const TYPE_MAP = {
  tr: { data: trailerData, name: "trailer", param: "trailer" },
  ms: { data: minisodeData, name: "minisode", param: "minisode" },
  ws: { data: webisodeData, name: "webisode", param: "webisode" },
  ep: { data: episodeData, name: "episode", param: "episode" },  
};

const params = new URLSearchParams(location.search);

let activeTypeKey = "ep";

for (const key in TYPE_MAP) {
  if (params.has(TYPE_MAP[key].param)) {
    activeTypeKey = key;
    break;
  }
}

const activeType = TYPE_MAP[activeTypeKey];
const data = activeType.data;
const rawIndex = parseInt(params.get(activeType.param), 10);

const episodeIndex = isNaN(rawIndex) || rawIndex < 1 ? 1 : Math.min(rawIndex, data.length);
export const ep = data[episodeIndex - 1];

const pageHTML = `

    `;
document.body.insertAdjacentHTML("beforeend", `
    <div id="mainImageWrapper" class="main-episode__image-wrapper">
        <img class="main-episode__image" src="assets/episode-images/${ratingOn ? 'no-spoilers' : ''}/${ep.thumbnail}" fetchpriority="high" />
    </div>
    <div class="global-margin">
        <div class="main-episode__container">
            <div class="main-episode__number">${capitalizeFirstLetter(activeType.name)} ${ep.number}</div>            
            <h1 class="main-episode__title">${ep.title}</h1>
            <button id="watchButton" class="main-episode__watch-button white">Watch<svg class="svg-icon"><use href="#icon-play"></use></svg></button>          
            <h3 class="main-episode__description">${ep.description}</h3>
            <div class="main-episode__meta">
                ${ep.metadata}
                <span class="main-episode__metatag bg ${ep.video_data[0].includes('1080p') ? '' : 'hidden'}">FHD</span>
                <span class="main-episode__metatag bg ${ep.video_data[0].includes('720p') ? '' : 'hidden'}">HD</span>
                <span class="main-episode__metatag no-bg ${ep.video_data[2].includes('English') ? '' : 'hidden'}">CC</span>
            </div>
        </div>
<!--        <div class="line-divider"></div>
        <div style="display: ${ep.rating ?? 'none'}">
	        <div class="text-header">Rating</div>
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
            <div class="info__description">${ep.video_data[1] === 'default' ? 'English, Ukranian, Finnish, Dutch' : ep.video_data[1]}</div>

            <div class="info__title">Subtitles (CC)</div>
            <div class="info__description">${ep.video_data[2]}</div>

            <div class="info__title">Capture Time</div>
            <div class="info__description">${
                  String(ep.capture_time).split(';')[0] ?? ep.capture_time}
            </div>

            <div class="info__title">Publisher</div>
            <div class="info__description">PandaMine5</div>
        </div>-->
        <div class="line-divider"></div>
        <div class="episode__container"></div>
        <div class="line-divider"></div>
        <footer class="footer__links">
            <a class="footer__text" href="index.html">Homepage</a>
            <a class="footer__text" href="#">Contact</a>
        </footer>
        <footer class="copyright-text">© 2025 Knighton Media. All Rights Reserved.<br>Made By PandaMine5</footer>
    </div>
`);    

const renderEpisodes = (data) => {
    let container = document.querySelector(".episode__container");
   
    const episodeHTML = data
        .filter((_, i) => i !== episodeIndex - 1)
        .map((ep) => {
            let ratingValue = ep.rating;
            let ratingClass;

            if (ratingValue >= 8.1) {
                ratingClass = "excellent";
            } else {
                ratingClass = "average";
            }
            
            return (`
	            <article class="episode__item">
	                <div class="episode__image-wrapper">
	                    <a href="${ep.link}">
	                        <img class="episode__image"
	                             src="assets/episode-images/${ratingOn ? 'no-spoilers' : ''}/${ep.thumbnail}" 
	                             al="Nexo Knights Episode ${ep.number} - ${ep.title} | Knighton Media" 
	                             loading="lazy">
	                    </a>       
	                    <div class="episode__rating ${ratingClass}" style="display: ${ratingValue ?? 'none'}">
	                        <svg class="svg-icon"><use href="#icon-star"></use></svg> ${ratingValue}
	                    </div>
	                </div>
	                <div class="episode__info">
	                    <div class="episode__number">EPISODE ${ep.number}</div>
	                    <div class="episode__title">${ep.title}</div>
	                    <div class="episode__description">${ep.description}</div>
	                    <div class="episode__metadata">${ep.metadata}</div>
	                </div>
	            </article>
           `);
        });

    container.innerHTML = episodeHTML.join("");
};

document.title = `E${ep.number} - ${ep.title} | Knighton Media`;


const container = document.querySelector(".episode__container");
renderEpisodes(data);



requestAnimationFrame(() => {
  const container = document.querySelector(".episode__container");
  const scrollIndex = episodeIndex === episodeData.length
        ? episodeIndex - 2
        : episodeIndex - 1;
  const target = container.children[scrollIndex];
  if (target) container.scrollLeft = target.offsetLeft;
});


const description = document.querySelector(".main-episode__description");
let isDescExpanded = false;
description.addEventListener("click", () => {
    description.style.webkitLineClamp = isDescExpanded ? "2" : "unset";
    isDescExpanded = !isDescExpanded;
});