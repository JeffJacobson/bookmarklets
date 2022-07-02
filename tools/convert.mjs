/**
 * @file Reads all of the files from the src directory and writes
 * bookmarklet equivalents to the dest directory.
 */
import { mkdir, readdir, readFile, writeFile, rm, access } from "fs/promises";
import { constants, existsSync } from "fs";
import path from "path";

/**
 * Removes comments from input.
 * @param {string} input 
 * @returns {string} Copy of input string with comments removed.
 */
function removeComments(input) {
    // Find two slashes at the beginning of a line, optionally preceded by spaces.
    const re = /^\s*\/\/.+?$/img;
    // Replace all detected comments with empty string.
    const output = input.replaceAll(re, "");
    // Add console warning if input and output are identical.
    if (input === output) {
        console.warn("Input and output are identical");
    }
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

/**
 * Replaces mutliple consecutive spaces with a single space character.
 * @param {string} input Input string
 * @returns A copy of the input string with extra spaces removed.
 */
function removeExtraSpaces(input) {
    const re = /\s{2,}/gm;
    const output = input.replaceAll(re, " ");
    return output;
}

const sourceDir = "src";
const destinationDir = "dest";

/**
 * Remove newlines and comments.
 */
async function transpile() {
    // Remove the destination directory if it already exists.
    if (existsSync(destinationDir)) {
        await rm(destinationDir, {
            recursive: true
        });
    }

    // Create the output directory.
    mkdir(destinationDir);

    // Read the contents of the JavaScript files in the source directory.
    const files = await readdir(sourceDir, {
        withFileTypes: true
    });
    for await (const file of files) {
        // Skip if item isn't a file.
        if (!file.isFile()) continue;
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
}

/**
 * Reads the contents of the files in a directory
 * @param {string} dir A directory path
 * @yields {[string, string]} An array with the file name and content, respectively.
 */
async function* readFilesContents(dir) {
    const files = await readdir(destinationDir, {
        withFileTypes: true
    });
    for await (const file of files) {
        // Skip if item isn't a file.
        if (!file.isFile()) continue;
        const filePath = path.join(dir, file.name);
        const fileContent = await readFile(filePath, {
            encoding: "utf-8",
            flag: constants.O_RDONLY
        });
        yield [file.name, fileContent];
    }
}

/**
 * Updates the README.md file with the bookmarklets' contents.
 */
async function updateMarkdown() {
    let content = await readFile("README.template.md", {
        encoding: "utf-8",
        flag: constants.O_RDONLY
    });

    const outputParts = [];

    for await (const [name, bookmarklet] of readFilesContents(destinationDir)) {
        outputParts.push(`## ${name}`, "\n");
        outputParts.push("```javascript", bookmarklet, "```");
    }

    const output = outputParts.join("\n");

    content = content.replace("{{bookmarklets}}", output);



    const outputFile = "README.md";

    if (await access(outputFile, constants.R_OK | constants.W_OK)) {
        await rm(outputFile, {
            force: true
        });
    }


    try {
        await writeFile(outputFile, content, {
            encoding: "utf-8"
        });
    } catch (error) {
        console.error(`An error occurred writing to ${outputFile}`, error);
    }
}

await transpile();
await updateMarkdown();