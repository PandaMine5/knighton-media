import { characterData } from "./characterList.js";

const container = document.querySelector(".character__container");
export const renderEpisodes = (data, container) => {
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

renderEpisodes(characterData, container);