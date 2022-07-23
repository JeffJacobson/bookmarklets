/**
 * When looking at a list on Costco.com, this script will
 * give you a total for all the items currently in the list.
 */
(() => {
    /**
     * List of all if the items on the list.
     * @type {NodeListOf<HTMLLIElement>}
     */
    const items = document.querySelectorAll("li.item-position");

    let total = 0;

    for (const item of items) {
        console.group(`sequence ${item.attributes["sequence"].value}`);

        // Get the quantity of the current item.
        /** @type {HTMLInputElement} */
        const quantitySelector = item.querySelector("[id^='quantity_']");
        /** The quantity of the current item. */
        const quantity = parseInt(quantitySelector.value);
        // Get the price of the current item.
        /**
         * Get the <span> containing the price.
         * @type {HTMLSpanElement}
         */
        const itemPriceSpan = item.querySelector("[automation-id^='itemPrice_']");
        
        // Parse the price after removing the "$".
        /** The price of the current item */
        const itemPrice = parseFloat(itemPriceSpan.textContent.replace("$", ""));
        /** The current price ⨉ quantity */
        const subtotal = itemPrice * quantity;

        console.log("quantity", quantity);
        console.log("price", itemPrice);
        console.log("sub total", itemPrice * quantity);

        // Add the subtotal to the overall total.
        total += subtotal;
        console.groupEnd();
    }

    console.log("total", total);
})();