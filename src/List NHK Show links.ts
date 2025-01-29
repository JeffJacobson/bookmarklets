const episodeArticles = document.body.querySelectorAll<HTMLAnchorElement>(
	"article[id^='shows_program_episodes'] a",
);

function anchorToItem({ href, text }: HTMLAnchorElement) {
	return [text || href, href] as [name: string, url: string];
}

function* enumerateAnchors(anchors: NodeListOf<HTMLAnchorElement>) {
	for (const a of anchors) {
		yield anchorToItem(a);
	}
}

const output = [...enumerateAnchors(episodeArticles)].map(
	([name, url]) => `# ${name}\r\n${url}` as const,
).join("\r\n")

console.log(output);

alert("yt-dlp list written to console");
