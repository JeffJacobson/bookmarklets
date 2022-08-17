// https://www.npmjs.com/package/the-package-name

import FormatError from "../FormatError.js";
import { SemVer } from "semver";

// https://www.npmjs.com/package/@org-name/the-package-name
export const npmPackageUrlRe =
  /^https?:\/\/(?:\w+\.)npmjs\.com\/(package)\/(?:(?<org>@[^/]+)\/)?(?<packageName>[^/]+)/i;

function ensureUrl(npmUrl: string | URL) {
  return npmUrl instanceof URL ? npmUrl : new URL(npmUrl);
}

interface OrgAndPackageName {
  org: string | null;
  packageName: string;
}

function getOrgAndPackageName(url: URL | string): OrgAndPackageName;
function getOrgAndPackageName(
  url: URL | string,
  throwErrorOnMismatch: false
): OrgAndPackageName;
function getOrgAndPackageName(
  url: URL | string,
  throwErrorOnMismatch: true
): OrgAndPackageName | null;
function getOrgAndPackageName(
  url: URL | string,
  throwErrorOnMismatch = true
): OrgAndPackageName | null {
  url = ensureUrl(url);
  const packageUrlMatch = url.href.match(npmPackageUrlRe);

  // Throw error if not in expected format or if somehow
  // it does match but the Match didn't capture any "groups".
  if (!packageUrlMatch || !packageUrlMatch.groups) {
    if (throwErrorOnMismatch) {
      throw new FormatError(url.href, npmPackageUrlRe);
    } else {
      return null;
    }
  }

  const groups = packageUrlMatch.groups;
  const org = "org" in groups ? groups.org : null;
  const packageName = groups.packageName;

  return { org, packageName };
}

const versionNumberRe = /^(?<version>(?:\d+\.)+(?:\d+))(?:[-.](?<label>\S*))?/;

function toVersion(
  matchOrString: RegExpMatchArray | string,
  throwOnError: true
): SemVer;
function toVersion(
  matchOrString: RegExpMatchArray | string,
  throwOnError: false
): SemVer | null;
function toVersion(
  matchOrString: RegExpMatchArray | string,
  throwOnError: boolean
): SemVer | null {
  let match: RegExpMatchArray | null;
  if (typeof matchOrString === "string") {
    match = matchOrString.match(versionNumberRe);
    if (!match) {
      if (throwOnError) {
        throw new FormatError(matchOrString, versionNumberRe);
      } else {
        return null;
      }
    }
  } else {
    match = matchOrString;
  }
  const semVer = new SemVer(match[0]);
  return semVer;
}

export function getVersionNumberFromPage() {
  // Get text from spans.
  const versionNumber = document.querySelector("main > #top > div:nth-child(1) > span:nth-child(2)")?.textContent?.match(/^\S+/)?.at(0) || null;
  if (!versionNumber) return null;
  return new SemVer(versionNumber);
}

export function getYarnUrl(
  npmUrl: string | URL,
  newUrlBase: string | URL = "https://yarnpkg.com"
): URL {
  // Get string version of URL.
  const url = ensureUrl(npmUrl);

  return new URL(url.pathname, newUrlBase);
}

export type CdnUrlRoots = "https://cdn.jsdelivr.net/npm/" | "https://unpkg.com/";

/**
 * Converts an NPM URL into a JSDelivr URL.
 * @param npmUrl
 * @returns
 * * https://cdn.jsdelivr.net/npm/pkg-name@2.0.1/
 * * https://cdn.jsdelivr.net/npm/@orgName/pkg-name@2.0.1/
 * * https://cdn.jsdelivr.net/npm/pkg-name/
 * * https://cdn.jsdelivr.net/npm/@orgName/pkg-name/
 */
export function getCdnUrl(npmUrl: string | URL, rootUrl: CdnUrlRoots): URL {
  // Get string version of URL.
  const url = ensureUrl(npmUrl);

  const { org, packageName } = getOrgAndPackageName(url);

  const versionNumber = getVersionNumberFromPage();

  // https://cdn.jsdelivr.net/npm/pkg-name@2.0.1/
  // https://cdn.jsdelivr.net/npm/@orgName/pkg-name@2.0.1/
  // https://unpkg.com/@org/pkg@4.0.0-0/
  // https://unpkg.com/pkg@2.0.1/
  // https://unpkg.com/browse/@wsdot/elc-ui@4.0.0-0/
  // The "@..."" portion can be removed from URL to go to the latest version.


  const pathNameParts = [];
  if (org) {
    pathNameParts.push(`@${org.replace(/^@/, "")}`);
  }
  pathNameParts.push(packageName);
  let pathName = pathNameParts.join("/");
  if (versionNumber) {
    pathName += `@${versionNumber}`;
  }
  // Require trailing slash
  if (!pathName.endsWith("/")) {
    pathName += "/";
  }
  return new URL(pathName, rootUrl);
}

