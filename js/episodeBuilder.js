import { extrasData, episodeData } from "./episodeList.js";
import { convertEpText } from "./misc.js";

const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const extrasContainer = document.querySelector(".extras__container");
const episodeContainer = document.querySelector(".episode__container");

export const renderEpisodes = (data, container) => {
    const episodeHTML = data.map(ep => { 
        let ratingValue = ep.rating;
        let ratingClass;
        const hours = new Date().getHours();
        const threeAmFilter = hours >= 3 && hours < 5;
       
        if (ratingValue >= 8.1) {
            ratingClass = "excellent"
        } else {
            ratingClass = "average"
        }
        
        if (threeAmFilter === true) {
        	document.documentElement.setAttribute("dir", "rtl");
        }
        
        return (`
            <article class="episode__item" data-${ep.type}="${ep.number}">
                <div class="episode__image-wrapper">
                    <a class="episode__link" href="${ep.link || '404.html'}">
			 	       <picture>
				            <source srcset="assets/episode-images/${ep.thumbnail}" 
				                    type="image/avif">
				            <img class="episode__image ${threeAmFilter === true ? 'three-am-filter' : ''}"
				                 src="https://pandamine5.github.io/knighton-media/assets/episode-images/${ep.thumbnail.replace('.avif', '.jpg')}"
				                 alt="Nexo Knights ${capitalizeFirstLetter(ep.type)} ${ep.number} [${convertEpText(ep.number)}] - ${ep.title} | Knighton Media" 
				                 loading="lazy">
				        </picture>
                    </a>       
                    <div class="episode__rating ${ratingClass}" style="display: ${ratingValue ?? 'none'}">
                        <svg class="svg-icon"><use href="assets/icons/icons.svg#icon-star"></use></svg> ${ratingValue}
                    </div>
                </div>
                <div class="episode__info">
                    <div class="episode__number">${(ep.type).toUpperCase()} ${ep.number}</div>
                    <div class="episode__title highlight-flas">${ep.title}</div>
                    <div class="episode__description">${ep.description ?? ''}</div>
                    <div class="episode__metadata">${ep.metadata}</div>
                </div>
            </article>
        `);
    });

    container.innerHTML = episodeHTML.join("");
};

renderEpisodes(extrasData, extrasContainer);
renderEpisodes(episodeData, episodeContainer);