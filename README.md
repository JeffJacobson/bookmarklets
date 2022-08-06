# Bookmarklets

This repository contains code for bookmarklets. If you don't know what a bookmarklet is, see [Bookmarklets on Wikipedia].

To use, drag the links below up to your browsers bookmarks toolbar.

[Bookmarklets on Wikipedia]:https://en.wikipedia.org/wiki/Bookmarklet

## clean-youtube-url.js

```javascript
javascript:(()=>{location.origin.search(/youtube\.com/)||console.warn("This bookmarklet is only designed for YouTube.");const e=new URL(location.href),o=/^v$/i,r=Array.from(e.searchParams.keys()).filter((e=>!o.test(e)));console.log(r),r.forEach((o=>e.searchParams.delete(o))),history.pushState(e.searchParams,document.title,e)})();
```

## Costco List Total.js

```javascript
javascript:!function(){const e=document.querySelectorAll("li.item-position");let o=0;for(const t of e){console.group(`sequence ${t.attributes.getNamedItem("sequence")?.value}`);const e=t.querySelector("[id^='quantity_']");if(null==e?.value)throw new TypeError("Could not get a value.");const n=parseInt(e.value),l=t.querySelector("[automation-id^='itemPrice_']");if(null==l?.textContent)throw new TypeError("could not find item price <span>");const r=parseFloat(l.textContent.replace("$","")),c=r*n;console.log("quantity",n),console.log("price",r),console.log("sub total",r*n),o+=c,console.groupEnd()}console.log("total",o)}();
```

## Find Feeds.js

```javascript
javascript:(()=>{function e(e){const n=document.createElement("a");n.href=e.href;const t=document.createElement("code");return t.textContent=e.outerHTML,n.appendChild(t),n}const n="feeds-cc0a1783-0569-458e-89d1-28dd6872bbef",t=function(){const e=["application/atom+xml","application/rss+xml","application/feed+json","application/activity+json"].map((e=>`link[type="${e}"]`)).join(",");return document.querySelectorAll(e)}(),o=function(){const e=["RSS","ATOM","JSON Feed","JsonFeed","feed"],n=e.map((e=>[`a[title*='${e}'i]`,`a[href*='${e}'i]`].join(","))).join(","),t=document.querySelectorAll(n);if(t.length<1)return null;const o=new RegExp(`\b(?:${e.map((e=>`(?:${e})`)).join("|")})\b`,"ig"),c=document.createDocumentFragment();c.append(...function*(e=t,n=o){for(const t of e){const e=t.cloneNode(!0),o=document.createElement("li");o.appendChild(e);const c=[t.href,t.title].filter((e=>null!=e)).map((e=>e.match(n))).filter((e=>null!=e)).map((e=>e[0].replace(/[\s]+/i,"-").toLowerCase()));c&&o.classList.add(...c),yield o}}(t));const l=document.createElement("ul");return l.append(c),l}();if(!t.length&&!o){return void alert("No feed links were found.")}const c=function(n){const t=document.createDocumentFragment(),o=document.createElement("ul");for(const t of Array.from(n)){const n=e(t),c=document.createElement("li");c.appendChild(n),o.appendChild(c)}return t.appendChild(o),t}(t);o&&c.append(o);const l=function(){const e=document.createElement("dialog");e.classList.add(n);const t=document.createElement("button");t.innerText="Close",e.append(t),t.addEventListener("click",(()=>{e.close(),e.remove()}),{once:!0,passive:!0});const o=document.body.querySelectorAll(`.${n}`);return o&&o.forEach((e=>e.remove())),e}();l.append(c),document.body.prepend(l),l.showModal()})();
```

## Go to Amazon Smile.js

```javascript
javascript:(()=>{const o=location.href.replace(/(?<=^https:\/\/)(?:[^.]+\.)?(amazon\.co(?:m|(?:\.[a-z]{2})))/i,"smile.$1");open(o,"_top")})();
```

## Hide Sponsored posts on Facebook.js

```javascript
javascript:(()=>{const e=document.body.querySelectorAll("[href*='utm_medium=paid_social']"),n=Array.from(e).map((e=>e.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement));n.forEach((e=>e&&!0===e.hidden)),console.log(n)})();
```

## Remove playlist params from YouTube video links.js

```javascript
javascript:(()=>{const e=document.body.querySelectorAll("a[href^='/watch?']"),r=["list","index"];for(const o of e){const e=new URL(o.href);r.forEach((r=>e.searchParams.delete(r))),o.href=e.href}})();
```

## YouTube convert Shorts link to regular.js

```javascript
javascript:(()=>{function o(o){console.debug("shorts URL",o);const e=o.match(/(?<root>https:\/\/(?:www\.)?youtube.com\/)shorts\/(?<videoId>[^/]+)/i);if(!e)return console.warn("This does not appear to be a YouTube Shorts URL"),o;if(e.groups){const o=e.groups.videoId;console.debug("video ID",o);const t=`${e.groups.root}watch?v=${e.groups.videoId}`;return console.debug("output URL",t),t}return o}!function(){const e=location.href,t=o(e);e!==t&&open(t)}(),function(){const e=document.body.querySelectorAll("a[href*='/shorts/']");for(const t of e){if(!t)continue;const e=o(t.href);t.href!==e&&(console.log(`replacing ${t.href} with ${e}`),t.href=e)}}()})();
```

