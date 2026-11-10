import { LayoutGroup, motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { categories } from "@/data/genres";
import { catMeta } from "@/data/category-meta";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

/**
 * Single-select category filter (Radix ToggleGroup: arrow keys move between options,
 * so the whole group is one Tab stop). Each pill wears its category color; the
 * selected pill's fill slides between options via a shared layoutId.
 */
export function CategoryFilter({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <LayoutGroup id="cats">
      <ToggleGroup
        type="single"
        spacing={1.5}
        value={value}
        onValueChange={(v) => v && onChange(v)}
        aria-label="Filter by category"
        className="-mx-4 w-[calc(100%+2rem)] max-w-none flex-nowrap overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:thin] sm:mx-0 sm:w-full sm:px-0 md:flex-wrap md:overflow-visible md:pb-1"
      >
        {categories.map((c) => {
          const { theme, emoji } = catMeta(c);
          const on = c === value;
          return (
            <ToggleGroupItem
              key={c}
              value={c}
              className={cn(
                theme,
                "relative isolate h-8 gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--cat)_45%,transparent)] bg-[var(--cat-soft)] px-3 text-[13px] text-[var(--cat-ink)]",
                "hover:border-[var(--cat)] hover:bg-[var(--cat-soft)] hover:text-[var(--cat-ink)]",
                "data-[state=on]:border-transparent data-[state=on]:bg-transparent data-[state=on]:text-[var(--cat-on)]",
              )}
            >
              {on && (
                <motion.span
                  layoutId="cat-indicator"
                  className="cat-indicator absolute -inset-px -z-10 rounded-full bg-[var(--cat-ink)] shadow-[0_4px_14px_-4px_var(--cat)]"
                  transition={spring}
                />
              )}
              <motion.span
                aria-hidden="true"
                animate={on ? { rotate: [0, -15, 12, 0], scale: [1, 1.3, 1] } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {emoji}
              </motion.span>
              {c}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </LayoutGroup>
  );
}
