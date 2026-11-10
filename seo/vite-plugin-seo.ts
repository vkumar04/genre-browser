import type { Plugin } from "vite";
import { genres, categories } from "../src/data/genres.ts";

const TITLE = "Genre Browser · 60 Genres for the WRDS 1103 Genre Project";
const DESCRIPTION =
  "Explore 60 genres — op-eds, podcasts, infographics and more — with each one's audience, purpose, and a project idea. Then brainstorm with AI.";
const OG_ALT = "Genre Browser: explore 60 genres for the WRDS 1103 Genre Project, then brainstorm with AI.";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Absolute site URL, needed for canonical, og:url, og:image and the sitemap.
 * Order: SITE_URL (set it in Railway to pin a custom domain) → Railway's generated domain → none.
 */
export function resolveSiteUrl(env = process.env): string | null {
  const raw = env.SITE_URL || (env.RAILWAY_PUBLIC_DOMAIN ? `https://${env.RAILWAY_PUBLIC_DOMAIN}` : "");
  return raw ? raw.replace(/\/+$/, "") : null;
}

export function seo(): Plugin {
  const site = resolveSiteUrl();
  const abs = (p: string) => (site ? `${site}${p}` : p);
  const today = new Date().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        ...(site && { "@id": `${site}/#website`, url: `${site}/` }),
        name: "Genre Browser",
        description: DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "LearningResource",
        name: TITLE,
        description: DESCRIPTION,
        ...(site && { url: `${site}/`, image: abs("/og-image.jpg") }),
        learningResourceType: "Reference",
        educationalLevel: "Undergraduate",
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        about: ["Genre", "Rhetoric", "Writing", "Multimodal composition"],
        inLanguage: "en",
        isAccessibleForFree: true,
        accessibilityFeature: ["highContrastDisplay", "readingOrder", "structuralNavigation", "alternativeText"],
        accessibilityHazard: "none",
        hasPart: {
          "@type": "DefinedTermSet",
          name: "Genres",
          hasDefinedTerm: genres.map((g) => ({
            "@type": "DefinedTerm",
            name: g.name,
            description: `${g.purpose}. Audience: ${g.audience}. Example: ${g.ex}.`,
            termCode: g.cat,
          })),
        },
      },
    ],
  };

  const head = [
    `<meta name="description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#312e81" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1b4b" />`,
    site && `<link rel="canonical" href="${site}/" />`,
    `<link rel="icon" href="/favicon.ico" sizes="48x48" />`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    // Open Graph
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Genre Browser" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    site && `<meta property="og:url" content="${site}/" />`,
    `<meta property="og:image" content="${abs("/og-image.jpg")}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(OG_ALT)}" />`,
    // Twitter / X
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(TITLE)}" />`,
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="twitter:image" content="${abs("/og-image.jpg")}" />`,
    `<meta name="twitter:image:alt" content="${esc(OG_ALT)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");

  // Crawlable fallback: the full genre list as real HTML for no-JS crawlers and readers.
  const noscript = `<noscript>
      <main style="font-family:system-ui,sans-serif;max-width:860px;margin:0 auto;padding:24px;line-height:1.5">
        <h1>Genre Browser</h1>
        <p>${esc(DESCRIPTION)} Turn on JavaScript for search, filters, and AI brainstorm links.</p>
        ${categories
          .filter((c) => c !== "All")
          .map(
            (c) => `<section><h2>${esc(c)}</h2><dl>${genres
              .filter((g) => g.cat === c)
              .map(
                (g) =>
                  `<dt><strong>${esc(g.name)}</strong> (${esc(g.modes.join(", "))})</dt><dd>Audience: ${esc(g.audience)}. Purpose: ${esc(g.purpose)}. Example: ${esc(g.ex)}.</dd>`,
              )
              .join("")}</dl></section>`,
          )
          .join("\n        ")}
      </main>
    </noscript>`;

  return {
    name: "genre-browser-seo",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return html
          .replace(/<title>.*?<\/title>/s, `<title>${esc(TITLE)}</title>\n    ${head}`)
          .replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript}`);
      },
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ""}`,
      });
      if (site) {
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
        });
      } else {
        this.warn("No SITE_URL or RAILWAY_PUBLIC_DOMAIN set: skipping canonical, og:url, absolute og:image and sitemap.xml");
      }
    },
  };
}
