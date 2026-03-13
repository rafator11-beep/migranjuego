import { safeLower, asString } from '@/utils/safeText';

const LOCAL_RANKING_KEY = 'fiesta-party-local-rankings-v1';

function nowIso() {
  return new Date().toISOString();
}

export interface PlayerRanking {
  id: string;
  player_name: string;
  avatar_url: string | null;
  city: string | null;
  total_score: number;
  games_played: number;
  games_won: number;
  football_score: number;
  football_games: number;
  football_wins: number;
  culture_score: number;
  culture_games: number;
  culture_wins: number;
  // Per-mode stats
  megamix_games: number;
  megamix_wins: number;
  megamix_score: number;
  poker_games: number;
  poker_wins: number;
  poker_score: number;
  clasico_games: number;
  clasico_wins: number;
  clasico_score: number;
  picante_games: number;
  picante_wins: number;
  picante_score: number;
  parchis_games: number;
  parchis_wins: number;
  parchis_score: number;
  // Economy (Global / Party)
  coins: number;
  gems: number;
  xp: number;
  level: number;
  win_streak: number;

  // Economy Independent (Poker)
  poker_xp: number;
  poker_level: number;

  // Economy Independent (Parchis)
  parchis_xp: number;
  parchis_level: number;

  unlocked_items: string[];
  equipped_items: Record<string, string>;
  created_at: string;
  updated_at: string;
  legendary_drops: number;
  chaos_events: number;
  cursed_events: number;
  viruses_received: number;
}

export function loadLocalRankings(): PlayerRanking[] {
  const raw = localStorage.getItem(LOCAL_RANKING_KEY);
  let rankings: PlayerRanking[] = [];
  if (raw) {
    try {
      rankings = JSON.parse(raw) as PlayerRanking[];
    } catch {
      rankings = [];
    }
  }

  // One-time migration: if rankings are empty but game history exists, recover stats
  if (rankings.length === 0) {
    const migrated = migrateFromGameHistory();
    if (migrated.length > 0) {
      saveLocalRankings(migrated);
      return migrated;
    }
  }

  return rankings;
}

function migrateFromGameHistory(): PlayerRanking[] {
  try {
    const historyJson = localStorage.getItem('partyGameHistory');
    if (!historyJson) return [];
    const history = JSON.parse(historyJson) as Array<{
      id: string;
      mode: string;
      players: string[];
      winner: string | null;
      created_at: string;
    }>;
    if (!history.length) return [];

    const statsMap: Record<string, PlayerRanking> = {};
    const ts = new Date().toISOString();

    for (const game of history) {
      for (const name of (game.players || [])) {
        if (!statsMap[name]) {
          statsMap[name] = {
            id: `migrated_${Math.random().toString(36).slice(2)}`,
            player_name: name,
            avatar_url: null,
            city: null,
            total_score: 0,
            games_played: 0,
            games_won: 0,
            football_score: 0, football_games: 0, football_wins: 0,
            culture_score: 0, culture_games: 0, culture_wins: 0,
            megamix_games: 0, megamix_wins: 0, megamix_score: 0,
            poker_games: 0, poker_wins: 0, poker_score: 0,
            clasico_games: 0, clasico_wins: 0, clasico_score: 0,
            picante_games: 0,
            picante_wins: 0,
            picante_score: 0,
            parchis_games: 0,
            parchis_wins: 0,
            parchis_score: 0,
            coins: 0,
            gems: 0,
            xp: 0,
            level: 1,
            poker_xp: 0,
            poker_level: 1,
            parchis_xp: 0,
            parchis_level: 1,
            win_streak: 0,
            unlocked_items: [],
            equipped_items: {},
            created_at: game.created_at || ts,
            updated_at: ts,
            legendary_drops: 0, chaos_events: 0, cursed_events: 0, viruses_received: 0,
          };
        }
        statsMap[name].games_played++;
        if (game.winner === name) {
          statsMap[name].games_won++;
          statsMap[name].total_score += 100;
        }
      }
    }

    const result = Object.values(statsMap).sort((a, b) => b.total_score - a.total_score);
    console.log(`Migrated ${result.length} player stats from ${history.length} games in history`);
    return result;
  } catch (e) {
    console.warn('Migration from game history failed:', e);
    return [];
  }
}

