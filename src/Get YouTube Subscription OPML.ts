import { createOpml } from "./modules/youtube/index.js";
import { registerClosableDialog, dialogElementName } from "./modules/dialog.js";
try {
    if (!window.customElements.get(dialogElementName)) {
        registerClosableDialog();
    }
    const opml = createOpml();
    const blob = new Blob([opml], {
        type: "text/opml"
    });
    const opmlUrl = URL.createObjectURL(blob);
    const dialog = document.createElement(dialogElementName);
    const opmlLink = document.createElement("a");
    opmlLink.href = opmlUrl;
    opmlLink.classList.add("opml");
    opmlLink.text = "YouTube subscriptions OPML";
    dialog.appendChild(opmlLink);
}
catch (error) {
    alert(`Could not generate OPML.`);
}