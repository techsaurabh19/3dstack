import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const SITE_URL = "https://3dstack.in";

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const replaceTag = (html, regex, replacement) => {
  if (!regex.test(html)) {
    throw new Error(`Prerender template is missing an expected tag: ${regex}`);
  }
  return html.replace(regex, replacement);
};

async function main() {
  const { render, PAGE_META, FAQ_ITEMS } = await import(ssrEntry);
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

  for (const [routePath, meta] of Object.entries(PAGE_META)) {
    const canonicalUrl = `${SITE_URL}${routePath === "/" ? "" : routePath}`;
    const title = escapeAttr(meta.title);
    const description = escapeAttr(meta.description);
    const appHtml = render(routePath);

    let html = template;
    html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
    html = replaceTag(
      html,
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`
    );
    html = replaceTag(
      html,
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
    html = replaceTag(
      html,
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`
    );
    html = replaceTag(
      html,
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${description}" />`
    );
    html = replaceTag(
      html,
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    html = replaceTag(
      html,
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${title}" />`
    );
    html = replaceTag(
      html,
      /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${description}" />`
    );

    if (routePath === "/documentation" && Array.isArray(FAQ_ITEMS)) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      };
      html = html.replace(
        "</head>",
        `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head>`
      );
    }

    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    const outDir = routePath === "/" ? distDir : path.join(distDir, routePath);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`Prerendered ${routePath} -> ${path.relative(root, path.join(outDir, "index.html"))}`);
  }

  fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
