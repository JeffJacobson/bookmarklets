/**
 * Publishes the contents of dist to Github Pages.
 */

import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { publish } from "gh-pages";
import { cwd } from "node:process";

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
const currentDir = cwd();

__dirname =  relative(currentDir, __dirname);

const htmlDir = join(__dirname, "..", "dist");

console.log(htmlDir);

publish(htmlDir, (err) => {
    if (err) {
        console.error("error publishing", err);
    } else {
        console.log(`Published contents of "${htmlDir}"`);
    }
})