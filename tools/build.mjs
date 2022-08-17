/**
 * Builds the TypeScript files into JavaScript, bundling their
 * dependencies into a single file.
 */
import { readdir, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { F_OK } from "node:constants";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __directory = dirname(__filename);
const srcDir = join(__directory, "..", "src");

/**
 * When file paths are output to the console, user cannot
 * click on filenames with spaces, as only the part up to
 * the space is interpreted as part of the filename.
 * This function will convert paths, if they have spaces,
 * to a file URL using {@link pathToFileURL}.
 * @param {string} filePath 
 * @returns A file URL if input contains spaces. 
 * Otherwise will return the input unmodified.
 */
function getLinkableFilePath(filePath) {
    return filePath.search(" ") === -1 ? filePath : pathToFileURL(filePath);
}


console.debug(`Source directory is ${srcDir}.`);

const files = (await readdir(srcDir)).filter(
    fn => /\.ts$/i.test(fn)).map(fn => resolve(srcDir, fn));

console.debug(`Files: ${files.map(getLinkableFilePath).join("\n\t")}`);

/**
 * @type {Promise<BuildResult>}
 */
const promises = [];

const outdir = join(__directory, "..", "dist");


const needToCreateOutput = await access(outdir, F_OK).then(() => false, (reason) => reason);
if (needToCreateOutput) {
    console.log(`Creating directory ${outdir}`);
    await mkdir(outdir);
}

for (const file of files) {
    const outfile = join(outdir, `${basename(file, ".ts")}.js`);
    build({
        entryPoints: [file],
        minify: true,
        bundle: true,
        write: false,
        outfile
    }).then(buildResult => {
        if (buildResult.outputFiles) {
            for (const outFile of buildResult.outputFiles) {
                const prefixed = `javascript:${outFile.text}`;

                console.log(`Writing ${(getLinkableFilePath(outFile.path))}`);
                promises.push(writeFile(outFile.path, prefixed, {
                    encoding: "utf-8",
                    flag: "w"
                }));
            }
        } else {
            console.warn(`Build result for ${file} did not have any outputFiles.`);
        }
        return buildResult;
    });
}


try {
    await Promise.all(promises);
} catch (ex) {
    console.error(ex.message, ex);
}
