/**
 * Finds Atom, RSS, and Activity JSON feeds defined in a page 
 * and displays them as links in a dialog.
 */
(() => {

    /**
     * Finds all of the links that look like RSS, Atom, etc., feeds.
     * @returns {NodeListOf<HTMLLinkElement>} - A node list of elements.
     */
    function findFeedLinks() {
        const types = [
            "application/atom+xml",
            "application/rss+xml",
            "application/feed+json",
            "application/activity+json"
        ];
        // Convert the array of types into a query selector string.
        const selector = types.map(t => `link[type="${t}"]`).join(",");

        // Find all the feed links on the page
        const feedLinks = document.querySelectorAll(selector);
        return feedLinks;
    }

    /**
     * Converts a link element into an a (anchor) element.
     * @param {HTMLLinkElement} linkElement - An HTML link element with a feed RSS.
     */
    function convertLinkToAnchor(linkElement) {
        const a = document.createElement("a");
        a.href = linkElement.href;
        const codeElement = document.createElement("code");
        codeElement.textContent = linkElement.outerHTML;
        a.appendChild(codeElement);
        return a;
    }

    /**
     * Creates a `ul` (unordered list) of `a` (anchor) elements
     * based on feed `link` elements.
     * @param {NodeListOf<HTMLLinkElement>} feedLinks 
     * @returns An unordered list of anchors based on input links.
     */
    function createLinkList(feedLinks) {
        const frag = document.createDocumentFragment();
        const list = document.createElement("ul");

        // Create list items with anchors for each of the links,
        // appending each one to the list.
        for (const link of Array.from(feedLinks)) {
            const a = convertLinkToAnchor(link);
            const li = document.createElement("li");
            li.appendChild(a);
            list.appendChild(li);
        }
        frag.appendChild(list);
        return frag;
    }

    /**
     * Converts a string into a valid CSS class name.
     * @param {string} name 
     */
    function toClassName(name) {
        return name.replace(/[\s]+/i, "-").toLowerCase();
    }

    /**
     * Finds anchors (a) in a page that *might* be
     * RSS, ATOM, JSON Feed, etc. feeds and returns
     * them as an unordered list (ul).
     * @returns {HTMLUListElement | null} an unordered list (ul) of anchors that MIGHT be 
     * RSS, ATOM, JSON Feed, etc. feeds.
     * If no anchors are found, null is returned instead.
     */
    function createListOfFeedAnchors() {
        // Declare a list of feed type names to search for.
        const feedTypes = ["RSS", "ATOM", "JSON Feed", "JsonFeed", "feed"];
        // Create a selector string to search for these types.
        const feedSelector = feedTypes.map(name => {
            return [`a[title*='${name}'i]`, `a[href*='${name}'i]`].join(",");
        }).join(",");
        const feedAnchors = document.querySelectorAll(feedSelector);

        if (feedAnchors.length < 1) {
            return null;
        }

        // Create a regular expression to match feed type names.
        const re = new RegExp(`\b(?:${feedTypes.map(ft => `(?:${ft})`).join("|")})\b`, "ig");

        /**
         * Converts anchors into list items (li) containing
         * copies of the anchor element.
         * @param {NodeListOf<HTMLAnchorElement>} anchors 
         */
        function* convertAnchors(anchors = feedAnchors, feedNamesRe = re) {
            for (const a of anchors) {
                const newAnchor = a.cloneNode(true);
                const li = document.createElement("li");
                li.appendChild(newAnchor);
                const classNames = [a.href, a.title]
                    // filter out null or other "falsy" strings.
                    .filter(s => s != null)
                    // Find values that match.
                    .map(s => s.match(feedNamesRe))
                    // Filter out non-matches.
                    .filter(m => m != null)
                    // Convert to class names.
                    .map(m => toClassName(m[0]));
                // Add the classes to the list item
                // if there are any.
                if (classNames) {
                    li.classList.add(...classNames);
                }
                yield li;
            }
        }

        const frag = document.createDocumentFragment();
        frag.append(...convertAnchors(feedAnchors));

        const list = document.createElement("ul");
        list.append(frag);

        return list;
    }


    // Name of class that will be used for content that will
    // be added by this bookmarklet.
    // Class name ends with a GUID to make it unlikely our class name
    // will clash with something on the page.
    const bookmarkletClass = "feeds-cc0a1783-0569-458e-89d1-28dd6872bbef";

    // Establish the link types that will be searched for.
    const feedLinks = findFeedLinks();
    const anchorList = createListOfFeedAnchors();

    if (!feedLinks.length && !anchorList) {
        const message = "No feed links were found.";
        alert(message);
        return;
    }

    const frag = createLinkList(feedLinks);
    
    // Append the list of anchor elements.
    if (anchorList) {
        frag.append(anchorList);
    }

    const dialog = document.createElement("dialog");
    dialog.classList.add(bookmarkletClass);
    dialog.append(frag);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    dialog.append(closeButton);

    closeButton.addEventListener("click", () => {
        dialog.close();
        dialog.remove();
    }, {
        once: true,
        passive: true
    });

    // Remove existing dialogs.
    const existingDialogs = document.body.querySelectorAll(`.${bookmarkletClass}`);
    if (existingDialogs) {
        existingDialogs.forEach(d => d.remove());
    }
    // Add the dialog to the document and open it.
    document.body.prepend(dialog);
    dialog.showModal();


})();

