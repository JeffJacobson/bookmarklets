import { getTrackPages } from "./modules/bandcamp/index.js";

(async () => {
    const trackPages = await getTrackPages(location.href);

    const output = [];
    for (const trackListing of trackPages) {
        output.push(trackListing.url);
    }
    return output.join("\n");
})();