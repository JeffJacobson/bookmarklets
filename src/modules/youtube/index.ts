(() => {
    function stripExcessParamsFromUrl() {

        if (!location.origin.search(/youtube\.com/)) {
            console.warn("This bookmarklet is only designed for YouTube.");
        }
        const url = new URL(location.href);
        const keysToKeep = /^v$/i;
        const keys = Array.from(url.searchParams.keys()).filter(k => !keysToKeep.test(k));
        console.log(keys);
        keys.forEach(k => url.searchParams.delete(k));
        return url;
    }

    function convertToFeedLink(channelUrl: string | URL) {
        // https://www.youtube.com/channel/UC25J6ueIa1L2NTqbbAeGN7A
        // https://www.youtube.com/feeds/videos.xml?channel_id=UC25J6ueIa1L2NTqbbAeGN7A

        let url = typeof channelUrl === "string" ? new URL(channelUrl) : channelUrl;

        const parts = url.pathname.split("/");
        const channelId = parts[parts.length - 1];

        return new URL(`feeds/videos.xml?channel_id=${channelId}`, url);
    }

    function* getSubscriptionList() {

        // Click the button to expand the necessary section.
        document.body.querySelector<HTMLButtonElement>("button#button.style-scope.yt-icon-button[aria-pressed='false']")?.click();

        const subscriptionsSection = document.body.querySelector("ytd-guide-collapsible-entry-renderer.style-scope.ytd-guide-section-renderer");

        // Expand the subscriptions section if necessary.
        if (subscriptionsSection?.hasAttribute("can-show-more")) {
            subscriptionsSection.querySelector("a")?.click();
        }
        // document.body.querySelector<HTMLAnchorElement>("ytd-guide-collapsible-entry-renderer.style-scope.ytd-guide-section-renderer[can-show-more] a")?.click();

        // Get the list of subscribed channel links.
        const feedAnchors = subscriptionsSection?.querySelectorAll<HTMLAnchorElement>(
            "ytd-guide-entry-renderer[line-end-style] a[href]"
        );

        // https://www.youtube.com/feeds/videos.xml?channel_id=UC25J6ueIa1L2NTqbbAeGN7A

        if (feedAnchors) {
            for (const a of feedAnchors) {
                yield {
                    href: a.href,
                    feedUrl: convertToFeedLink(a.href),
                    title: a.title
                };
            }
        }
    }

    [...getSubscriptionList()].forEach(console.log)
})();