# Bookmarklets

This repository contains code for bookmarklets. If you don't know what a bookmarklet is, see [Bookmarklets on Wikipedia].

[Bookmarklets on Wikipedia]:https://en.wikipedia.org/wiki/Bookmarklet

## clean-youtube-url.js


```javascript
javascript:/** * Remove all params from a YouTube URL except for "v". */(() => { if (!location.origin.search(/youtube\.com/)) { console.warn("This bookmarklet is only designed for YouTube."); } const url = new URL(location.href); const keysToKeep = /^v$/i; const keys = Array.from(url.searchParams.keys()).filter(k => !keysToKeep.test(k)); console.log(keys); keys.forEach(k => url.searchParams.delete(k)); history.pushState(url.searchParams, document.title, url);})();
```
## Costco List Total.js


```javascript
javascript:/** * When looking at a list on Costco.com, this script will * give you a total for all the items currently in the list. */(() => { /** * List of all if the items on the list. * @type {NodeListOf<HTMLLIElement>} */ const items = document.querySelectorAll("li.item-position"); let total = 0; for (const item of items) { console.group(`sequence ${item.attributes["sequence"].value}`); /** @type {HTMLInputElement} */ const quantitySelector = item.querySelector("[id^='quantity_']"); /** The quantity of the current item. */ const quantity = parseInt(quantitySelector.value); /** * Get the <span> containing the price. * @type {HTMLSpanElement} */ const itemPriceSpan = item.querySelector("[automation-id^='itemPrice_']"); /** The price of the current item */ const itemPrice = parseFloat(itemPriceSpan.textContent.replace("$", "")); /** The current price ⨉ quantity */ const subtotal = itemPrice * quantity; console.log("quantity", quantity); console.log("price", itemPrice); console.log("sub total", itemPrice * quantity); total += subtotal; console.groupEnd(); } console.log("total", total);})();
```
## Find Feeds.js


```javascript
javascript:/** * Finds Atom, RSS, and Activity JSON feeds defined in a page * and displays them as links in a dialog. */(() => { /** * Finds all of the links that look like RSS, Atom, etc., feeds. * @returns {NodeListOf<HTMLLinkElement>} - A node list of elements. */ function findFeedLinks() { const types = [ "application/atom+xml", "application/rss+xml", "application/feed+json", "application/activity+json" ]; const selector = types.map(t => `link[type="${t}"]`).join(","); const feedLinks = document.querySelectorAll(selector); return feedLinks; } /** * Converts a link element into an a (anchor) element. * @param {HTMLLinkElement} linkElement - An HTML link element with a feed RSS. */ function convertLinkToAnchor(linkElement) { const a = document.createElement("a"); a.href = linkElement.href; const codeElement = document.createElement("code"); codeElement.textContent = linkElement.outerHTML; a.appendChild(codeElement); return a; } /** * Creates a `ul` (unordered list) of `a` (anchor) elements * based on feed `link` elements. * @param {NodeListOf<HTMLLinkElement>} feedLinks * @returns An unordered list of anchors based on input links. */ function createLinkList(feedLinks) { const frag = document.createDocumentFragment(); const list = document.createElement("ul"); for (const link of Array.from(feedLinks)) { const a = convertLinkToAnchor(link); const li = document.createElement("li"); li.appendChild(a); list.appendChild(li); } frag.appendChild(list); return frag; } /** * Converts a string into a valid CSS class name. * @param {string} name */ function toClassName(name) { return name.replace(/[\s]+/i, "-").toLowerCase(); } /** * Finds anchors (a) in a page that *might* be * RSS, ATOM, JSON Feed, etc. feeds and returns * them as an unordered list (ul). * @returns {HTMLUListElement | null} an unordered list (ul) of anchors that MIGHT be * RSS, ATOM, JSON Feed, etc. feeds. * If no anchors are found, null is returned instead. */ function createListOfFeedAnchors() { const feedTypes = ["RSS", "ATOM", "JSON Feed", "JsonFeed", "feed"]; const feedSelector = feedTypes.map(name => { return [`a[title*='${name}'i]`, `a[href*='${name}'i]`].join(","); }).join(","); const feedAnchors = document.querySelectorAll(feedSelector); if (feedAnchors.length < 1) { return null; } const re = new RegExp(`\b(?:${feedTypes.map(ft => `(?:${ft})`).join("|")})\b`, "ig"); /** * Converts anchors into list items (li) containing * copies of the anchor element. * @param {NodeListOf<HTMLAnchorElement>} anchors */ function* convertAnchors(anchors = feedAnchors, feedNamesRe = re) { for (const a of anchors) { const newAnchor = a.cloneNode(true); const li = document.createElement("li"); li.appendChild(newAnchor); const classNames = [a.href, a.title] .filter(s => s != null) .map(s => s.match(feedNamesRe)) .filter(m => m != null) .map(m => toClassName(m[0])); if (classNames) { li.classList.add(...classNames); } yield li; } } const frag = document.createDocumentFragment(); frag.append(...convertAnchors(feedAnchors)); const list = document.createElement("ul"); list.append(frag); return list; } const bookmarkletClass = "feeds-cc0a1783-0569-458e-89d1-28dd6872bbef"; const feedLinks = findFeedLinks(); const anchorList = createListOfFeedAnchors(); if (!feedLinks.length && !anchorList) { const message = "No feed links were found."; alert(message); return; } const frag = createLinkList(feedLinks); if (anchorList) { frag.append(anchorList); } const dialog = document.createElement("dialog"); dialog.classList.add(bookmarkletClass); dialog.append(frag); const closeButton = document.createElement("button"); closeButton.innerText = "Close"; dialog.append(closeButton); closeButton.addEventListener("click", () => { dialog.close(); dialog.remove(); }, { once: true, passive: true }); const existingDialogs = document.body.querySelectorAll(`.${bookmarkletClass}`); if (existingDialogs) { existingDialogs.forEach(d => d.remove()); } document.body.prepend(dialog); dialog.showModal();})();
```
## Go to Amazon Smile.js


