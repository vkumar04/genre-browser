import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

export type Burst = { id: number; x: number; y: number };

const COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#d946ef", "#14b8a6", "#f97316"];

/** Decorative confetti burst. Hidden from assistive tech; skipped entirely for reduced motion. */
export function Confetti({ burst }: { burst: Burst | null }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 70 + Math.random() * 110;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 40,
          rot: Math.random() * 540 - 270,
          color: COLORS[i % COLORS.length],
          w: 6 + Math.random() * 6,
          round: i % 3 === 0,
        };
      }),
    // new randomness per burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst?.id],
  );
  if (reduce || !burst) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <AnimatePresence>
        {pieces.map((p, i) => (
          <motion.span
            key={`${burst.id}-${i}`}
            className="absolute block"
            style={{
              left: burst.x,
              top: burst.y,
              width: p.w,
              height: p.round ? p.w : p.w * 0.45,
              background: p.color,
              borderRadius: p.round ? "50%" : 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{ x: p.dx, y: [0, p.dy, p.dy + 90], opacity: [1, 1, 0], rotate: p.rot, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
