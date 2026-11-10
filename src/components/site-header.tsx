import { motion, useReducedMotion } from "motion/react";
import { AudioLines, Image, PenLine, Quote, Sparkles, BookOpen } from "lucide-react";

const GLYPHS = [PenLine, Image, AudioLines, Quote, Sparkles, BookOpen];
const BLOBS = [
  { color: "#f59e0b", size: 300, left: "62%", top: "-40%", dx: 40, dy: 30 },
  { color: "#ec4899", size: 340, left: "78%", top: "10%", dx: -50, dy: 20 },
  { color: "#22d3ee", size: 260, left: "45%", top: "40%", dx: 30, dy: -30 },
  { color: "#8b5cf6", size: 320, left: "-8%", top: "-60%", dx: 40, dy: 40 },
];

function Backdrop() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full mix-blend-screen blur-3xl"
          style={{ width: b.size, height: b.size, left: b.left, top: b.top, background: b.color, opacity: 0.38 }}
          animate={reduce ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* scrim keeps white text ≥ 4.5:1 over the brightest blob */}
      <span className="absolute inset-0 bg-[rgb(15_10_40/0.5)] lg:bg-[linear-gradient(90deg,rgb(15_10_40/0.5),rgb(15_10_40/0.3)_55%,rgb(15_10_40/0.05))]" />
      {GLYPHS.map((Icon, i) => (
        <motion.span
          key={`g${i}`}
          className="absolute text-white"
          style={{ left: `${10 + i * 15}%`, top: `${i % 2 ? 14 : 58}%` }}
          initial={{ opacity: 0, y: 12 }}
          animate={
            reduce
              ? { opacity: 0.18 }
              : { opacity: 0.18, y: [0, -10, 0], rotate: [0, i % 2 ? 12 : -12, 0] }
          }
          transition={reduce ? { duration: 0 } : { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          <Icon className="size-8 sm:size-11" strokeWidth={1.5} />
        </motion.span>
      ))}
    </div>
  );
}

export function SiteHeader({ count }: { count: number }) {
  return (
    <header className="relative overflow-hidden bg-hero bg-linear-to-br from-[#312e81] via-[#5b21b6] to-[#9d174d] text-white dark:from-[#1e1b4b] dark:via-[#3b0764] dark:to-[#500724]">
      <Backdrop />
      <motion.div
        className="relative mx-auto max-w-screen-2xl px-4 py-8 sm:px-8 sm:py-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.1em] uppercase ring-1 ring-white/25 backdrop-blur">
          <span aria-hidden="true">✦</span> WRDS 1103 · Lawson · Fall 2026
        </p>
        <h1 className="mb-2 font-serif text-[clamp(2.1rem,6vw,3.25rem)] leading-[1.05] font-normal">
          Genre <span className="text-gradient-pop">Browser</span>
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-white/90">
          Browse {count} genres for the EIP Part 3 Genre Project. Pick a card to explore its audience,
          purpose, and a project example, or hit <strong className="font-semibold">Surprise me</strong>.
        </p>
      </motion.div>
    </header>
  );
}
