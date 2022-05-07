# Bookmarklets

This repository contains code for bookmarklets. If you don't know what a bookmarklet is, see [Bookmarklets on Wikipedia].

[Bookmarklets on Wikipedia]:https://en.wikipedia.org/wiki/Bookmarklet

## clean-youtube-url.js


```javascript
javascript:/** * Remove all params from a YouTube URL except for "v". */(() => { if (!location.origin.search(/youtube\.com/)) { console.warn("This bookmarklet is only designed for YouTube."); } const url = new URL(location.href); const keysToKeep = /^v$/i; const keys = Array.from(url.searchParams.keys()).filter(k => !keysToKeep.test(k)); console.log(keys); keys.forEach(k => url.searchParams.delete(k)); history.pushState(url.searchParams, document.title, url);})();
```
## Find Feeds.js


```javascript
javascript:/** * Finds Atom, RSS, and Activity JSON feeds defined in a page * and displays them as links in a dialog. */(() => { const bookmarkletClass = "feeds-cc0a1783-0569-458e-89d1-28dd6872bbef"; const types = [ "application/atom+xml", "application/rss+xml", "application/feed+json", "application/activity+json" ]; const selector = types.map(t => `link[type="${t}"]`).join(","); const feedLinks = document.querySelectorAll(selector); if (!feedLinks.length) { const message = "No feed links were found."; alert(message); return; } /** * * @param {HTMLLinkElement} linkElement - An HTML link element with a feed RSS. */ function linkToAnchor(linkElement) { const a = document.createElement("a"); a.href = linkElement.href; const codeElement = document.createElement("code"); codeElement.textContent = linkElement.outerHTML; a.appendChild(codeElement); return a; } const frag = document.createDocumentFragment(); const list = document.createElement("ul"); for(const link of Array.from(feedLinks)) { const a = linkToAnchor(link); const li = document.createElement("li"); li.appendChild(a); list.appendChild(li); } frag.appendChild(list); const dialog = document.createElement("dialog"); dialog.classList.add(bookmarkletClass); dialog.append(frag); const closeButton = document.createElement("button"); closeButton.innerText = "Close"; dialog.append(closeButton); closeButton.addEventListener("click", () => { dialog.close(); dialog.remove(); }, { once: true, passive: true }); const existingDialogs = document.body.querySelectorAll(`.${bookmarkletClass}`); if (existingDialogs) { existingDialogs.forEach(d => d.remove()); } document.body.prepend(dialog); dialog.showModal();})();
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
javascript:/** * Converts a YouTube Shorts URL into its standard equivalent. */(() => { /** * Converts a YouTube Shorts URL into its standard, less annoying equivalent. * @param {string} youtubeShortsUrl A YouTube shorts URL. * @returns The regular equivalent of the input shorts URL. */ function getRegularUrlFromShortsUrl(youtubeShortsUrl) { const shortsUrlRe = /(?<root>https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[^/]+)/i; console.debug("shorts URL", youtubeShortsUrl); const match = youtubeShortsUrl.match(shortsUrlRe); if (!match) { console.warn("This does not appear to be a YouTube Shorts URL"); return youtubeShortsUrl; } const videoId = match.groups["videoId"]; console.debug("video ID", videoId); const outputUrl = `${match.groups["root"]}watch?v=${match.groups["videoId"]}`; console.debug("output URL", outputUrl); return outputUrl; } /** * Replaces all of the YouTube Shorts links with regular links. */ function replaceShortsLinks() { const shortsLinks = document.body.querySelectorAll("a[href='https://www.youtube.com/shorts/]"); for (const link of shortsLinks) { const newHref = getRegularUrlFromShortsUrl(link.href); if (link.href === newHref) { continue; } console.log(`replacing ${link.href} with ${newHref}`); link.href = newHref; } } function replaceCurrentShortsURL() { const oldUrl = location.href; const newUrl = getRegularUrlFromShortsUrl(oldUrl); history.pushState({ oldUrl, newUrl }, null, newUrl); } replaceCurrentShortsURL(); replaceShortsLinks();})();
```
