// shuffleUtils.ts — Fisher-Yates shuffle + session-based question tracker

/**
 * Fisher-Yates (Durstenfeld) shuffle — produces a truly random permutation
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Session-based tracker that prevents repeats until all items have been shown.
 * Stores used indices in memory per session (not persisted).
 */
const sessionTrackers: Map<string, Set<number>> = new Map();

/**
 * Get a random item from an array without repeating until all items have been shown.
 * @param key A unique key for the pool (e.g., 'clasico', 'yo_nunca')
 * @param items The full array of items to pick from
 * @returns A random item that hasn't been shown yet in this session
 */
export function getRandomWithoutRepeat<T>(key: string, items: T[]): T {
  if (items.length === 0) throw new Error('Empty items array');

  let used = sessionTrackers.get(key);
  if (!used || used.size >= items.length) {
    // Reset — all items have been shown, start fresh
    used = new Set();
    sessionTrackers.set(key, used);
  }

  // Find a random unused index
  let index: number;
  do {
    index = Math.floor(Math.random() * items.length);
  } while (used.has(index));

  used.add(index);
  return items[index];
}

/**
 * Reset the session tracker for a specific key (e.g., when starting a new game)
 */
export function resetSessionTracker(key: string): void {
  sessionTrackers.delete(key);
}

/**
 * Reset all session trackers (e.g., when starting a completely new game)
 */
export function resetAllSessionTrackers(): void {
  sessionTrackers.clear();
}

/**
 * Get a shuffled copy of an array — used to create a randomized deck at game start
 */
export function createShuffledDeck<T>(items: T[]): T[] {
  return shuffleArray(items);
}

/**
 * Pick N random unique items from an array
 */
export function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = shuffleArray(items);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
