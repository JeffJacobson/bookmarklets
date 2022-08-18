/**
 * Remove all params from a YouTube URL except for "v".
 */
if (!location.origin.search(/youtube\.com/)) {
  console.warn("This bookmarklet is only designed for YouTube.");
}
const url = new URL(location.href);
const keysToKeep = /^v$/i;
const keys = Array.from(url.searchParams.keys()).filter(
  (k) => !keysToKeep.test(k)
);
console.log(keys);
keys.forEach((k) => url.searchParams.delete(k));
history.pushState(url.searchParams, document.title, url);
