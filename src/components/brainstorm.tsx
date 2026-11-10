import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, BookOpenText, Check, Copy, Lightbulb, ListTree, Sparkles, type LucideIcon } from "lucide-react";
import type { Genre } from "@/data/genres";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type PromptKind = "ideas" | "outline" | "examples";


const PROMPTS: Record<PromptKind, { label: string; icon: LucideIcon; build: (g: Genre) => string }> = {
  ideas: {
    label: "Ideas",
    icon: Lightbulb,
    build: (g) =>
      `I'm working in the "${g.name}" genre for my WRDS 1103 genre project. My research topic is: [your topic]. ` +
      `Give me 5 creative angles, who the audience would be, and the rhetorical moves this genre uses.`,
  },
  outline: {
    label: "Outline",
    icon: ListTree,
    build: (g) =>
      `Help me outline a piece in the "${g.name}" genre for my WRDS 1103 genre project on [your topic]. ` +
      `Cover the genre's typical conventions and structure, and show how to adapt my research into it.`,
  },
  examples: {
    label: "Examples",
    icon: BookOpenText,
    build: (g) =>
      `What makes a strong piece in the "${g.name}" genre? Describe 3 typical or well-known examples, ` +
      `the conventions they share, and how I could use them as models for my WRDS 1103 genre project.`,
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
  const [copied, setCopied] = useState<string | null>(null);
  const prompt = PROMPTS[kind].build(genre);
  const headingId = `brainstorm-${genre.name.replace(/\W+/g, "-")}`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 3500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async (target: string, label: string) => {
    const ok = await copyText(prompt);
    setCopied(ok ? target : null);
    setNotice(ok ? label : "Couldn't copy. Select the prompt text instead.");
  };

  return (
    <section aria-labelledby={headingId} className="mt-5 border-t pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 id={headingId} className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles aria-hidden="true" className="size-4 text-[var(--cat)]" />
          Brainstorm with AI
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-8 text-muted-foreground hover:text-foreground"
          onClick={() => copy("prompt", "Prompt copied.")}
        >
          {copied === "prompt" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied === "prompt" ? "Copied" : "Copy prompt"}
        </Button>
      </div>

      <ToggleGroup
        type="single"
        variant="outline"
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
              className="h-9 flex-1 text-xs data-[state=on]:bg-[var(--cat-soft)] data-[state=on]:text-[var(--cat-ink)] data-[state=on]:font-semibold"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="mb-3 rounded-lg bg-muted/60 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground"
        >
          <span className="sr-only">Prompt: </span>
          {prompt}
        </motion.p>
      </AnimatePresence>

      <ul className="flex flex-col gap-2">
        {ASSISTANTS.map((a) => {
          const justCopied = copied === a.id;
          return (
            <li key={a.id}>
              <motion.a
                href={a.href(prompt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (a.copies) void copy(a.id, `Prompt copied. Paste it into ${a.name}.`);
                }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-2.5 transition-colors outline-none hover:border-[var(--cat)] hover:bg-[var(--cat-soft)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{a.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {justCopied ? "Copied! Paste it in when it opens" : a.copies ? "Copies the prompt, then opens" : "Prompt filled in for you"}
                  </span>
                </span>
                {justCopied ? (
                  <Check aria-hidden="true" className="size-4 text-[var(--cat-ink)]" />
                ) : (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--cat-ink)]"
                  />
                )}
                <span className="sr-only"> (opens in a new tab)</span>
              </motion.a>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}
