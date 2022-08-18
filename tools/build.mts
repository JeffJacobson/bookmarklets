/**
 * Builds the TypeScript files into JavaScript, bundling their
 * dependencies into a single file.
 */
import {
  readdir,
  mkdir,
  access,
  copyFile,
  FileHandle,
  open,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { F_OK, O_APPEND, O_CREAT, O_TRUNC } from "node:constants";
import { build, OutputFile } from "esbuild";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __directory = dirname(__filename);
const rootDir = join(__directory, "..");
const srcDir = join(rootDir, "src");
const outdir = join(rootDir, "dist");

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
function getLinkableFilePath(filePath: string) {
  return filePath.search(" ") === -1 ? filePath : pathToFileURL(filePath);
}

console.debug(`Source directory is ${srcDir}.`);

const files = (await readdir(srcDir))
  .filter((fn) => /\.ts$/i.test(fn))
  .map((fn) => resolve(srcDir, fn));

console.debug(`Files: ${files.map(getLinkableFilePath).join("\n\t")}`);

// Determine if the output directory needs to be created.
const needToCreateOutput = await access(outdir, F_OK).then(
  () => false,
  (reason) => reason
);
if (needToCreateOutput) {
  console.log(`Creating directory ${outdir}`);
  await mkdir(outdir);
}

const readmeTemplatePath = join(rootDir, "README.template.md");
const readmePath = join(rootDir, "README.md");
const htmlPath = join(outdir, "index.html");

const buildResults = await build({
  entryPoints: files,
  minify: true,
  bundle: true,
  write: false,
  outdir,
  metafile: true,
});

// Copy the template, overwriting the README.md.
await copyFile(readmeTemplatePath, readmePath);

let readmeFileHandle: FileHandle | null = null;

const extensionRe = /\.m?[tj]s$/i;

const jsdom = new JSDOM("<!DOCTYPE html>", {
  contentType: "text/html",
});

const document = jsdom.window.document;

const h1 = document.createElement("h1");
h1.textContent = "Bookmarklets";

const p = document.createElement("p");

p.textContent = "Drag any of the links to your toolbar folder to create a bookmarklet."

document.body.append(h1, p);

document.title = "Bookmarklets";

function createListItemForOutputFile(outputFile: OutputFile) {
  const name = basename(outputFile.path).replace(extensionRe, "");

  const a = document.createElement("a");
  a.href = `javascript:${outputFile.text}`;
  a.text = a.title = name;

  const li = document.createElement("li");
  li.appendChild(a);

  return li;
}

const frag = document.createDocumentFragment();

try {
  readmeFileHandle = await open(readmePath, O_APPEND);
  for (const outputFile of buildResults.outputFiles) {
    // Get just the filename w/o directory.
    const name = basename(outputFile.path)
      // Remove the file extension.
      .replace(extensionRe, "");
    try {
      await readmeFileHandle.appendFile(
        `\n## ${name}\n\n` + "```javascript\njavascript:"
      );
      await readmeFileHandle.appendFile(outputFile.contents);
      await readmeFileHandle.appendFile("```\n");
    } catch (appendError) {
      console.error(
        `Error writing ${name}'s content to ${readmePath}`,
        appendError
      );
    }

    const li = createListItemForOutputFile(outputFile);
    frag.append(li);
  }
} finally {
  await readmeFileHandle?.close();
}

const ul = document.createElement("ul");
ul.append(frag);

document.body.append(ul);

const html = jsdom.serialize();
try {
  await writeFile(htmlPath, html, {
    encoding: "utf8",
  });
} catch (error) {
  console.error(`Error writing to ${htmlPath}.`, error);
}
