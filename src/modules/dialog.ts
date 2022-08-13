
/**
 * Creates dialog header with close button.
 * @returns 
 */
function createHeader() {
    const header = document.createElement("header");
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    header.append(closeButton);
    return { header, closeButton };
}

export class CloseableDialog extends HTMLDialogElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        const { header, closeButton } = createHeader();

        const dialog = this;

        closeButton.addEventListener("click", () => {
            dialog.close();
            dialog.remove();
        }, {
            once: true,
            passive: true
        });

        this.shadowRoot?.append(header);
    }
}

export const dialogElementName = "closeable-dialog";

export function registerClosableDialog() {
    return customElements.define(dialogElementName, CloseableDialog, {
        extends: "dialog"
    });
}