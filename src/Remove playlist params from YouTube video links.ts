/**
 * When viewing a YouTube playlist, this script will modify the links so that
 * they will just play a single video rather than auto playing the next video
 * on the list.
 */

/** @type {NodeListOf<HTMLAnchorElement>} */
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
