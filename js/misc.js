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