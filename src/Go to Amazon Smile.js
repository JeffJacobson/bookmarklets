/**
 * Go to Amazon Smile equivalent site.
 */
(() => {
    // Matches an Amazon URL
    const amazonRe = /(?<=^https:\/\/)(?:[^\.]+\.)?(amazon\.co(?:m|(?:\.[a-z]{2})))/i;

    const newUrl = location.href.replace(amazonRe, "smile.$1");

    open(newUrl, "_top");
})();