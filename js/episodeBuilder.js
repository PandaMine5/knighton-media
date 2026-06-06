import { extrasData, episodeData } from "./episodeList.js";
import { characterData } from "./characterList.js";
import { capitalizeFirstLetter, formatType } from "./misc.js";

const extrasContainer = document.querySelector(".extras__container");
const episodeContainer = document.querySelector(".episode__container");
const characterContainer = document.querySelector(".character__container");

export const renderEpisodes = (data, container) => {
	const episodeHTML = data.map(ep => {
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
                    <div class="episode__number highlight--blue">${formatType(ep.type).toUpperCase()} ${ep.number}</div>
                    <div class="episode__title">${ep.title}</div>
                    <div class="episode__description">${ep.description ?? ""}</div>
                    <div class="episode__metadata">${ep.metadata}</div>
                </div>
            </article>
        `;
	});

	container.innerHTML = episodeHTML.join("");
};

const renderCharacters = (data, container) => {
    const characterHTML = data.map(chr => {
        return (`
            <article class="character">
                <svg class="character__circle" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" dy="0.35em" font-size="275" text-anchor="middle" fill="white" font-weight="500">${ chr.alias.toUpperCase() ?? "?" }</text>
                </svg>
                <div class="character__name">${chr.name}</div>
                <div class="character__va">${chr.voice_actor}</div>
            </article>
        `);
    });

    container.replaceChildren();
    container.insertAdjacentHTML("beforeend", characterHTML.join(""));
};

renderEpisodes(extrasData, extrasContainer);
renderEpisodes(episodeData, episodeContainer);
renderCharacters(characterData, characterContainer);