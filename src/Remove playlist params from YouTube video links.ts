/**
 * When viewing a YouTube playlist, this script will modify the links so that
 * they will just play a single video rather than auto playing the next video
 * on the list.
 */

// Remove playist parameters from current URL and reload
// https://www.youtube.com/watch?v=TheVideoId&list=WL&index=5
if (/\w+\.youtube\.com/i.test(location.hostname)) {
  const currentUrl = new URL(location.href);
  
  if (currentUrl.searchParams.has("v")) {
    ["list", "index"].forEach((key) => {
      currentUrl.searchParams.delete(key);
    });
    if (
      window.confirm(
        "Are you sure you want to reload this page without the playlist?"
      )
    ) {
      open(currentUrl, "self");
    }
  }
}

const videoLinks =
  document.body.querySelectorAll<HTMLAnchorElement>("a[href^='/watch?']");

// These are the URL search parameters that will be removed from the href attributes.
const paramsToRemove = ["list", "index"];

// Remove the unwanted params.
for (const a of videoLinks) {
  const url = new URL(a.href);
  paramsToRemove.forEach((p) => url.searchParams.delete(p));
  a.href = url.href;
}
