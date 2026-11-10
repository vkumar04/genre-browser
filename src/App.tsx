import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowLeft, Dices, Search, X } from "lucide-react";

import { genres, type Genre } from "@/data/genres";
import { catMeta } from "@/data/category-meta";
import { Confetti, type Burst } from "@/components/confetti";
import { SiteHeader } from "@/components/site-header";
import { CategoryFilter } from "@/components/category-filter";
import { GenreCard } from "@/components/genre-card";
import { GenreDetailBody, ModeBadges } from "@/components/genre-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDebounced, useMediaQuery } from "@/hooks/use-media-query";

const DETAIL_ID = "genre-detail";
const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

function AnimatedCount({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return void mv.set(value);
    const c = animate(mv, value, { duration: 0.4, ease: "easeOut" });
    return () => c.stop();
  }, [value, mv, reduce]);
  return <motion.span>{rounded}</motion.span>;
}

/** Desktop side panel (lg and up). */
function DetailPanel({ genre, onClose }: { genre: Genre | null; onClose: () => void }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {genre ? (
        <motion.article
          key={genre.name}
          aria-labelledby="detail-heading"
          className={`${catMeta(genre.cat).theme} overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--cat)_40%,transparent)] bg-card text-card-foreground shadow-[0_18px_40px_-18px_var(--cat)]`}
          initial={{ opacity: 0, y: 24, scale: 0.97, rotate: -1 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.12 } }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <motion.div
            className="relative overflow-hidden border-b bg-linear-to-br from-[var(--cat-soft)] to-card px-5 pt-4 pb-4"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.05 }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-[var(--cat-ink)] uppercase">
                <span aria-hidden="true" className="text-base">{catMeta(genre.cat).emoji}</span>
                {genre.cat}
              </p>
              <Button variant="outline" size="icon-sm" className="rounded-full" onClick={onClose}>
                <X aria-hidden="true" />
                <span className="sr-only">Close details for {genre.name}</span>
              </Button>
            </div>
            <h2 id="detail-heading" className="mb-3 font-serif text-[26px] leading-tight font-normal">
              {genre.name}
            </h2>
            <ModeBadges genre={genre} />
            <span aria-hidden="true" className="pointer-events-none absolute -right-3 -bottom-6 rotate-12 text-7xl opacity-15">
              {catMeta(genre.cat).emoji}
            </span>
          </motion.div>
          <div className="px-5 pt-4 pb-5">
            <GenreDetailBody genre={genre} />
          </div>
        </motion.article>
      ) : (
        <motion.div
          key="empty"
          className="pt-16 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            aria-hidden="true"
            className="mb-3 inline-block"
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowLeft className="size-7" />
          </motion.div>
          <p>
            Select any genre
            <br />
            to explore it
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const [burst, setBurst] = useState<Burst | null>(null);
  const surpriseRef = useRef<HTMLButtonElement>(null);

  const deferredQuery = useDeferredValue(query);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const lastCard = useRef<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return genres.filter((g) => {
      if (activeCat !== "All" && g.cat !== activeCat) return false;
      if (!q) return true;
      return [g.name, g.cat, g.modes.join(" "), g.purpose, g.audience, g.ex].join(" ").toLowerCase().includes(q);
    });
  }, [deferredQuery, activeCat]);

  const selected = genres.find((g) => g.name === selectedName) ?? null;

  const resultsText =
    filtered.length === 0
      ? "No genres match. Try a different search or category."
      : `${filtered.length} genre${filtered.length === 1 ? "" : "s"} shown`;
  const debouncedResults = useDebounced(resultsText, 600);

  const focusCard = useCallback((name: string | null) => {
    if (!name) return;
    requestAnimationFrame(() =>
      document.querySelector<HTMLButtonElement>(`[data-name="${CSS.escape(name)}"]`)?.focus(),
    );
  }, []);

  const select = useCallback(
    (g: Genre) => {
      const deselect = selectedName === g.name;
      lastCard.current = g.name;
      setSelectedName(deselect ? null : g.name);
      setAnnouncement(deselect ? `${g.name} deselected` : `Showing details for ${g.name}`);
    },
    [selectedName],
  );

  const closePanel = useCallback(() => {
    setSelectedName(null);
    setAnnouncement("Details closed");
    focusCard(lastCard.current);
  }, [focusCard]);

  const surprise = useCallback(() => {
    const pool = filtered.length ? filtered : genres;
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    const finish = () => {
      let g = pick();
      if (pool.length > 1) while (g.name === selectedName) g = pick();
      lastCard.current = g.name;
      setSelectedName(g.name);
      setShuffling(false);
      setAnnouncement(`Surprise! Showing details for ${g.name}`);
      const r = surpriseRef.current?.getBoundingClientRect();
      if (r) setBurst({ id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 });
      if (window.matchMedia("(min-width: 1024px)").matches) focusCard(g.name);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || pool.length < 2) return finish();
    // Quick "slot machine" flicker across cards before landing
    setShuffling(true);
    let n = 0;
    const tick = () => {
      setSelectedName(pick().name);
      if (++n < 8) setTimeout(tick, 60 + n * 12);
      else finish();
    };
    tick();
  }, [filtered, selectedName, focusCard]);

  // "/" jumps to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sheetOpen = !isDesktop && !!selected && !shuffling;
  // Keep the last genre mounted so the sheet can animate closed and Radix can restore focus.
  const sheetGenre = selected ?? genres.find((g) => g.name === lastCard.current) ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#genres-heading"
        className="absolute -top-16 left-3 z-[60] rounded-md bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-lg focus:top-3"
      >
        Skip to genres
      </a>

      <SiteHeader count={genres.length} />

      {/* Toolbar */}
      <div className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-2 px-4 pt-3 pb-1 sm:px-8 md:flex-row md:items-center md:gap-4 md:pb-2">
          <form role="search" className="relative w-full md:max-w-xs md:flex-none" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className="sr-only">
              Search genres
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              id="search"
              type="search"
              placeholder="Search genres, modes, purposes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-describedby="search-hint"
              autoComplete="off"
              className="peer pr-10 pl-9"
            />
            <span id="search-hint" className="sr-only">
              Results update as you type. Press slash to jump here.
            </span>
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground peer-focus:hidden sm:block"
            >
              /
            </kbd>
          </form>
          <div className="min-w-0 flex-1">
            <CategoryFilter value={activeCat} onChange={setActiveCat} />
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-screen-2xl lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-labelledby="genres-heading" className="min-w-0 px-4 pt-5 pb-12 sm:px-8 lg:border-r">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="genres-heading"
              tabIndex={-1}
              className={`${catMeta(activeCat).theme} inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground tabular-nums`}
            >
              <span className="rounded-full bg-[var(--cat-ink)] px-2 py-0.5 text-[var(--cat-on)]">
                <AnimatedCount value={filtered.length} />
              </span>
              <span>
                genre{filtered.length === 1 ? "" : "s"}
                {activeCat !== "All" && <span className="font-normal text-muted-foreground"> in {activeCat}</span>}
              </span>
            </h2>
            <motion.div whileHover={{ rotate: -2, scale: 1.04 }} whileTap={{ scale: 0.94, rotate: 2 }}>
              <Button
                ref={surpriseRef}
                onClick={surprise}
                disabled={shuffling}
                className="rounded-full bg-linear-to-r from-[#4f46e5] via-[#9333ea] to-[#db2777] px-4 font-semibold text-white shadow-[0_8px_20px_-8px_#9333ea] hover:brightness-110 disabled:opacity-90"
              >
                <motion.span
                  aria-hidden="true"
                  className="inline-flex"
                  animate={shuffling ? { rotate: 360 } : { rotate: 0 }}
                  transition={shuffling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : spring}
                >
                  <Dices className="size-4" />
                </motion.span>
                Surprise me
              </Button>
            </motion.div>
          </div>

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))]">
            <AnimatePresence mode="popLayout">
              {filtered.map((g, i) => (
                <GenreCard
                  key={g.name}
                  genre={g}
                  index={i}
                  selected={g.name === selectedName}
                  controls={isDesktop ? DETAIL_ID : undefined}
                  onSelect={select}
                />
              ))}
            </AnimatePresence>
          </ul>

          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                className="px-5 py-12 text-center text-[15px] text-muted-foreground"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  aria-hidden="true"
                  className="mb-2.5 inline-block text-3xl text-secondary-foreground"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                >
                  ¯\_(ツ)_/¯
                </motion.span>
                <p>No genres match that search.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setQuery("");
                    setActiveCat("All");
                    searchRef.current?.focus();
                  }}
                >
                  Clear search and filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {isDesktop && (
          <aside
            id={DETAIL_ID}
            aria-label="Genre details"
            className="sticky top-[76px] h-fit max-h-[calc(100dvh-84px)] overflow-y-auto p-6"
          >
            <DetailPanel genre={selected} onClose={closePanel} />
          </aside>
        )}
      </main>

      {/* Phones & tablets: details slide up in a sheet (focus trapped, Esc closes, focus returns to the card) */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedName(null);
            setAnnouncement("Details closed");
          }
        }}
      >
        {sheetGenre && (
          <SheetContent
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              focusCard(lastCard.current);
            }}
            side="bottom"
            showCloseButton={false}
            className={`${catMeta(sheetGenre.cat).theme} max-h-[88dvh] gap-0 overflow-hidden rounded-t-3xl border-t-4 border-t-[var(--cat)] sm:mx-auto sm:max-w-xl`}
          >
            {/* Pinned top: handle, close, and genre header stay put while the body scrolls */}
            <div className="relative flex-none bg-linear-to-br from-[var(--cat-soft)] to-background">
            <div aria-hidden="true" className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            <SheetClose asChild>
              <Button variant="outline" size="icon-sm" className="absolute top-4 right-4 rounded-full">
                <X aria-hidden="true" />
                <span className="sr-only">Close details for {sheetGenre.name}</span>
              </Button>
            </SheetClose>
            <SheetHeader className="relative overflow-hidden border-b px-5 pt-3 pb-4 pr-14">
              <span aria-hidden="true" className="pointer-events-none absolute right-4 -bottom-5 rotate-12 text-7xl opacity-15">
                {catMeta(sheetGenre.cat).emoji}
              </span>
              <SheetDescription className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-[var(--cat-ink)] uppercase">
                <span aria-hidden="true" className="text-base">{catMeta(sheetGenre.cat).emoji}</span>
                {sheetGenre.cat}
              </SheetDescription>
              <SheetTitle className="mb-1.5 font-serif text-[26px] leading-tight font-normal">{sheetGenre.name}</SheetTitle>
              <motion.div initial="hidden" animate="show">
                <ModeBadges genre={sheetGenre} />
              </motion.div>
            </SheetHeader>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <GenreDetailBody genre={sheetGenre} />
            </div>
          </SheetContent>
        )}
      </Sheet>

      <Confetti burst={burst} />

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {shuffling ? "" : announcement}
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {debouncedResults}
      </div>
    </MotionConfig>
  );
}
