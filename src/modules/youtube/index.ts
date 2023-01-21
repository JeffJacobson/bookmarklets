/**
 * Strips all parameters except for "v" from a YouTube URL.
 * @returns The input URL with all parameters except for "v" removed.
 */
export function stripExcessParamsFromUrl() {
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
  return url;
}

/**
 * Converts a YouTube channel URL into an RSS feed URL.
 * @param channelUrl A YouTube channel URL.
 * @returns A {@link URL} for the current channel.
 */
export function convertToFeedLink(channelUrl: string | URL) {
  // https://www.youtube.com/channel/UC25J6ueIa1L2NTqbbAeGN7A
  // https://www.youtube.com/feeds/videos.xml?channel_id=UC25J6ueIa1L2NTqbbAeGN7A

  const url = typeof channelUrl === "string" ? new URL(channelUrl) : channelUrl;

  // Get the end part of the URL which will be the channel ID.
  const parts = url.pathname.split("/");
  const channelId = parts[parts.length - 1];

  // Create output URL.
  return new URL(`feeds/videos.xml?channel_id=${channelId}`, url);
}

/**
 * Output of {@link getSubscriptionList}.
 */
interface SubscriptionListItem {
  /** Original URL from the {@link HTMLAnchorElement|<a> element's} href attribute. */
  href: URL;
  /** RSS feed URL for the {@link href} URL. */
  feedUrl: URL;
  /** The "title" attribute from the {@link HTMLAnchorElement|<a> element}. */
  title: string;
}

/**
 *
 * @example
 * import { getSubscriptionList } from "./modules/index"
 *
 * [...getSubscriptionList()].forEach(console.log)
 * @yields A URL similar to this one: `https://www.youtube.com/feeds/videos.xml?channel_id=ChannelUrlGoesHere`
 *
 */
export function* getSubscriptionList() {
  if (!/youtube\.com/i.test(location.host)) {
    throw new Error(
      `This function is meant for use with YouTube. Current URL, ${location}, does not appear to be on YouTube.`
    );
  }

  // Click the button to expand the necessary section.
  document.body
    .querySelector<HTMLButtonElement>(
      "button#button.style-scope.yt-icon-button[aria-pressed='false']"
    )
    ?.click();

  const subscriptionsSection = document.body.querySelector(
    "ytd-guide-collapsible-entry-renderer.style-scope.ytd-guide-section-renderer"
  );

  // Expand the subscriptions section if necessary.
  if (subscriptionsSection?.hasAttribute("can-show-more")) {
    subscriptionsSection.querySelector("a")?.click();
  }
  // document.body.querySelector<HTMLAnchorElement>("ytd-guide-collapsible-entry-renderer.style-scope.ytd-guide-section-renderer[can-show-more] a")?.click();

  // Get the list of subscribed channel links.
  const feedAnchors = subscriptionsSection?.querySelectorAll<HTMLAnchorElement>(
    "ytd-guide-entry-renderer[line-end-style] a[href]"
  );

  if (feedAnchors) {
    for (const a of feedAnchors) {
      yield {
        href: new URL(a.href),
        feedUrl: convertToFeedLink(a.href),
        title: a.title,
      } as SubscriptionListItem;
    }
  }
}

/**
 * Generates an "outline" element.
 * @param listItem Output from {@link SubscriptionListItem} function.
 * @returns A string with an "outline" element.
 */
function createOpmlOutlineElement(listItem: SubscriptionListItem) {
  return [
    `<outline title="${listItem.title}">`,
    `<outline type="rss" title="${listItem.title}" text="${listItem.title}" version="RSS"`,
    `xmlUrl="${listItem.feedUrl}"`,
    `htmlUrl="${listItem.href}"/>`,
    "</outline>",
    "</outline>",
  ].join("");
}

/**
 * Creates OPML markup of the YouTube subscriptions listed on a page.
 */
export function createOpml() {
  const outputParts = new Array<string>(
    '<opml version="1.0">',
    "<head>",
    "<title>YouTube feeds</title>",
    `<dateCreated>${new Date()}</dateCreated>`,
    "</head>",
    "<body>"
  );

  for (const item of getSubscriptionList()) {
    const outline = createOpmlOutlineElement(item);
    outputParts.push(outline);
  }

  outputParts.push("</body></opml>");
  return outputParts.join("");
}

/**
 * Gets the `<ytd-playlist-video-renderer>` elements of videos that have been partially played.
 * @returns the `<ytd-playlist-video-renderer>` elements of videos that have been partially played.
 */
export function getPlayedVideosFromList() {
  return [
    ...document.querySelectorAll(
      "#progress.ytd-thumbnail-overlay-resume-playback-renderer[style]"
    ),
  ]
    .map(
      (e) =>
        e.parentElement?.parentElement?.parentElement?.parentElement
          ?.parentElement?.parentElement?.parentElement || null
    )
    .filter((e) => e != null) as HTMLElement[];
}

/**
 * Gets all of the playlist links displayed on a page.
 * @returns A list of anchor elements that link to YouTube playlists.
 */
export function getPlaylistLinks(): NodeListOf<HTMLAnchorElement> {
    return document.body.querySelectorAll<HTMLAnchorElement>("a[href*='list'].yt-formatted-string");
}
