# Bookmarklets

This repository contains code for bookmarklets. If you don't know what a bookmarklet is, see [Bookmarklets on Wikipedia].

To use, go to <https://jeffjacobson.github.io/bookmarklets> and then drag any of the links on that page to your browsers bookmarks toolbar.

[Bookmarklets on Wikipedia]:https://en.wikipedia.org/wiki/Bookmarklet

<!-- Bookmarklets will be written below. -->

## Add links to npmjs package page

```javascript
javascript:(()=>{var s=class extends Error{constructor(o,n,t){super(`Value "${o}" does not match expected format ${n}`,t)}};var f=/^https?:\/\/(?:\w+\.)npmjs\.com\/(package)\/(?:(?<org>@[^/]+)\/)?(?<packageName>[^/]+)/i;function g(e){return e instanceof URL?e:new URL(e)}function E(e,o=!0){e=g(e);let n=e.href.match(f);if(!n||!n.groups){if(o)throw new s(e.href,f);return null}let t=n.groups,r="org"in t?t.org:null,a=t.packageName;return{org:r,packageName:a}}var d=/^(?<version>(?:\d+\.)+(?:\d+))(?:[-.](?<label>\S*))?/;function k(e,o){let n;if(typeof e=="string"){if(n=e.match(d),!n){if(o)throw new s(e,d);return null}}else n=e;return n[0]}function N(){let e=document.querySelector("main > #top > div:nth-child(1) > span:nth-child(2)")?.textContent?.match(/^\S+/)?.at(0)||null;return e?k(e,!1):null}function h(e,o="https://yarnpkg.com"){let n=g(e);return new URL(n.pathname,o)}function u(e,o){let n=g(e),{org:t,packageName:r}=E(n),a=N(),l=[];t&&l.push(`@${t.replace(/^@/,"")}`),l.push(r);let c=l.join("/");return a&&(c+=`@${a}`),c.endsWith("/")||(c+="/"),new URL(c,o)}var m=new Map([["yarn",h],["jsDelivr",e=>u(e,"https://cdn.jsdelivr.net/npm/")],["unpkg",e=>u(e,"https://unpkg.com/")]]);function*x(e=location.href,o=m){for(let[n,t]of o)try{let r=t(e);yield[n,r]}catch(r){if(r instanceof Error)yield[n,r];else throw r}}function*y(e=location.href,o=m){for(let[n,t]of x(e,o)){if(t instanceof Error){console.error(`Error generating ${n} URL`,t);continue}let r=document.createElement("a");r.href=t.href,r.text=t.href,r.target="_blank",r.rel="noopener noreferrer nofollow",yield[n,r]}}function*w(e=location.href,o=m){for(let[n,t]of y(e,o)){let r=document.createElement("dt");r.innerText=n;let a=document.createElement("dd");a.append(t),yield[r,a]}}var U=document.createElement("dl");U.append(...[...w()].flat());var R=document.createDocumentFragment(),p=document.createElement("h3");p.innerText="CDN Links";R.append(p,U);var L="main div#top > :last-child",i=document.querySelector(L);if(!i)console.error(`Could not find container using "${L}".`);else{let e=i.querySelector("h3");e&&p.classList.add(...e.classList),i.insertBefore(R,i.firstElementChild)}})();
```

## Clean YouTube URLs

```javascript
javascript:(()=>{location.origin.search(/youtube\.com/)||console.warn("This bookmarklet is only designed for YouTube.");var e=new URL(location.href),r=/^v$/i,s=Array.from(e.searchParams.keys()).filter(o=>!r.test(o));console.log(s);s.forEach(o=>e.searchParams.delete(o));history.pushState(e.searchParams,document.title,e);})();
```

## Costco List Total

```javascript
javascript:(()=>{function u(){let c=document.querySelectorAll("li.item-position"),t=0;for(let e of c){console.group(`sequence ${e.attributes.getNamedItem("sequence")?.value}`);let l=e.querySelector("[id^='quantity_']");if(l?.value==null)throw new TypeError("Could not get a value.");let o=parseInt(l.value),r=e.querySelector("[automation-id^='itemPrice_']");if(r?.textContent==null)throw new TypeError("could not find item price <span>");let n=parseFloat(r.textContent.replace("$","")),i=n*o;console.log("quantity",o),console.log("price",n),console.log("sub total",n*o),t+=i,console.groupEnd()}return console.log("total",t),t}u();})();
```

## Find Feeds

