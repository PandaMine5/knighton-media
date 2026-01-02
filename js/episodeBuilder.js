import { trailerData, episodeData } from "./episodeList.js";

const ratingOn = false;
const extrasContainer = document.querySelector(".extras__container");
const episodeContainer = document.querySelector(".episode__container");
const extrasData = trailerData;

export const renderEpisodes = (data, container) => {
    const episodeHTML = data.map(ep => { 
        const episodeType = String(ep.type ?? 'episode');   	
        let ratingValue = ep.rating;
        let ratingClass;        

        if (ratingValue >= 8.0) {
            ratingClass = "excellent"
        } else {
            ratingClass = "average"
        }
        
        return (`
            <article class="episode__item" data-${episodeType}="${ep.number}">
                <div class="episode__image-wrapper">
                    <a class="episode__link" href="${ep.link || '404.html'}">
                        <img class="episode__image"
                             src="assets/episode-images/${ratingOn ? 'no-spoilers' : ''}/${ep.thumbnail}" 
                             al="Nexo Knights ${episodeType.toUpperCase()} ${ep.number} - ${ep.title} | Knighton Media" 
                             loading="lazy">
                    </a>       
                    <div class="episode__rating ${ratingClass}" 
                         style="display: ${(!ratingOn || ratingValue == null) ? 'none' : 'inline-flex'}">
                        <svg class="svg-icon"><use href="assets/icons/icons.svg#icon-star"></use></svg> ${ratingValue}
                    </div>
                </div>
                <div class="episode__info">
                    <div class="episode__number">${episodeType.toUpperCase()} ${ep.number}</div>
                    <div class="episode__title">${ep.title}</div>
                    <div class="episode__description">${ep.description ?? ''}</div>
                    <div class="episode__metadata">${ep.metadata}</div>
                </div>
            </article>
        `);
    });

    container.replaceChildren();
    container.insertAdjacentHTML("beforeend", episodeHTML.join(""));
};


renderEpisodes(extrasData, extrasContainer);
renderEpisodes(episodeData, episodeContainer);