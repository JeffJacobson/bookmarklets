/**
 * @file Reads all of the files from the src directory and writes
 * bookmarklet equivalents to the dest directory.
 */
import { readdir, readFile, writeFile, rm, access } from "fs/promises";
import { constants } from "fs";
import path from "path";
import { minify } from "minify";

const destinationDir = "dest";

/**
 * Reads the contents of the files in a directory
 * @param {string} dir A directory path
 * @returns {AsyncGenerator<[name:string, code:string], void, unknown>} An array with the file name and minified code content, respectively.
 */
async function* readFilesContents(dir) {
    const files = await readdir(destinationDir, {
        withFileTypes: true
    });
    for await (const file of files) {
        // Skip if item isn't a file.
        if (!file.isFile()) continue;
        const filePath = path.join(dir, file.name);
        const fileContent = await minify(filePath);
        /**
         * @type {[string, string]}
         */
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
        const url = `javascript:${bookmarklet.replace(/"/g, "&quot;")}`;
        // outputParts.push(`[${name}](javascript:${url})`);
        outputParts.push(`* <a href="${url}">${name}</a>`);
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

await updateMarkdown();