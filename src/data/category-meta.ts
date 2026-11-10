/** Per-category color theme + emoji. The theme class sets --cat / --cat-soft / --cat-ink / --cat-on (see index.css). */
export const CATEGORY_META: Record<string, { theme: string; emoji: string }> = {
  All: { theme: "cat-all", emoji: "✨" },
  "Personal & Narrative": { theme: "cat-rose", emoji: "📖" },
  "Journalism & News": { theme: "cat-amber", emoji: "📰" },
  "Civic & Advocacy": { theme: "cat-emerald", emoji: "📣" },
  "Academic & Analytical": { theme: "cat-blue", emoji: "🎓" },
  "Visual & Design": { theme: "cat-violet", emoji: "🎨" },
  "Social & Digital": { theme: "cat-fuchsia", emoji: "📱" },
  "Audio & Video": { theme: "cat-orange", emoji: "🎙️" },
  "Creative & Interactive": { theme: "cat-teal", emoji: "🎲" },
  "Practical & Reference": { theme: "cat-sky", emoji: "🧭" },
};

export const catMeta = (cat: string) => CATEGORY_META[cat] ?? CATEGORY_META.All;
