# Genre Browser — WRDS 1103

Accessible, animated browser of 60 genres for the EIP Part 3 Genre Project.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion

## Develop
```bash
npm install
npm run dev
```

## Deploy (Railway)
`railway.json` builds with `npm run build` and serves `dist/` with `npm start` on `$PORT`.

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
