/**
 * Converts a YouTube Shorts URL into its standard equivalent.
 */

/**
 * Converts a YouTube Shorts URL into its standard, less annoying equivalent.
 * @param {string} youtubeShortsUrl A YouTube shorts URL.
 * @returns The regular equivalent of the input shorts URL.
 */
function getRegularUrlFromShortsUrl(youtubeShortsUrl: string) {
    // Regex to test for a shorts URL
    const shortsUrlRe = /(?<root>https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[^/]+)/i;
    console.debug("shorts URL", youtubeShortsUrl);
    // Exit if format of URL is incorrect.
    const match = youtubeShortsUrl.match(shortsUrlRe);
    if (!match) {
        console.warn("This does not appear to be a YouTube Shorts URL");
        return youtubeShortsUrl;
    }
    if (match.groups) {
        const videoId = match.groups["videoId"];
        console.debug("video ID", videoId);
        const outputUrl = `${match.groups["root"]}watch?v=${match.groups["videoId"]}`;
        console.debug("output URL", outputUrl);
        return outputUrl;
    }
    return youtubeShortsUrl;
}

/**
 * Replaces all of the YouTube Shorts links with regular links.
 */
function replaceShortsLinks() {
    const shortsLinks = document.body.querySelectorAll<HTMLAnchorElement>("a[href*='/shorts/']");
    for (const link of shortsLinks) {
        if (!link) {
            continue;
        }
        const newHref = getRegularUrlFromShortsUrl(link.href);
        if (link.href === newHref) {
            continue;
        }
        console.log(`replacing ${link.href} with ${newHref}`);
        link.href = newHref;
    }
}

/**
 * If the current URL is a "shorts" URL, redirect the browser.
 * Otherwise, do nothing.
 */
function redirectFromShortsUrl() {
    const oldUrl = location.href;
    const newUrl = getRegularUrlFromShortsUrl(oldUrl);
    if (oldUrl !== newUrl) {
        open(newUrl);
    }
}

redirectFromShortsUrl();
replaceShortsLinks();