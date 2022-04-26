/**
 * Converts a YouTube Shorts URL into its standard equivalent.
 */
(() => {
    const shortsUrlRe = /(https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[a-z0-9]+)/i;
    console.debug("shorts URL", location.href);
    const match = location.href.match(shortsUrlRe);
    if (!match) {
        console.warn("This does not appear to be a YouTube Shorts URL");
        return;
    }
    const videoId= match.groups["videoId"];
    console.debug("video ID", videoId);
    const outputUrl = "https://www.youtube.com/watch?v=" + videoId;
    console.debug("output URL", outputUrl);
    history.replaceState(videoId, null, outputUrl);
})();