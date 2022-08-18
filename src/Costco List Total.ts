/**
 * When looking at a list on Costco.com, this script will
 * give you a total for all the items currently in the list.
 */

function getListTotal() {
  /**
   * List of all if the items on the list.
   * @type {NodeListOf<HTMLLIElement>}
   */
  const items = document.querySelectorAll<HTMLLIElement>("li.item-position");

  let total = 0;

  for (const item of items) {
    console.group(
      `sequence ${item.attributes.getNamedItem("sequence")?.value}`
    );

    // Get the quantity of the current item.
    const quantitySelector =
      item.querySelector<HTMLInputElement>("[id^='quantity_']");

    if (quantitySelector?.value == null) {
      throw new TypeError("Could not get a value.");
    }

    /** The quantity of the current item. */
    const quantity = parseInt(quantitySelector.value);
    // Get the price of the current item.

    // Get the <span> containing the price.
    const itemPriceSpan = item.querySelector<HTMLSpanElement>(
      "[automation-id^='itemPrice_']"
    );

    if (itemPriceSpan?.textContent == null) {
      throw new TypeError("could not find item price <span>");
    }

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
  return total;
}

getListTotal();