```javascript
javascript:(()=>{function g(){let n=["application/atom+xml","application/rss+xml","application/feed+json","application/activity+json"].map(o=>`link[type="${o}"]`).join(",");return document.querySelectorAll(n)}function E(e){let n=document.createElement("a");n.href=e.href;let t=document.createElement("code");return t.textContent=e.outerHTML,n.appendChild(t),n}function k(e){let n=document.createDocumentFragment(),t=document.createElement("ul");for(let o of Array.from(e)){let r=E(o),l=document.createElement("li");l.appendChild(r),t.appendChild(l)}return n.appendChild(t),n}function y(e){return e.replace(/[\s]+/i,"-").toLowerCase()}function A(){let e=["RSS","ATOM","JSON Feed","JsonFeed","feed"],n=e.map(s=>[`a[title*='${s}'i]`,`a[href*='${s}'i]`].join(",")).join(","),t=document.querySelectorAll(n);if(t.length<1)return null;let o=new RegExp(`\b(?:${e.map(s=>`(?:${s})`).join("|")})\b`,"ig");function*r(s=t,L=o){for(let i of s){let h=i.cloneNode(!0),a=document.createElement("li");a.appendChild(h);let u=[i.href,i.title].filter(c=>c!=null).map(c=>c.match(L)).filter(c=>c!=null).map(c=>y(c[0]));u&&a.classList.add(...u),yield a}}let l=document.createDocumentFragment();l.append(...r(t));let m=document.createElement("ul");return m.append(l),m}function T(){let e=document.createElement("dialog");e.classList.add(f);let n=document.createElement("button");n.innerText="Close",e.append(n),n.addEventListener("click",()=>{e.close(),e.remove()},{once:!0,passive:!0});let t=document.body.querySelectorAll(`.${f}`);return t&&t.forEach(o=>o.remove()),e}var f="feeds-cc0a1783-0569-458e-89d1-28dd6872bbef",p=g(),d=A();if(!p.length&&!d)alert("No feed links were found.");else{let e=k(p);d&&e.append(d);let n=T();n.append(e),document.body.prepend(n),n.showModal()}})();
```

## Get all video links on NHK World page

```javascript
javascript:(()=>{var d=/.+\/ondemand\/video\/\d+\b/gi;function a(){return[...new Set([...document.body.querySelectorAll("a[href*='ondemand/video/']")].filter(e=>d.test(e.href)).map(e=>`"${e.href}"`))]}function l(e){if(!e||e.length<0){alert(`Failed to find any URLs matching the pattern "${d.source}".`);return}let t=document.createElement("dialog"),n=document.createElement("code");n.classList.add("language-shell"),n.textContent=`yt-dlp ${e.join(" ")}`;let o=document.createElement("button");o.textContent="Close",t.append(n,o),document.body.appendChild(t),o.addEventListener("click",()=>{t.close(),t.remove()}),t.showModal()}var c=a();l(c);})();
```

## Get Bandcamp track pages

```javascript
javascript:(()=>{var c="li[data-item-id]";function l(t){let{itemId:r,bandId:e}=t.dataset,s=t.querySelector("a"),o=t.querySelector("p"),n=s?.href,a=o?.innerText.trim();return{itemId:r,bandId:e,title:a,url:n}}function*m(t){for(let r of t){let e=l(r);e.url!=null?yield e:console.warn("List item does not appear to have a valid URL.",e)}}async function i(t){let e=await(await fetch(t)).text(),n=new DOMParser().parseFromString(e,"text/html").querySelectorAll(c);return m(n)}(async()=>{let t=await i(location.href),r=new Array;for(let e of t)r.push(e.url);return r.join(`
`)})();})();
```

## Get Runtimes from playlist

```javascript
javascript:(()=>{function s(t){return t.endsWith("s")||(t+="s"),t}var e=class{hours=0;minutes=0;seconds=0;get totalSeconds(){return this.hours*60*60+this.minutes*60+this.seconds}constructor(r){function n(i,o){return o===0?parseInt(i):(i=s(i),i)}let u=i=>{let[o,a]=i.split(" ",2).map(n);return this[a]=o,[a,o]};r.split(", ").forEach(u)}},l=".ytd-thumbnail-overlay-time-status-renderer[aria-label]";function*c(t=document.body.querySelectorAll(l)){for(let r of t){let n=r.getAttribute("aria-label");if(!n){console.warn("Aria label not found in element",r);continue}try{yield new e(n)}catch{console.warn(`Could not parse ${n} into a ${e.name} object.`)}}}function g(t){let r=0;for(let n of t)r+=n.totalSeconds}var D=g(c());console.log(D);})();
```

## Get YouTube Subscription OPML

