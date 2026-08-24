#!/usr/bin/env node
// Regression check for layouts/_default/rss.xml.
//
// Dev-only: the site build itself needs no Node.js. Run after `hugo --minify`:
//   node scripts/verify-rss.js public/index.xml
//
// It decodes each <description> twice — once for XML, once for the HTML
// rendering a feed reader applies — and fails if any literal entity survives
// that, which is the signature of an escape level that is not paired with a
// decode (see SPEC.md -> RSS feed -> Escaping model). Also flags empty
// descriptions. Expected on a clean build: items=58 literal_entity=0.
const fs = require("fs");
const xml = fs.readFileSync(process.argv[2], "utf8");
const dec = (s) =>
  s.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
   .replace(/&hellip;/g, "…").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
   .replace(/&amp;/g, "&");
const ENT = /&(amp|lt|gt|quot|apos|hellip|ldquo|rdquo|#\d+);/;
const items = xml.split("<item>").slice(1);
let bad = 0;
for (const it of items) {
  const title = (it.match(/<title>([^<]*)<\/title>/) || [])[1] || "?";
  const raw = (it.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || "";
  const text = dec(dec(raw));
  if (ENT.test(text)) { bad++; const i = Math.max(0, text.search(ENT) - 25);
    console.log(`ENTITY ${title.slice(0,34)} ${JSON.stringify(text.slice(i, i+60))}`); }
  if (!text.trim()) console.log(`EMPTY ${title.slice(0,40)}`);
}
console.log(`items=${items.length} literal_entity=${bad}`);
