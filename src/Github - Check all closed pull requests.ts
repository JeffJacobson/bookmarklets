/**
 * Checks all of the closed pull request checkboxes.
 */

const closedCheckboxes = [
  ...document.body.querySelectorAll(".octicon-git-pull-request-closed"),
].map((i) =>
  i.parentElement?.parentElement?.parentElement?.parentElement?.querySelector<HTMLInputElement>(
    "input[type=checkbox]"
  )
);

for (const cb of closedCheckboxes) {
  if (!cb) continue;
  cb.checked = true;
}
