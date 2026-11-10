import { AudioLines, Image, PenLine, type LucideIcon } from "lucide-react";
import type { Mode } from "@/data/genres";
import { cn } from "@/lib/utils";

export const MODE_META: Record<Mode, { icon: LucideIcon; color: string }> = {
  Written: { icon: PenLine, color: "text-mode-written" },
  Visual: { icon: Image, color: "text-mode-visual" },
  Audio: { icon: AudioLines, color: "text-mode-audio" },
};

/** Inline mode list for cards. Icons are decorative; the text carries the meaning (not color alone). */
export function ModeTags({ modes, className }: { modes: Mode[]; className?: string }) {
  return (
    <span className={cn("flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-muted-foreground", className)}>
      <span className="sr-only">Modes: </span>
      {modes.map((m, i) => {
        const { icon: Icon, color } = MODE_META[m];
        return (
          <span key={m} className="inline-flex items-center gap-1">
            <Icon aria-hidden="true" className={cn("size-3.5", color)} />
            {m}
            {i < modes.length - 1 && <span className="sr-only">,</span>}
          </span>
        );
      })}
    </span>
  );
}
