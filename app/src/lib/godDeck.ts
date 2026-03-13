import { safeLower } from '@/utils/safeText';

type Rarity = 'common' | 'rare' | 'legendary' | 'chaos' | 'virus';

export function detectRarity(card: string): Rarity {
  const t = safeLower(card);
  if (t.includes('impostor') || t.includes('vampiro') || t.includes('kamasutra') || t.includes('confesionario') || t.includes('polígrafo')) return 'rare';
  if (t.includes('virus')) return 'virus';
  if (t.includes('doble o nada') || t.includes('a follar') || t.includes('modo avión')) return 'legendary';
  if (t.includes('🧨') || t.includes('💀') || t.includes('destroyer')) return 'chaos';
  return 'common';
}

function isSpecial(card: string) {
  const t = safeLower(card);
  return t.includes('virus') || t.includes('impostor');
}

function weightFor(r: Rarity): number {
  switch (r) {
    case 'common': return 1.0;
    case 'rare': return 0.65;
    case 'legendary': return 0.35;
    case 'chaos': return 0.55;
    case 'virus': return 0.30;
  }
}

export function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * GOD deck:
 * - avoids last N repeats
 * - applies cooldown to specials (virus/impostor)
 * - uses rarity weights so "locuras" feel rarer but still appear
 * - returns a deterministic-length sequence (same size as input)
 */
export function buildGodDeck(input: string[], opts?: {
  recentWindow?: number;
  specialCooldown?: number;
  maxSpecials?: number;
}): string[] {
  const recentWindow = opts?.recentWindow ?? 25;
  const specialCooldown = opts?.specialCooldown ?? 10;
  const maxSpecials = opts?.maxSpecials ?? 3;

  const pool = [...input];
  const out: string[] = [];

  let lastSpecialIndex = -9999;
  let specialsUsed = 0;

  while (pool.length) {
    const recent = new Set(out.slice(-recentWindow));
    const candidates: string[] = [];
    const weights: number[] = [];

    for (const c of pool) {
      if (recent.has(c)) continue;

      const special = isSpecial(c);
      if (special) {
        if (specialsUsed >= maxSpecials) continue;
        if ((out.length - lastSpecialIndex) < specialCooldown) continue;
      }

      const rar = detectRarity(c);
      candidates.push(c);
      weights.push(weightFor(rar));
    }

    // If we're stuck, progressively relax constraints
    let choice: string;
    if (candidates.length === 0) {
      // relax recent constraint first
      choice = pool[Math.floor(Math.random() * pool.length)];
    } else {
      choice = pickWeighted(candidates, weights);
    }

    // remove from pool
    const idx = pool.indexOf(choice);
    if (idx >= 0) pool.splice(idx, 1);

    // update special trackers
    if (isSpecial(choice)) {
      specialsUsed += 1;
      lastSpecialIndex = out.length;
    }

    out.push(choice);
  }

  return out;
}
