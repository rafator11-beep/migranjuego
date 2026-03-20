
export type AchievementId =
  | "drinks_10"
  | "drinks_25"
  | "games_3"
  | "legendary_1"
  | "cursed_1";

const KEY = "paco_achievements_v1";

export function getUnlocked(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function unlock(id: AchievementId) {
  const cur = getUnlocked();
  if (cur[id]) return;
  cur[id] = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {}
}

export function computeAchievements(stats: { drinks: number; gamesWon: number; legendaryHits: number; cursedHits: number }) {
  if (stats.drinks >= 10) unlock("drinks_10");
  if (stats.drinks >= 25) unlock("drinks_25");
  if (stats.gamesWon >= 3) unlock("games_3");
  if (stats.legendaryHits >= 1) unlock("legendary_1");
  if (stats.cursedHits >= 1) unlock("cursed_1");
}

export const ACHIEVEMENTS: { id: AchievementId; label: string; desc: string }[] = [
  { id: "drinks_10", label: "🍻 Bebedor social", desc: "Acumula 10 tragos." },
  { id: "drinks_25", label: "🥴 Resaca oficial", desc: "Acumula 25 tragos." },
  { id: "games_3", label: "🏆 Racha ganadora", desc: "Gana 3 partidas." },
  { id: "legendary_1", label: "✨ Toque legendario", desc: "Te sale 1 carta LEGENDARY." },
  { id: "cursed_1", label: "💀 Maldito", desc: "Te toca 1 evento CURSED." },
];
