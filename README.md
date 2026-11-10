# Genre Browser — WRDS 1103

Accessible, animated browser of 60 genres for the EIP Part 3 Genre Project.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion

## Develop
```bash
npm install
npm run dev
```

## Deploy
From your Mac: `./deploy.sh` — creates the public GitHub repo, pushes, and deploys with the Railway CLI.

### Railway
`.railway/railway.ts` (Infrastructure as Code) builds with `npm run build`, serves `dist/` with `npm start` on `$PORT`, and sets `SITE_URL` from the service's public domain.

## Brainstorm with AI
Each genre offers three kinds of prompt (Ideas, Outline, Examples) and opens Claude or ChatGPT with the prompt prefilled.
Gemini has no URL prefill, so its button copies the prompt to the clipboard and opens Gemini for pasting.

## Accessibility
- Native buttons, a labeled search, and a category filter that takes one Tab stop (arrow keys move between categories)
- Screen readers hear the result count after typing pauses; selections and closing are announced too
- Mobile/tablet details open in a bottom drawer that keeps focus inside, closes with Esc, and returns focus to the card
- Skip link, `/` jumps to search, visible focus rings, a light and dark theme with text contrast ≥ 4.5:1, Windows High Contrast support
- All Motion animation respects `prefers-reduced-motion`
- Scanned with axe-core (WCAG 2.2 AA): 0 violations on desktop (light and dark), phone, and tablet

## SEO
`seo/vite-plugin-seo.ts` adds at build time: title/description, Open Graph + Twitter cards (`public/og-image.jpg`),
canonical URL, JSON-LD (WebSite + LearningResource listing all 60 genres), a `<noscript>` genre list for crawlers,
`robots.txt`, and `sitemap.xml`. Icons and `site.webmanifest` live in `public/`.

The absolute site URL comes from `SITE_URL` (declared in `.railway/railway.ts`), falling back to `RAILWAY_PUBLIC_DOMAIN`.
For a custom domain, change `SITE_URL` there, then `railway config apply`.
