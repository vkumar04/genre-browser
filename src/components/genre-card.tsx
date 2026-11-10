import { AnimatePresence, motion, type Variants } from "motion/react";
import { Check } from "lucide-react";
import type { Genre } from "@/data/genres";
import { catMeta } from "@/data/category-meta";
import { ModeTags } from "@/components/mode-tags";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring, delay: Math.min(i * 0.018, 0.4) },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

export function GenreCard({
  genre,
  index,
  selected,
  controls,
  onSelect,
}: {
  genre: Genre;
  index: number;
  selected: boolean;
  controls?: string;
  onSelect: (g: Genre) => void;
}) {
  const { theme, emoji } = catMeta(genre.cat);
  return (
    <motion.li layout custom={index} variants={cardVariants} initial="hidden" animate="show" exit="exit" className={theme}>
      <motion.button
        type="button"
        data-name={genre.name}
        aria-pressed={selected}
        aria-controls={controls}
        onClick={() => onSelect(genre)}
        whileHover={{ y: -4, rotate: index % 2 ? 0.8 : -0.8 }}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        className={cn(
          "group relative flex h-full min-h-[84px] w-full cursor-pointer flex-col gap-1.5 overflow-hidden rounded-xl border bg-card p-3.5 pl-4 text-left text-card-foreground shadow-xs",
          "transition-[border-color,box-shadow,background-color]",
          "hover:border-[var(--cat)] hover:shadow-[0_10px_24px_-10px_var(--cat)]",
          "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          selected && "border-[var(--cat-ink)] bg-[var(--cat-soft)] shadow-[0_10px_24px_-10px_var(--cat)] ring-1 ring-[var(--cat-ink)]",
        )}
      >
        {/* category color bar */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[var(--cat)] transition-[width] group-hover:w-2" />
        {/* emoji peeks in from the corner on hover/selection */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -right-1 -bottom-2 text-3xl opacity-0 transition-all duration-300 group-hover:-rotate-12 group-hover:opacity-25",
            selected && "-rotate-12 opacity-30",
          )}
        >
          {emoji}
        </span>
        <span className="flex items-start justify-between gap-2 text-sm leading-snug font-semibold">
          {genre.name}
          <AnimatePresence>
            {selected && (
              <motion.span
                aria-hidden="true"
                className="grid size-5 flex-none place-items-center rounded-full bg-[var(--cat-ink)] text-[var(--cat-on)]"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 18 }}
              >
                <Check className="size-3" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <ModeTags modes={genre.modes} className="relative" />
      </motion.button>
    </motion.li>
  );
}
