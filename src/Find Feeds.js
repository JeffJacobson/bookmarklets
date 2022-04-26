(() => {
    
    // Name of class that will be used for content that will
    // be added by this bookmarklet.
    // Class name ends with a GUID to make it unlikely our class name
    // will clash with something on the page.
    const bookmarkletClass = "feeds-cc0a1783-0569-458e-89d1-28dd6872bbef";

    // Establish the link types that will be searched for.
    const types = [
        "application/atom+xml",
        "application/rss+xml",
        "application/activity+json"
    ];
    // Convert the array of types into a query selector string.
    const selector = types.map(t => `link[type="${t}"]`).join(",");

    // Find all the feed links on the page
    const feedLinks = document.querySelectorAll(selector);

    if (!feedLinks.length) {
        const message = "No feed links were found.";
        console.log(message);
        return;
    }

    /**
     * 
     * @param {HTMLLinkElement} linkElement - An HTML link element with a feed RSS.
     */
    function linkToAnchor(linkElement) {
        const a = document.createElement("a");
        a.href = linkElement.href;
        const codeElement = document.createElement("code");
        codeElement.textContent = linkElement.outerHTML;
        a.appendChild(codeElement);
        return a;
    }

    const frag = document.createDocumentFragment();


    const list = document.createElement("ul");
    
    // Create list items with anchors for each of the links,
    // appending each one to the list.
    for(const link of Array.from(feedLinks)) {
        const a = linkToAnchor(link);
        const li = document.createElement("li");
        li.appendChild(a);
        list.appendChild(li);
    }
    frag.appendChild(list);

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
})()