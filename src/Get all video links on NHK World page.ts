/**
 * Popup a dialog with the yt-dlp command to download all of the video links.
 */

// A regexp to match all of the URLs with numbers after the /video/ portion.
const videoUrlRe = /.+\/ondemand\/video\/\d+\b/gi;


/**
 * Returns an array of video URLs.
 * @returns 
 */
function getVideoUrls() {
  return [
    // Put the returned array into a Set to filter out duplicates.
    ...new Set(
      // Select all of the anchors with "ondemand/video" in their hrefs
      // and put them into an array.
      [
        ...document.body.querySelectorAll<HTMLAnchorElement>(
          "a[href*='ondemand/video/']"
        ),
      ]
        // Filter out the ones that just end with "video" and aren't followed by a number.
        .filter((a) => videoUrlRe.test(a.href))
        // Get the href value for each one.
        .map((p) => `"${p.href}"`)
    ),
  ];
}

/**
 * Creates a dialog with a text area, containing a yt-dlp command
 * to download all of the URLs found on the current page.
 * @param urls 
 */
function showCommandDialog(urls: string[]) {
  // If there are no URLs, show a message and then exit the function.
  if (!urls || urls.length < 0) {
    alert(`Failed to find any URLs matching the pattern "${videoUrlRe.source}".`);
    return;
  }


  // Create a dialog.
  const dialog = document.createElement("dialog");

  // Create a text area for the dialog and set its text
  // to the yt-dlp command.
  const textarea = document.createElement("code");
  textarea.classList.add("language-shell");
  textarea.textContent = `yt-dlp ${urls.join(" ")}`;

  // Create the button to close the dialog.
  // Clicking this button will also remove the element
  // from the page.
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";

  // Add the text area and close button to the dialog.
  dialog.append(textarea, closeButton);

  // Add the dialog to the page body.
  document.body.appendChild(dialog);

  // Setup the event handler for the button click
  closeButton.addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  // Show the dialog.
  dialog.showModal();
}

const urls = getVideoUrls();
showCommandDialog(urls);

