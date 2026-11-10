import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Lightbulb, ListTree, BookOpenText, type LucideIcon } from "lucide-react";
import type { Genre } from "@/data/genres";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type PromptKind = "ideas" | "outline" | "examples";

/** "a Podcast episode" / "an Infographic" */
const aOrAn = (name: string) => (/^[aeiou]/i.test(name) ? `an ${name}` : `a ${name}`);

const PROMPTS: Record<PromptKind, { label: string; icon: LucideIcon; build: (g: Genre) => string }> = {
  ideas: {
    label: "Ideas",
    icon: Lightbulb,
    build: (g) =>
      `Help me brainstorm ${aOrAn(g.name)} for my WRDS 1103 genre project. My research topic is: [your topic]. ` +
      `Give me 5 creative angles, who the audience would be, and the rhetorical moves this genre uses.`,
  },
  outline: {
    label: "Outline",
    icon: ListTree,
    build: (g) =>
      `Help me outline ${aOrAn(g.name)} for my WRDS 1103 genre project on [your topic]. ` +
      `Cover the genre's typical conventions and structure, and show how to adapt my research into it.`,
  },
  examples: {
    label: "Examples",
    icon: BookOpenText,
    build: (g) =>
      `What makes a strong ${g.name.toLowerCase()}? Describe 3 typical or well-known examples, the conventions they share, ` +
      `and how I could use them as models for my WRDS 1103 genre project.`,
  },
};

/** Claude and ChatGPT accept a prefilled prompt in the URL; Gemini doesn't, so we copy it for pasting. */
const ASSISTANTS = [
  { id: "claude", name: "Claude", href: (p: string) => `https://claude.ai/new?q=${encodeURIComponent(p)}`, copies: false },
  { id: "chatgpt", name: "ChatGPT", href: (p: string) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`, copies: false },
  { id: "gemini", name: "Gemini", href: () => "https://gemini.google.com/app", copies: true },
] as const;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function Brainstorm({ genre }: { genre: Genre }) {
  const [kind, setKind] = useState<PromptKind>("ideas");
  const [notice, setNotice] = useState("");
  const prompt = PROMPTS[kind].build(genre);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <section aria-labelledby={`brainstorm-${genre.name}`} className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--cat)_35%,transparent)] bg-[var(--cat-soft)]/60 p-3.5">
      <h3 id={`brainstorm-${genre.name}`} className="mb-2.5 text-sm font-bold">
        <span aria-hidden="true">🧠 </span>Brainstorm with AI
      </h3>

      <ToggleGroup
        type="single"
        spacing={1}
        value={kind}
        onValueChange={(v) => v && setKind(v as PromptKind)}
        aria-label="What should the AI help with?"
        className="mb-3 w-full"
      >
        {(Object.keys(PROMPTS) as PromptKind[]).map((k) => {
          const { label, icon: Icon } = PROMPTS[k];
          return (
            <ToggleGroupItem
              key={k}
              value={k}
              className="h-8 flex-1 rounded-full border border-[color-mix(in_srgb,var(--cat)_45%,transparent)] bg-card text-xs text-[var(--cat-ink)] hover:bg-card hover:text-[var(--cat-ink)] data-[state=on]:border-[var(--cat-ink)] data-[state=on]:bg-[var(--cat-ink)] data-[state=on]:text-[var(--cat-on)]"
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={kind}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mb-3 rounded-lg bg-card px-3 py-2 text-[13px] leading-relaxed text-secondary-foreground"
        >
          <span className="sr-only">Prompt: </span>“{prompt}”
        </motion.p>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-2">
        {ASSISTANTS.map((a, i) => (
          <motion.div key={a.id} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className={cn(
                "h-10 w-full rounded-xl px-2 font-semibold",
                i === 0
                  ? "bg-[var(--cat-ink)] text-[var(--cat-on)] shadow-[0_8px_18px_-8px_var(--cat)] hover:bg-[var(--cat-ink)] hover:brightness-110"
                  : "border border-[var(--cat-ink)] bg-card text-[var(--cat-ink)] hover:bg-card hover:brightness-95",
              )}
            >
              <a
                href={a.href(prompt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  if (!a.copies) return;
                  const ok = await copyText(prompt);
                  setNotice(ok ? `Prompt copied. Paste it into ${a.name}.` : `Copy the prompt above and paste it into ${a.name}.`);
                }}
              >
                {a.name}
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">
                  {a.copies ? " (copies the prompt, then opens in a new tab)" : " (opens in a new tab with this prompt)"}
                </span>
              </a>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
          {notice || "Opens in a new tab. Gemini: the prompt is copied for you to paste."}
        </p>
        <Button
          variant="ghost"
          size="xs"
          className="shrink-0 text-[var(--cat-ink)] hover:bg-card hover:text-[var(--cat-ink)]"
          onClick={async () => {
            const ok = await copyText(prompt);
            setNotice(ok ? "Prompt copied." : "Couldn't copy. Select the prompt text instead.");
          }}
        >
          {notice.startsWith("Prompt copied") ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          Copy prompt
        </Button>
      </div>
    </section>
  );
}
