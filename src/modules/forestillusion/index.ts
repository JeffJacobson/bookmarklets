/**
 * Fetches a list of releases from Forest of Illusion's releases page.
 * @param releasesUrl - The URL for the releases page. Probably can leave this at the default value.
 * If the site layout changes, this whole script will probably break anyway.
 * @returns
 */
export async function fetchReleases(
  releasesUrl = new URL("https://forestillusion.com/releases/")
) {
  // Fetch the releases HTML page
  const response = await fetch(releasesUrl, {
    cache: "default",
  });

  // Get the HTML as a string.
  const markup = await response.text();

  // Parse the HTML string into a DOM object.
  const parser = new DOMParser();
  const pageDom = parser.parseFromString(markup, "text/html");

  // Find all the anchors that are children of list items.
  const releaseAnchors =
    pageDom.body.querySelectorAll<HTMLAnchorElement>("li > a");

  // Convert the anchor elements to output objects.
  const output = [...releaseAnchors]
    // Remove non-release page links.
    .filter((a) => a.title !== a.innerText)
    .map((a) => {
      const { href, title } = a;
      return { href, title };
    });
  return output;
}
