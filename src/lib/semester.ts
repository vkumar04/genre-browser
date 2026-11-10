export type Term = "Spring" | "Summer" | "Fall";

/**
 * Academic term for a date: Jan–May → Spring, Jun–Jul → Summer, Aug–Dec → Fall.
 * e.g. Nov 2026 → "Fall 2026", Jan 2027 → "Spring 2027".
 */
export function semesterFor(date: Date = new Date()): { term: Term; year: number; label: string } {
  const m = date.getMonth(); // 0 = Jan
  const term: Term = m <= 4 ? "Spring" : m <= 6 ? "Summer" : "Fall";
  const year = date.getFullYear();
  return { term, year, label: `${term} ${year}` };
}
