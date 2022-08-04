

function createHeader() {
    const header = document.createElement("header");
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    header.append(closeButton);

    return { header, closeButton };

    // closeButton.addEventListener("click", () => {
    //     dialog.close();
    //     dialog.remove();
    // }, {
    //     once: true,
    //     passive: true
    // });

    // dialog.shadowRoot?.append(header);

    // return dialog;
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

customElements.define("closeable-dialog", CloseableDialog, {
    extends: "dialog"
});