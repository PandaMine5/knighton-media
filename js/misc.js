  /*import { WebHaptics } from "https://cdn.jsdelivr.net/npm/web-haptics@0.0.6/dist/index.mjs";

  const haptics = new WebHaptics();

  document.querySelectorAll("button, a").forEach(element => {
    element.addEventListener("click", () => {
      haptics.trigger("medium");
    });
  });*/

export function getMetadataKey(str, key) {
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

export function convertEpText(ep) {
  let number  = parseInt(ep);
  let season  = Math.ceil(number / 10);
  let episode = number % 10 || 10;
  return `S${season}:E${episode}`;
}