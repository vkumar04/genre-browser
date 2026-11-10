import { motion, type Variants } from "motion/react";
import type { Genre } from "@/data/genres";
import { Badge } from "@/components/ui/badge";
import { Brainstorm } from "@/components/brainstorm";
import { MODE_META } from "@/components/mode-tags";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

const row: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: spring },
};

export function ModeBadges({ genre }: { genre: Genre }) {
  return (
    <motion.ul variants={row} className="flex flex-wrap gap-1.5" aria-label="Modes">
      {genre.modes.map((m) => {
        const { icon: Icon, color } = MODE_META[m];
        return (
          <li key={m}>
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              <Icon aria-hidden="true" className={cn(color)} />
              {m}
            </Badge>
          </li>
        );
      })}
    </motion.ul>
  );
}

/** Audience / purpose / example + AI brainstorm options. Shared by the desktop panel and the mobile sheet. */
export function GenreDetailBody({ genre }: { genre: Genre }) {
  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06, delayChildren: 0.08 }}>
      <dl className="space-y-4">
        <motion.div variants={row}>
          <dt className="mb-0.5 text-xs font-bold tracking-[0.06em] text-muted-foreground uppercase">
            Typical audience
          </dt>
          <dd className="text-[15px] leading-relaxed">{genre.audience}</dd>
        </motion.div>
        <motion.div variants={row}>
          <dt className="mb-0.5 text-xs font-bold tracking-[0.06em] text-muted-foreground uppercase">
            Rhetorical purpose
          </dt>
          <dd className="text-[15px] leading-relaxed">{genre.purpose}</dd>
        </motion.div>
        <motion.div variants={row}>
          <dt className="mb-1 text-xs font-bold tracking-[0.06em] text-muted-foreground uppercase">
            Example for your project
          </dt>
          <dd className="rounded-lg border-l-4 border-[var(--cat)] bg-[var(--cat-soft)] px-3.5 py-2.5 text-[15px] leading-relaxed text-foreground italic">
            {genre.ex}
          </dd>
        </motion.div>
      </dl>

      <motion.div variants={row}>
        <Brainstorm genre={genre} />
      </motion.div>
    </motion.div>
  );
}
