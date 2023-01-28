const trackPageSelector = "a[href*='/track/']"

const trackPageLinkListItemSelector = "li[data-item-id]";

interface TrackListing {
    itemId?: string;
    bandId?: string;
    title?: string;
    url: string;
}

/* <!-- Sample list ite for a track -->
<li data-item-id="track-76499203" data-band-id="1684130851" class="music-grid-item square

" data-bind="css: {'featured': featured()}">
    <a href="/track/the-room-commentary-track">
        <div class="art"> 
            <img src="https://f4.bcbits.com/img/a3170211279_2.jpg" alt="">
        </div>
        <p class="title">
            The Room - Commentary Track
        </p>
    </a>
</li>
*/

function convertListItem(li: HTMLLIElement): Partial<TrackListing> {
    const { itemId, bandId } = li.dataset;
    const link = li.querySelector("a");
    const titleP = li.querySelector("p");
    const itemUrl = link?.href;
    const title = titleP?.innerText.trim();
    return {
        itemId,
        bandId,
        title,
        url: itemUrl,
    }
}

function* convertListItems(lItems: NodeListOf<HTMLLIElement>): Generator<TrackListing, void, unknown> {
    for (const li of lItems) {
        const output = convertListItem(li);
        if (output.url != null) {
            yield output as TrackListing;
        } else {
            console.warn("List item does not appear to have a valid URL.", output);
        }
    }
}

export async function getTrackPages(url: string | URL): Promise<Generator<TrackListing, void, unknown>> {
    const response = await fetch(url);
    const html = await response.text();

    const domParser = new DOMParser();
    const parsedHtml = domParser.parseFromString(html, "text/html");
    const listItems = parsedHtml.querySelectorAll<HTMLLIElement>(trackPageLinkListItemSelector);
    
    return convertListItems(listItems);
}