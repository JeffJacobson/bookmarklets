/**
 * Utilities for use with bookmarklets on GitHub web pages.
 */
import FormatError from "../FormatError.js";

const githubUrlRe = /^(?<=https?:github\.com\/)(?<orgOrUser>[^/]+)\/(?<repo>[^/]+)/i;
const githubIOUrlRe = /^(?<=https?:)(?<orgOrUser>[^/]+)\.github\.io\/(?<repo>[^/]+)/i;

/**
 * Returns a github.io URL for a github.com URL and vice-versa.
 * @param githubUrl Either a github.com repo URL or a GitHub Pages (github.io) URL
 * @returns Either a github.io or github.com URL.
 */
export function getGitHubUrl(githubUrl: string | URL) {
    const url = githubUrl instanceof URL ? githubUrl.href : githubUrl;

    let match = url.match(githubUrlRe);
    if (match && match.groups) {
        const { orgOrUser, repo } = match.groups;
        return `https://${orgOrUser}.github.io/${repo}/`;
    }
    match = url.match(githubIOUrlRe);
    if (match && match.groups) {
        const { orgOrUser, repo } = match.groups;
        return `https://github.com/${orgOrUser}/${repo}/`
    }

    // No matches. Throw error.
    const combinedRePattern = `(${[githubIOUrlRe, githubIOUrlRe].map(re => `(${re.source})`).join("|")})`;
    throw new FormatError(`${githubUrl}`, new RegExp(combinedRePattern));
}