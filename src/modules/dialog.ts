
type CreateHeaderOutput = {
    header: HTMLElement;
    closeButton: HTMLButtonElement;
};

/**
 * Creates dialog header with close button.
 * @param dialog - If provided, the header will be 
 * @returns 
 */
function createHeader(): CreateHeaderOutput;
function createHeader(dialog: HTMLDialogElement, appendToDialog?: boolean): HTMLElement;
function createHeader(dialog?: HTMLDialogElement, appendToDialog?: boolean): HTMLElement | CreateHeaderOutput {
    const header = document.createElement("header");
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    header.append(closeButton);
    if (dialog != null) {
        closeButton.addEventListener("click", () => {
            dialog.close();
            dialog.remove();
        }, {
            once: true,
            passive: true
        });

        if (appendToDialog) {
            dialog.append(header);
        }
        return header;
    }
    else {
        return { header, closeButton }
    }
}

/**
 * Creates a dialog element with a header containing a close button.
 * @param content - Content to display in the dialog.
 * @returns The dialog described in the summary. Note that this is *not* a custom element.
 */
export function createCloseableDialog(content?: Node): HTMLDialogElement {
    const dialog = document.createElement("dialog");
    /* const header  = */ createHeader(dialog, true);
    if (content) {
        dialog.append(content);
    }

    return dialog;
}

export class CloseableDialog extends HTMLDialogElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        const header = createHeader(this);

        this.shadowRoot?.append(header);
    }
}

export const dialogElementName = "closeable-dialog";

export function registerClosableDialog() {
    return customElements.define(dialogElementName, CloseableDialog, {
        extends: "dialog"
    });
}