```javascript
javascript:/** * Go to Amazon Smile equivalent site. */(() => { const amazonRe = /(?<=^https:\/\/)(?:[^.]+\.)?(amazon\.co(?:m|(?:\.[a-z]{2})))/i; const newUrl = location.href.replace(amazonRe, "smile.$1"); open(newUrl, "_top");})();
```
## Remove playlist params from YouTube video links.js


```javascript
javascript:/** * When viewing a YouTube playlist, this script will modify the links so that * they will just play a single video rather than auto playing the next video * on the list. */(() => { /** @type {NodeListOf<HTMLAnchorElement>} */ const videoLinks = document.body.querySelectorAll("a[href^='/watch?']"); const paramsToRemove = ["list", "index"]; for (const a of videoLinks) { const url = new URL(a.href); paramsToRemove.forEach(p => url.searchParams.delete(p)); a.href = url.href; } })();
```
## YouTube convert Shorts link to regular.js


```javascript
javascript:/** * Converts a YouTube Shorts URL into its standard equivalent. */(() => { /** * Converts a YouTube Shorts URL into its standard, less annoying equivalent. * @param {string} youtubeShortsUrl A YouTube shorts URL. * @returns The regular equivalent of the input shorts URL. */ function getRegularUrlFromShortsUrl(youtubeShortsUrl) { const shortsUrlRe = /(?<root>https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[^/]+)/i; console.debug("shorts URL", youtubeShortsUrl); const match = youtubeShortsUrl.match(shortsUrlRe); if (!match) { console.warn("This does not appear to be a YouTube Shorts URL"); return youtubeShortsUrl; } const videoId = match.groups["videoId"]; console.debug("video ID", videoId); const outputUrl = `${match.groups["root"]}watch?v=${match.groups["videoId"]}`; console.debug("output URL", outputUrl); return outputUrl; } /** * Replaces all of the YouTube Shorts links with regular links. */ function replaceShortsLinks() { const shortsLinks = document.body.querySelectorAll("a[href*='/shorts/']"); for (const link of shortsLinks) { const newHref = getRegularUrlFromShortsUrl(link.href); if (link.href === newHref) { continue; } console.log(`replacing ${link.href} with ${newHref}`); link.href = newHref; } } /** * If the current URL is a "shorts" URL, redirect the browser. * Otherwise, do nothing. */ function redirectFromShortsUrl() { const oldUrl = location.href; const newUrl = getRegularUrlFromShortsUrl(oldUrl); if (oldUrl !== newUrl) { open(newUrl); } } redirectFromShortsUrl(); replaceShortsLinks();})();
```
