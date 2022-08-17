/**
 * Adds a definition list (<dl>) of links for the current npmjs package page.
 * * yarn
 * * jsDelivr
 * * unpkg
 */

import { getYarnUrl, getCdnUrl } from "./modules/npmjs/index.js";

export type UrlFunction = (url: string | URL) => URL;
export type FunctionMap = Map<string, UrlFunction>;

// Create a mapping of descriptions to functions.
const defaultFunctionMap: FunctionMap = new Map([
  ["yarn", getYarnUrl],
  ["jsDelivr", (url: string | URL) => getCdnUrl(url, "https://cdn.jsdelivr.net/npm/")],
  ["unpkg", (url: string | URL) => getCdnUrl(url, "https://unpkg.com/")]
])

/**
 * Calls the functions with the {@link url} and 
 * yields the results.
 * @param url - npmjs package URL.
 * @param mapOfFunctions 
 * @example ```typescript
 * const map = new Map(...enumerateUrls(location.href));
 * ```
 * @yields An array, with the first element being the key
 * from the {@link mapOfFunctions}, and the second being
 * either a {@link URL} or an {@link Error}.
 */
function* enumerateUrls(
  url: string | URL = location.href,
  mapOfFunctions = defaultFunctionMap
) {
  for (const [name, f] of mapOfFunctions) {
    try {
      const newUrl = f(url);
      yield [name, newUrl] as [string, URL];
    } catch (e) {
      if (e instanceof Error) {
        yield [name, e] as [string, Error];
      } else {
        throw e;
      }
    }
  }
}

/**
 * Calls {@link enumerateUrls}, then creates HTML Anchor elements
 * for each of the URLs.
 * @param url - npmjs package page URL.
 * @param functions - mapping of functions.
 */
function* enumerateAnchors(url: string | URL = location.href, functions = defaultFunctionMap) {
  for (const [name, urlOrError] of enumerateUrls(url, functions)) {
    if (urlOrError instanceof Error) {
      console.error(`Error generating ${name} URL`, urlOrError);
      continue;
    }

    const a = document.createElement("a");
    a.href = urlOrError.href;
    a.text = urlOrError.href;
    a.target = "_blank";
    a.rel="noopener noreferrer nofollow"
    yield [name, a] as [string, HTMLAnchorElement];
  }
}

/**
 * Calls {@link enumerateAnchors} and yields corresponding <dt> and <dd>
 * elements for insertion into a <dl>.
 * @param url 
 * @param functions 
 * @example ```typescript
 * // Create a definition list
 * const list = document.createElement("dl");
 * list.append(...[...enumerateListItems()].flat());
 * ```
 */
function* enumerateListItems(url: string | URL = location.href, functions = defaultFunctionMap) {
  for (const [name, a] of enumerateAnchors(url, functions)) {
    const dt = document.createElement("dt");
    dt.innerText = name;
    const dd = document.createElement("dd");
    dd.append(a);
    yield [dt, dd];
  }
}

// Create a definition list
const list = document.createElement("dl");
// Append list items: terms and definitions.
list.append(...[...enumerateListItems()].flat());

// Create a document fragment to hold the content we'll be adding.
const frag = document.createDocumentFragment();
// Create header for our new section.
const h3 = document.createElement("h3");
h3.innerText = "CDN Links";

// Append header and list to the doc. frag.
frag.append(h3, list);

// Get the container element that the links will be placed into.
const containerSelector = "main div#top > :last-child";
const container = document.querySelector<HTMLDivElement>(containerSelector);

if (!container) {
  console.error(`Could not find container using "${containerSelector}".`);
} else {
  // Add classes from the other h3 elements to ours so it will look the same.
  const existingH3 = container.querySelector("h3");
  if (existingH3) {
    h3.classList.add(...existingH3.classList);
  }
  // Insert our content into the container.
  container.insertBefore(frag, container.firstElementChild)
}

