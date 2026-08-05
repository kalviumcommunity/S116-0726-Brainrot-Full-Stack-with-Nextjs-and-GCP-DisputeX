/**
 * Subtracts `days` from the current date and returns the resulting Date.
 */
export const daysAgo = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

/**
 * Adds `days` to the current date and returns the resulting Date.
 */
export const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Returns the number of whole days elapsed since `date`.
 */
export const daysSince = (date: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Formats a Date as a human-readable string: "5 Aug 2026 14:08"
 */
export const formatDate = (date: Date): string =>
  date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
