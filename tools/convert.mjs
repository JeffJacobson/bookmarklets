/**
 * @file Reads all of the files from the src directory and writes
 * bookmarklet equivalents to the dest directory.
 */
import { mkdir, readdir, readFile, writeFile, rm } from "fs/promises";
import { constants, existsSync } from "fs";
import path from "path";

/**
 * Removes comments from input.
 * @param {string} input 
 * @returns {string} Copy of input string with comments removed.
 */
function removeComments(input) {
    const re = /\/\/.+?$/img;
    if (!re.test(input)) {
        console.info(`Comments not detected.`);
    }
    const output = input.replaceAll(re, "");
    if (input === output) {
        console.warn("Input and output are identical");
    }
    console.assert(!output.includes("//"), "Output should not contain comments.")
    return output;
}

/**
 * Removes newlines from input string
 * @param {string} input 
 * @returns {string} A copy of the input string with newlines removed.
 */
function removeNewlines(input) {
    const re = /[\n\r]*/g;
    const output = input.replace(re, "");
    if (input === output) {
        console.warn("Input and output are identical");
    }
    return output;
}

function removeExtraSpaces(input) {
    const re = /\s{2,}/gm;
    const output = input.replaceAll(re, " ");
    return output;
}

const sourceDir = "src";
const destinationDir = "dest";

if (existsSync(destinationDir)) {
    console.log(`removing ${destinationDir}`)
    await rm(destinationDir, {
        recursive: true
    });
}

console.log(`creating ${destinationDir}`);
mkdir(destinationDir);

const files = await readdir(sourceDir, {
    withFileTypes: true
});
for await (const file of files) {
    // Skip if item isn't a file.
    if (!file.isFile()) continue;
    console.log(file);
    const inPath = path.join(sourceDir, file.name);
    const outPath = path.join(destinationDir, file.name);
    const fileContent = await readFile(inPath, {
        encoding: "utf-8",
        flag: constants.O_RDONLY
    });
    let output = removeComments(fileContent);
    output = removeNewlines(output);
    output = removeExtraSpaces(output);
    output = `javascript:${output}`;
    await writeFile(outPath, output, {
        encoding: "utf-8",
        mode: constants.O_CREAT
    });
}