export function saveLocalRankings(rankings: PlayerRanking[]) {
  localStorage.setItem(LOCAL_RANKING_KEY, JSON.stringify(rankings));
}

export function upsertLocalRanking(params: {
  playerName: string;
  scoreToAdd: number;
  won?: boolean;
  avatarUrl?: string;
  city?: string;
  gameMode?: string;
  brutalMeta?: {
    legendaryDrops?: number;
    chaosEvents?: number;
    cursedEvents?: number;
    virusesReceived?: number;
  };
}): PlayerRanking[] {
  const { playerName, scoreToAdd, won = false, avatarUrl, city, gameMode, brutalMeta } = params;
  const isFootball = gameMode === 'futbol' || gameMode === 'trivia_futbol';
  const isCulture = gameMode === 'cultura';
  const isMegamix = gameMode === 'megamix';
  const isPoker = gameMode === 'poker';
  const isClasico = gameMode === 'clasico';
  const isPicante = gameMode === 'picante';
  const isParchis = gameMode === 'parchis';

  const current = loadLocalRankings();
  const idx = current.findIndex(r => safeLower(r.player_name) === safeLower(playerName));
  const ts = nowIso();

  if (idx >= 0) {
    const r = { ...current[idx] };
    r.total_score = (r.total_score || 0) + scoreToAdd;
    r.games_played = (r.games_played || 0) + 1;
    r.games_won = (r.games_won || 0) + (won ? 1 : 0);
    r.avatar_url = avatarUrl ?? r.avatar_url ?? null;
    r.city = city ?? r.city ?? null;

    if (brutalMeta) {
      r.legendary_drops = (r.legendary_drops || 0) + (brutalMeta.legendaryDrops || 0);
      r.chaos_events = (r.chaos_events || 0) + (brutalMeta.chaosEvents || 0);
      r.cursed_events = (r.cursed_events || 0) + (brutalMeta.cursedEvents || 0);
      r.viruses_received = (r.viruses_received || 0) + (brutalMeta.virusesReceived || 0);
    }

    if (isFootball) {
      r.football_score = (r.football_score || 0) + scoreToAdd;
      r.football_games = (r.football_games || 0) + 1;
      r.football_wins = (r.football_wins || 0) + (won ? 1 : 0);
    }
    if (isCulture) {
      r.culture_score = (r.culture_score || 0) + scoreToAdd;
      r.culture_games = (r.culture_games || 0) + 1;
      r.culture_wins = (r.culture_wins || 0) + (won ? 1 : 0);
    }
    if (isMegamix) {
      r.megamix_score = (r.megamix_score || 0) + scoreToAdd;
      r.megamix_games = (r.megamix_games || 0) + 1;
      r.megamix_wins = (r.megamix_wins || 0) + (won ? 1 : 0);
    }
    if (isPoker) {
      r.poker_score = (r.poker_score || 0) + scoreToAdd;
      r.poker_games = (r.poker_games || 0) + 1;
      r.poker_wins = (r.poker_wins || 0) + (won ? 1 : 0);
    }
    if (isClasico) {
      r.clasico_score = (r.clasico_score || 0) + scoreToAdd;
      r.clasico_games = (r.clasico_games || 0) + 1;
      r.clasico_wins = (r.clasico_wins || 0) + (won ? 1 : 0);
    }
    if (isPicante) {
      r.picante_score = (r.picante_score || 0) + scoreToAdd;
      r.picante_games = (r.picante_games || 0) + 1;
      r.picante_wins = (r.picante_wins || 0) + (won ? 1 : 0);
    }

    // Economy accumulation (Coins are shared, XP is separated by mode)
    const baseCoins = won ? 10 : 2;
    const streak = won ? (r.win_streak || 0) + 1 : 0;
    const streakBonus = streak >= 3 ? Math.floor(baseCoins * 0.5) : 0;
    r.coins = (r.coins || 0) + baseCoins + streakBonus;
    r.win_streak = streak;

    const gainXp = (won ? 50 : 15) + (streak >= 3 ? 30 : 0);

    if (isPoker) {
      r.poker_xp = (r.poker_xp || 0) + gainXp;
      const currentLevel = r.poker_level || 1;
      const xpForNext = Math.floor(100 * Math.pow(currentLevel, 1.5));
      if ((r.poker_xp || 0) >= xpForNext) {
        r.poker_level = currentLevel + 1;
        r.coins += 30; // Level-up bonus for standalone games
      }
    } else if (isParchis) {
      r.parchis_xp = (r.parchis_xp || 0) + gainXp;
      const currentLevel = r.parchis_level || 1;
      const xpForNext = Math.floor(100 * Math.pow(currentLevel, 1.5));
      if ((r.parchis_xp || 0) >= xpForNext) {
        r.parchis_level = currentLevel + 1;
        r.coins += 30;
      }
    } else {
      // Normal party games
      r.xp = (r.xp || 0) + gainXp;
      const currentLevel = r.level || 1;
      const xpForNext = Math.floor(100 * Math.pow(currentLevel, 1.5));
      if ((r.xp || 0) >= xpForNext) {
        r.level = currentLevel + 1;
        r.coins += 20;
      }
    }

    if (!r.unlocked_items) r.unlocked_items = [];
    if (!r.equipped_items) r.equipped_items = {};

    r.updated_at = ts;
    current[idx] = r;
  } else {
    const base: PlayerRanking = {
      id: `local_${Math.random().toString(36).slice(2)}`,
      player_name: asString(playerName),
      avatar_url: avatarUrl ?? null,
      city: city ?? null,
      total_score: scoreToAdd,
      games_played: 1,
      games_won: won ? 1 : 0,
      football_score: isFootball ? scoreToAdd : 0,
      football_games: isFootball ? 1 : 0,
      football_wins: isFootball && won ? 1 : 0,
      culture_score: isCulture ? scoreToAdd : 0,
      culture_games: isCulture ? 1 : 0,
      culture_wins: isCulture && won ? 1 : 0,
      megamix_score: isMegamix ? scoreToAdd : 0,
      megamix_games: isMegamix ? 1 : 0,
      megamix_wins: isMegamix && won ? 1 : 0,
      poker_score: isPoker ? scoreToAdd : 0,
      poker_games: isPoker ? 1 : 0,
      poker_wins: isPoker && won ? 1 : 0,
      clasico_score: isClasico ? scoreToAdd : 0,
      clasico_games: isClasico ? 1 : 0,
      clasico_wins: isClasico && won ? 1 : 0,
      picante_score: isPicante ? scoreToAdd : 0,
      picante_games: isPicante ? 1 : 0,
      picante_wins: isPicante && won ? 1 : 0,
      parchis_games: isParchis ? 1 : 0,
      parchis_wins: isParchis && won ? 1 : 0,
      parchis_score: isParchis ? scoreToAdd : 0,
      coins: won ? 10 : 2,
      gems: 0,
      xp: (!isPoker && !isParchis && won) ? 50 : 15,
      level: 1,
      poker_xp: isPoker && won ? 50 : (isPoker ? 15 : 0),
      poker_level: 1,
      parchis_xp: isParchis && won ? 50 : (isParchis ? 15 : 0),
      parchis_level: 1,
      win_streak: won ? 1 : 0,
      unlocked_items: [],
      equipped_items: {},
      created_at: ts,
      updated_at: ts,
      legendary_drops: brutalMeta?.legendaryDrops || 0,
      chaos_events: brutalMeta?.chaosEvents || 0,
      cursed_events: brutalMeta?.cursedEvents || 0,
      viruses_received: brutalMeta?.virusesReceived || 0,
    };
    current.push(base);
  }

  current.sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  saveLocalRankings(current);
  return current;
}

export function addGemsToPlayer(playerId: string, amount: number) {
  if (!playerId) return;
  const rankings = loadLocalRankings();
  const index = rankings.findIndex(r => r.id === playerId);
  if (index >= 0) {
    rankings[index].gems = (rankings[index].gems || 0) + amount;
    saveLocalRankings(rankings);
  }
}