```javascript
javascript:(()=>{function c(e){let o=typeof e=="string"?new URL(e):e,t=o.pathname.split("/"),n=t[t.length-1];return new URL(`feeds/videos.xml?channel_id=${n}`,o)}function*u(){if(!/youtube\.com/i.test(location.host))throw new Error(`This function is meant for use with YouTube. Current URL, ${location}, does not appear to be on YouTube.`);document.body.querySelector("button#button.style-scope.yt-icon-button[aria-pressed='false']")?.click();let e=document.body.querySelector("ytd-guide-collapsible-entry-renderer.style-scope.ytd-guide-section-renderer");e?.hasAttribute("can-show-more")&&e.querySelector("a")?.click();let o=e?.querySelectorAll("ytd-guide-entry-renderer[line-end-style] a[href]");if(o)for(let t of o)yield{href:new URL(t.href),feedUrl:c(t.href),title:t.title}}function d(e){return[`<outline title="${e.title}">`,`<outline type="rss" title="${e.title}" text="${e.title}" version="RSS"`,`xmlUrl="${e.feedUrl}"`,`htmlUrl="${e.href}"/>`,"</outline>","</outline>"].join("")}function s(){let e=new Array('<opml version="1.0">',"<head>","<title>YouTube feeds</title>",`<dateCreated>${new Date}</dateCreated>`,"</head>","<body>");for(let o of u()){let t=d(o);e.push(t)}return e.push("</body></opml>"),e.join("")}function m(e,o){let t=document.createElement("header"),n=document.createElement("button");return n.innerText="Close",t.append(n),e!=null?(n.addEventListener("click",()=>{e.close(),e.remove()},{once:!0,passive:!0}),o&&e.append(t),t):{header:t,closeButton:n}}var i=class extends HTMLDialogElement{constructor(){super(),this.attachShadow({mode:"open"});let o=m(this);this.shadowRoot?.append(o)}},l="closeable-dialog";function a(){return customElements.define(l,i,{extends:"dialog"})}try{window.customElements.get(l)||a();let e=s(),o=new Blob([e],{type:"text/opml"}),t=URL.createObjectURL(o),n=document.createElement(l),r=document.createElement("a");r.href=t,r.classList.add("opml"),r.text="YouTube subscriptions OPML",n.appendChild(r)}catch{alert("Could not generate OPML.")}})();
```

## Github - Check all closed pull requests

```javascript
javascript:(()=>{var t=[...document.body.querySelectorAll(".octicon-git-pull-request-closed")].map(e=>e.parentElement?.parentElement?.parentElement?.parentElement?.querySelector("input[type=checkbox]"));for(let e of t)e&&(e.checked=!0);})();
```

## Go to Amazon Smile

```javascript
javascript:(()=>{var o=/(?<=^https:\/\/)(?:[^.]+\.)?(amazon\.co(?:m|(?:\.[a-z]{2})))/i,a=location.href.replace(o,"smile.$1");open(a,"_top");})();
```

## Hide Sponsored posts on Facebook

```javascript
javascript:(()=>{var n=document.body.querySelectorAll("[href*='utm_medium=paid_social']"),t=Array.from(n).map(e=>e.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement);t.forEach(e=>e&&e.hidden===!0);console.log(t);})();
```

## Remove playlist params from YouTube video links

```javascript
javascript:(()=>{if(/\w+\.youtube\.com/i.test(location.hostname)){let e=new URL(location.href);e.searchParams.has("v")&&(["list","index"].forEach(o=>{e.searchParams.delete(o)}),window.confirm("Are you sure you want to reload this page without the playlist?")&&open(e,"self"))}var r=document.body.querySelectorAll("a[href^='/watch?']"),a=["list","index"];for(let e of r){let o=new URL(e.href);a.forEach(t=>o.searchParams.delete(t)),e.href=o.href}})();
```

## YouTube convert Shorts link to regular

```javascript
javascript:(()=>{function n(e){let o=/(?<root>https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[^/]+)/i;console.debug("shorts URL",e);let r=e.match(o);if(!r)return console.warn("This does not appear to be a YouTube Shorts URL"),e;if(r.groups){let s=r.groups.videoId;console.debug("video ID",s);let t=`${r.groups.root}watch?v=${r.groups.videoId}`;return console.debug("output URL",t),t}return e}function c(){let e=document.body.querySelectorAll("a[href*='/shorts/']");for(let o of e){if(!o)continue;let r=n(o.href);o.href!==r&&(console.log(`replacing ${o.href} with ${r}`),o.href=r)}}function i(){let e=location.href,o=n(e);e!==o&&open(o)}i();c();})();
```
