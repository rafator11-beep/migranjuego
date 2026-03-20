import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Crown, Flame, Gift, RefreshCw, Shield, Sparkles, Swords, Trophy, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadLocalRankings, type PlayerRanking } from '@/utils/localRanking';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { getCurrentSeasonInfo, getPremiumOverview, type PremiumStatsSource } from '@/lib/premiumProgression';

type SourceMode = 'local' | 'global';
type BoardKey =
  | 'overall'
  | 'season'
  | 'streak'
  | 'wins'
  | 'played'
  | 'megamix'
  | 'megaboard'
  | 'poker'
  | 'parchis'
  | 'clasico'
  | 'picante'
  | 'futbol'
  | 'cultura';

type BoardPlayer = {
  id: string;
  name: string;
  avatar: string | null;
  value: number;
  xp: number;
  gamesPlayed: number;
  wins: number;
  level: number;
  winRate: number;
  badges: string[];
  source: SourceMode;
  updatedAt?: string;
  isRegistered?: boolean;
  currentStreak: number;
  bestStreak: number;
  seasonPoints: number;
  seasonWins: number;
  seasonGames: number;
  unlockedCount: number;
  specialAwards: string[];
};

type SupabaseStatRow = Record<string, any>;
type ProfileRow = Record<string, any>;

type BoardMeta = {
  key: BoardKey;
  label: string;
  icon: string;
  accent: string;
  description: string;
};

const BOARD_META: BoardMeta[] = [
  { key: 'overall', label: 'General', icon: '👑', accent: 'from-fuchsia-500 to-cyan-400', description: 'Clasificación total de jugadores registrados.' },
  { key: 'season', label: 'Temporada', icon: '🏛️', accent: 'from-cyan-500 to-blue-500', description: 'Carrera premium de la temporada actual.' },
  { key: 'streak', label: 'Rachas', icon: '🔥', accent: 'from-orange-500 to-amber-400', description: 'Quién llega más caliente a la partida.' },
  { key: 'wins', label: 'Victorias', icon: '🏆', accent: 'from-amber-400 to-orange-500', description: 'Quién gana más cuando se juega de verdad.' },
  { key: 'played', label: 'Partidas', icon: '🎮', accent: 'from-sky-400 to-indigo-500', description: 'Los más activos de la comunidad.' },
  { key: 'megamix', label: 'MegaMix', icon: '🎉', accent: 'from-pink-500 to-rose-500', description: 'Top del modo MegaMix.' },
  { key: 'megaboard', label: 'MegaBoard', icon: '🏰', accent: 'from-violet-500 to-purple-500', description: 'Los reyes del tablero grande.' },
  { key: 'poker', label: 'Poker', icon: '♠️', accent: 'from-emerald-500 to-teal-400', description: 'Competición premium en el tapete.' },
  { key: 'parchis', label: 'Parchís', icon: '🎲', accent: 'from-red-500 to-orange-400', description: 'Quién domina el clásico reinventado.' },
  { key: 'clasico', label: 'Clásico', icon: '🍻', accent: 'from-amber-500 to-yellow-400', description: 'Clasificación del modo clásico.' },
  { key: 'picante', label: 'Picante', icon: '🌶️', accent: 'from-rose-500 to-red-500', description: 'Los más atrevidos del modo picante.' },
  { key: 'futbol', label: 'Fútbol', icon: '⚽', accent: 'from-lime-500 to-green-500', description: 'Líderes de fútbol y trivia futbolera.' },
  { key: 'cultura', label: 'Cultura', icon: '🧠', accent: 'from-cyan-500 to-blue-500', description: 'Top de cultura general.' },
];

const seasonInfo = getCurrentSeasonInfo();

const getModeFieldCandidates = (key: BoardKey): string[] => {
  switch (key) {
    case 'overall':
      return ['total_xp', 'xp', 'total_score', 'overall_score'];
    case 'wins':
      return ['total_wins', 'games_won', 'wins'];
    case 'played':
      return ['games_played', 'total_games', 'plays'];
    case 'season':
      return ['season_points', 'season_score'];
    case 'streak':
      return ['win_streak', 'current_streak'];
    case 'megamix':
      return ['megamix_xp', 'megamix_score', 'megamix_points'];
    case 'megaboard':
      return ['megaboard_xp', 'megaboard_score', 'megaboard_points'];
    case 'poker':
      return ['poker_xp', 'poker_score', 'poker_chips_won'];
    case 'parchis':
      return ['parchis_xp', 'parchis_score'];
    case 'clasico':
      return ['clasico_xp', 'clasico_score'];
    case 'picante':
      return ['picante_xp', 'picante_score'];
    case 'futbol':
      return ['futbol_xp', 'football_score', 'football_xp'];
    case 'cultura':
      return ['cultura_xp', 'culture_score', 'culture_xp'];
    default:
      return ['total_xp', 'xp', 'total_score'];
  }
};

const readNumber = (row: Record<string, any>, candidates: string[], fallback = 0) => {
  for (const key of candidates) {
    const value = row?.[key];
    if (typeof value === 'number') return value;
  }
  return fallback;
};

const isUpdatedThisSeason = (updatedAt?: string) => {
  if (!updatedAt) return false;
  const stamp = new Date(updatedAt).getTime();
  return Number.isFinite(stamp) && stamp >= new Date(seasonInfo.startedAt).getTime();
};

const titleFromPlayer = (player: BoardPlayer) => {
  if (player.value >= 2500 || player.xp >= 5000 || player.unlockedCount >= 8) return { label: 'Leyenda', emoji: '👑', color: 'text-amber-300' };
  if (player.currentStreak >= 5) return { label: 'En llamas', emoji: '🔥', color: 'text-orange-300' };
  if (player.winRate >= 0.7 && player.gamesPlayed >= 8) return { label: 'Imparable', emoji: '⚡', color: 'text-cyan-300' };
  if (player.seasonPoints >= 800) return { label: 'MVP temporada', emoji: '🏛️', color: 'text-sky-300' };
  if (player.wins >= 25) return { label: 'Competidor Pro', emoji: '🏆', color: 'text-orange-300' };
  return { label: 'En subida', emoji: '✨', color: 'text-violet-300' };
};

const buildPremiumSnapshot = (stats: PremiumStatsSource, rawBadges?: any) => {
  const overview = getPremiumOverview(stats, rawBadges);
  const rawSeason = overview.currentSeason;
  const activeThisSeason = isUpdatedThisSeason(stats.updated_at);
  const fallbackPoints = activeThisSeason ? (stats.total_score || stats.total_xp || stats.xp || 0) : 0;
  const fallbackWins = activeThisSeason ? (stats.games_won || 0) : 0;
  const fallbackGames = activeThisSeason ? (stats.games_played || 0) : 0;

  const seasonPoints = rawBadges ? rawSeason?.points || 0 : fallbackPoints;
  const seasonWins = rawBadges ? rawSeason?.wins || 0 : fallbackWins;
  const seasonGames = rawBadges ? rawSeason?.games || 0 : fallbackGames;

  const badgeLabels = overview.badges
    .filter((badge) => badge.unlocked)
    .slice(-3)
    .map((badge) => `${badge.emoji} ${badge.name}`);

  const awardLabels = overview.awards.map((award) => `${award.emoji} ${award.name}`);

  return {
    currentStreak: rawSeason?.currentStreak || overview.currentStreak || 0,
    bestStreak: rawSeason?.bestStreak || overview.bestStreak || 0,
    seasonPoints,
    seasonWins,
    seasonGames,
    unlockedCount: overview.unlockedCount || 0,
    badgeLabels,
    awardLabels,
  };
};

const mapValue = (key: BoardKey, baseValue: number, premium: ReturnType<typeof buildPremiumSnapshot>, wins: number, gamesPlayed: number) => {
  if (key === 'season') return premium.seasonPoints;
  if (key === 'streak') return premium.currentStreak;
  if (key === 'wins') return wins;
  if (key === 'played') return gamesPlayed;
  return baseValue;
};

const mergeCloudRows = (row: SupabaseStatRow, profiles: ProfileRow[]) => {
  const candidates = [row.user_id, row.id, row.profile_id, row.player_name, row.username].filter(Boolean);
  return profiles.find((profile) => {
    const keys = [profile.id, profile.user_id, profile.username].filter(Boolean);
    return candidates.some((candidate) => keys.includes(candidate));
  }) || null;
};

const fromLocalRanking = (player: PlayerRanking, key: BoardKey): BoardPlayer => {
  const valueMap: Record<Exclude<BoardKey, 'season' | 'streak'>, number> = {
    overall: player.total_score || 0,
    wins: player.games_won || 0,
    played: player.games_played || 0,
    megamix: player.megamix_score || 0,
    megaboard: player.total_score || 0,
    poker: player.poker_score || 0,
    parchis: player.parchis_score || 0,
    clasico: player.clasico_score || 0,
    picante: player.picante_score || 0,
    futbol: player.football_score || 0,
    cultura: player.culture_score || 0,
  } as const;

  const gamesPlayed = player.games_played || 0;
  const wins = player.games_won || 0;
  const xp = player.xp || player.total_score || 0;
  const premium = buildPremiumSnapshot({
    id: player.id,
    player_name: player.player_name,
    avatar_url: player.avatar_url,
    games_played: player.games_played,
    games_won: player.games_won,
    total_score: player.total_score,
    xp: player.xp,
    megamix_games: player.megamix_games,
    megamix_wins: player.megamix_wins,
    clasico_games: player.clasico_games,
    clasico_wins: player.clasico_wins,
    picante_games: player.picante_games,
    picante_wins: player.picante_wins,
    poker_games: player.poker_games,
    poker_wins: player.poker_wins,
    parchis_games: player.parchis_games,
    parchis_wins: player.parchis_wins,
    football_games: player.football_games,
    football_wins: player.football_wins,
    culture_games: player.culture_games,
    culture_wins: player.culture_wins,
    win_streak: player.win_streak,
    updated_at: player.updated_at,
  });

  const baseValue = key === 'season' || key === 'streak' ? 0 : valueMap[key as Exclude<BoardKey, 'season' | 'streak'>] || 0;

  return {
    id: player.id,
    name: player.player_name || 'Jugador',
    avatar: player.avatar_url || null,
    value: mapValue(key, baseValue, premium, wins, gamesPlayed),
    xp,
    gamesPlayed,
    wins,
    level: key === 'poker' ? (player.poker_level || 1) : key === 'parchis' ? (player.parchis_level || 1) : (player.level || 1),
    winRate: gamesPlayed > 0 ? wins / gamesPlayed : 0,
    badges: premium.badgeLabels,
    source: 'local',
    updatedAt: player.updated_at,
    isRegistered: false,
    currentStreak: premium.currentStreak,
    bestStreak: premium.bestStreak,
    seasonPoints: premium.seasonPoints,
    seasonWins: premium.seasonWins,
    seasonGames: premium.seasonGames,
    unlockedCount: premium.unlockedCount,
    specialAwards: premium.awardLabels,
  };
};

const fromSupabaseRow = (row: SupabaseStatRow, profileRow: ProfileRow | null, key: BoardKey): BoardPlayer => {
  const merged = { ...profileRow, ...row };
  const gamesPlayed = readNumber(merged, ['games_played', 'total_games', 'plays']);
  const wins = readNumber(merged, ['total_wins', 'games_won', 'wins']);
  const xp = readNumber(merged, ['total_xp', 'xp', 'total_score']);
  const baseValue = readNumber(merged, getModeFieldCandidates(key), key === 'overall' ? xp : 0);
  const premium = buildPremiumSnapshot({
    id: merged.user_id || merged.id || merged.profile_id,
    player_name: merged.player_name || merged.username,
    username: merged.username,
    avatar_url: merged.avatar_url,
    games_played: gamesPlayed,
    games_won: wins,
    total_score: readNumber(merged, ['total_score', 'xp', 'total_xp']),
    total_xp: readNumber(merged, ['total_xp', 'xp', 'total_score']),
    megamix_games: readNumber(merged, ['megamix_games_played', 'megamix_games']),
    megamix_wins: readNumber(merged, ['megamix_games_won', 'megamix_wins']),
    clasico_games: readNumber(merged, ['clasico_games_played', 'clasico_games']),
    clasico_wins: readNumber(merged, ['clasico_games_won', 'clasico_wins']),
    picante_games: readNumber(merged, ['picante_games_played', 'picante_games']),
    picante_wins: readNumber(merged, ['picante_games_won', 'picante_wins']),
    poker_games: readNumber(merged, ['poker_games_played', 'poker_games']),
    poker_wins: readNumber(merged, ['poker_wins']),
    parchis_games: readNumber(merged, ['parchis_games_played', 'parchis_games']),
    parchis_wins: readNumber(merged, ['parchis_games_won', 'parchis_wins']),
    football_games: readNumber(merged, ['football_games']),
    football_wins: readNumber(merged, ['football_wins']),
    culture_games: readNumber(merged, ['culture_games']),
    culture_wins: readNumber(merged, ['culture_wins']),
    win_streak: readNumber(merged, ['win_streak', 'current_streak']),
    updated_at: merged.updated_at,
  }, profileRow?.badges || merged.badges);

  return {
    id: merged.user_id || merged.id || merged.profile_id || merged.player_name || crypto.randomUUID(),
    name: merged.player_name || merged.username || 'Jugador',
    avatar: merged.avatar_url || null,
    value: mapValue(key, baseValue, premium, wins, gamesPlayed),
    xp,
    gamesPlayed,
    wins,
    level: readNumber(merged, ['level', 'player_level'], 1),
    winRate: gamesPlayed > 0 ? wins / gamesPlayed : 0,
    badges: premium.badgeLabels,
    source: 'global',
    updatedAt: merged.updated_at,
    isRegistered: true,
    currentStreak: premium.currentStreak,
    bestStreak: premium.bestStreak,
    seasonPoints: premium.seasonPoints,
    seasonWins: premium.seasonWins,
    seasonGames: premium.seasonGames,
    unlockedCount: premium.unlockedCount,
    specialAwards: premium.awardLabels,
  };
};

function PlayerAvatar({ url, name, rank }: { url: string | null; name: string; rank: number }) {
  const ring = rank === 0 ? 'ring-2 ring-amber-400' : rank === 1 ? 'ring-2 ring-slate-300' : rank === 2 ? 'ring-2 ring-orange-500' : 'ring-1 ring-white/10';
  return (
    <div className={`relative h-12 w-12 rounded-2xl overflow-hidden ${ring} bg-white/10 shrink-0`}>
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm font-black text-white uppercase bg-gradient-to-br from-fuchsia-500/80 to-cyan-500/80">
          {name.slice(0, 2)}
        </div>
      )}
    </div>
  );
}

function RankCard({ player, index, boardKey }: { player: BoardPlayer; index: number; boardKey: BoardKey }) {
  const title = titleFromPlayer(player);
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
  const labelMap: Record<BoardKey, string> = {
    overall: 'score',
    season: 'season pts',
    streak: 'streak',
    wins: 'wins',
    played: 'games',
    megamix: 'score',
    megaboard: 'score',
    poker: 'score',
    parchis: 'score',
    clasico: 'score',
    picante: 'score',
    futbol: 'score',
    cultura: 'score',
  };

  const valueLabel = boardKey === 'wins'
    ? `${player.value} victorias`
    : boardKey === 'played'
      ? `${player.value} partidas`
      : boardKey === 'streak'
        ? `${player.value} seguidas`
        : boardKey === 'season'
          ? `${player.seasonWins} victorias · ${player.seasonGames} partidas`
          : `${player.value} pts`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`premium-panel rounded-[28px] p-4 md:p-5 ${index < 3 ? 'border-white/12 shadow-[0_22px_50px_-34px_rgba(168,85,247,0.55)]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 shrink-0 text-center">
          <div className="text-lg font-black text-white">{medal}</div>
        </div>
        <PlayerAvatar url={player.avatar} name={player.name} rank={index} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base md:text-lg font-black text-white uppercase tracking-tight">{player.name}</p>
            {player.isRegistered && <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className={`premium-chip !py-1 !px-2.5 !text-[10px] ${title.color}`}>{title.emoji} {title.label}</span>
            {player.badges.map((badge) => (
              <span key={badge} className="premium-chip !py-1 !px-2.5 !text-[10px] text-white/70">{badge}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{player.value}</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">{labelMap[boardKey]}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="premium-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">Racha</p>
          <p className="mt-1 text-sm font-black text-white">{player.currentStreak}</p>
        </div>
        <div className="premium-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">Insignias</p>
          <p className="mt-1 text-sm font-black text-white">{player.unlockedCount}</p>
        </div>
        <div className="premium-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">Win rate</p>
          <p className="mt-1 text-sm font-black text-white">{Math.round(player.winRate * 100)}%</p>
        </div>
      </div>

      {player.specialAwards.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {player.specialAwards.slice(0, 2).map((award) => (
            <span key={award} className="premium-chip !py-1 !px-2.5 !text-[10px] text-amber-200">{award}</span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between text-xs text-white/45">
        <span>{valueLabel}</span>
        <span>{player.source === 'global' ? '🌍 Global realtime' : '📱 Local'}</span>
      </div>
    </motion.div>
  );
}

function AwardCard({ title, player, description, icon }: { title: string; player?: BoardPlayer; description: string; icon: string }) {
  return (
    <div className="premium-panel-soft rounded-[26px] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-bold">{title}</p>
      <p className="mt-2 text-lg font-black text-white">{icon} {player?.name || 'Pendiente'}</p>
      <p className="mt-1 text-sm text-white/50">{description}</p>
      <p className="mt-3 text-sm text-white/70 font-semibold">
        {player ? `${player.value} · ${player.specialAwards[0] || 'Compitiendo fuerte'}` : 'En cuanto haya actividad, aparecerá aquí.'}
      </p>
    </div>
  );
}

export function HallOfFame() {
  const [source, setSource] = useState<SourceMode>('global');
  const [boardKey, setBoardKey] = useState<BoardKey>('overall');
  const [loading, setLoading] = useState(true);
  const [cloudRows, setCloudRows] = useState<SupabaseStatRow[]>([]);
  const [profileRows, setProfileRows] = useState<ProfileRow[]>([]);
  const [localRows, setLocalRows] = useState<PlayerRanking[]>([]);

  const activeMeta = BOARD_META.find((item) => item.key === boardKey) || BOARD_META[0];

  const refreshData = async () => {
    setLoading(true);
    try {
      setLocalRows(loadLocalRankings());

      if (isSupabaseConfigured) {
        const [statsRes, profilesRes] = await Promise.allSettled([
          supabase.from('user_stats').select('*').limit(250),
          supabase.from('profiles').select('*').limit(250),
        ]);

        if (statsRes.status === 'fulfilled') setCloudRows((statsRes.value.data as SupabaseStatRow[]) || []);
        if (profilesRes.status === 'fulfilled') setProfileRows((profilesRes.value.data as ProfileRow[]) || []);
      }
    } catch (error) {
      console.warn('Hall of Fame refresh fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('hall_of_fame_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, () => refreshData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => refreshData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const ranking = useMemo(() => {
    const base = source === 'global' && cloudRows.length > 0
      ? cloudRows.map((row) => fromSupabaseRow(row, mergeCloudRows(row, profileRows), boardKey))
      : localRows.map((row) => fromLocalRanking(row, boardKey));

    return base
      .filter((player) => player.value > 0 || player.gamesPlayed > 0 || player.wins > 0 || player.unlockedCount > 0)
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        if (b.bestStreak !== a.bestStreak) return b.bestStreak - a.bestStreak;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 50);
  }, [source, cloudRows, profileRows, localRows, boardKey]);

  const allPremiumPlayers = useMemo(() => {
    const global = cloudRows.map((row) => fromSupabaseRow(row, mergeCloudRows(row, profileRows), 'season'));
    const local = localRows.map((row) => fromLocalRanking(row, 'season'));
    const base = source === 'global' && global.length > 0 ? global : local;
    return base
      .filter((player) => player.gamesPlayed > 0 || player.unlockedCount > 0)
      .sort((a, b) => (b.seasonPoints + b.currentStreak * 20 + b.unlockedCount * 10) - (a.seasonPoints + a.currentStreak * 20 + a.unlockedCount * 10));
  }, [source, cloudRows, profileRows, localRows]);

  const summary = useMemo(() => {
    const players = ranking;
    return {
      totalPlayers: players.length,
      registeredPlayers: players.filter((p) => p.isRegistered).length,
      totalGames: players.reduce((acc, p) => acc + p.gamesPlayed, 0),
      totalWins: players.reduce((acc, p) => acc + p.wins, 0),
      unlockedBadges: players.reduce((acc, p) => acc + p.unlockedCount, 0),
      hottestStreak: Math.max(0, ...players.map((p) => p.currentStreak)),
    };
  }, [ranking]);

  const awards = useMemo(() => {
    const seasonLeader = [...allPremiumPlayers].sort((a, b) => b.seasonPoints - a.seasonPoints)[0];
    const streakLeader = [...allPremiumPlayers].sort((a, b) => b.currentStreak - a.currentStreak)[0];
    const badgeLeader = [...allPremiumPlayers].sort((a, b) => b.unlockedCount - a.unlockedCount)[0];
    const clutchLeader = [...allPremiumPlayers].sort((a, b) => b.winRate - a.winRate)[0];

    return { seasonLeader, streakLeader, badgeLeader, clutchLeader };
  }, [allPremiumPlayers]);

  return (
    <div className="min-h-screen premium-screen pb-28 pt-6 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="premium-panel rounded-[34px] p-5 md:p-7 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%)]" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="section-badge mb-3">Competition live · premium mode</div>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_22px_rgba(251,191,36,0.35)]">
                    <Trophy className="w-7 h-7 text-slate-950" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Hall of Fame Premium</h1>
                    <p className="text-sm md:text-base text-white/55 mt-1">Temporadas, rachas, insignias persistentes y premios especiales para jugadores registrados.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button onClick={refreshData} variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6 mb-6">
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Jugadores</p><p className="text-3xl font-black text-white">{summary.totalPlayers}</p></div>
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Registrados</p><p className="text-3xl font-black text-white">{summary.registeredPlayers}</p></div>
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Partidas</p><p className="text-3xl font-black text-white">{summary.totalGames}</p></div>
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Victorias</p><p className="text-3xl font-black text-white">{summary.totalWins}</p></div>
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Insignias</p><p className="text-3xl font-black text-white">{summary.unlockedBadges}</p></div>
          <div className="premium-stat"><p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-bold mb-2">Racha top</p><p className="text-3xl font-black text-white">{summary.hottestStreak}</p></div>
        </div>

        <div className="premium-panel rounded-[32px] p-4 md:p-5 mb-6">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-black text-white">🏛️ {seasonInfo.label}</p>
              <p className="text-sm text-white/50 mt-1">Quedan {seasonInfo.daysLeft} días para cerrar temporada. Las insignias y premios se mantienen para el historial premium.</p>
            </div>
            <div className="flex gap-2 flex-wrap xl:justify-end">
              <button
                onClick={() => setSource('global')}
                className={`rounded-2xl px-4 py-2 text-sm font-black border transition-all ${source === 'global' ? 'bg-white text-slate-950 border-white shadow-[0_12px_30px_-20px_rgba(255,255,255,0.85)]' : 'bg-white/5 text-white/65 border-white/10 hover:text-white'}`}
              >
                <Shield className="w-4 h-4 inline mr-2" /> Global
              </button>
              <button
                onClick={() => setSource('local')}
                className={`rounded-2xl px-4 py-2 text-sm font-black border transition-all ${source === 'local' ? 'bg-white text-slate-950 border-white shadow-[0_12px_30px_-20px_rgba(255,255,255,0.85)]' : 'bg-white/5 text-white/65 border-white/10 hover:text-white'}`}
              >
                <Users className="w-4 h-4 inline mr-2" /> Local
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {BOARD_META.map((item) => (
              <button
                key={item.key}
                onClick={() => setBoardKey(item.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black tracking-[0.08em] border transition-all ${boardKey === item.key ? 'bg-white text-slate-950 border-white' : 'bg-white/5 text-white/60 border-white/10 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <AwardCard title="Season Royalty" icon="👑" player={awards.seasonLeader} description="Más puntos premium en la temporada actual." />
          <AwardCard title="Hot Streak" icon="🔥" player={awards.streakLeader} description="La racha más caliente del momento." />
          <AwardCard title="Hall Collector" icon="🏛️" player={awards.badgeLeader} description="Quien más insignias persistentes lleva acumuladas." />
          <AwardCard title="Clutch Master" icon="🎯" player={awards.clutchLeader} description="El win rate más intimidante entre los activos." />
        </div>

        <div className="premium-panel rounded-[32px] p-4 md:p-5 mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-black text-white">{activeMeta.icon} {activeMeta.label}</p>
              <p className="text-sm text-white/50 mt-1">{activeMeta.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/55">
              <span className="premium-chip"><Gift className="w-3.5 h-3.5 text-amber-300" /> premios especiales</span>
              <span className="premium-chip"><Flame className="w-3.5 h-3.5 text-orange-300" /> rachas persistentes</span>
              <span className="premium-chip"><Zap className="w-3.5 h-3.5 text-cyan-300" /> refresco instantáneo</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="premium-panel rounded-[32px] p-10 text-center text-white/60">
            <RefreshCw className="w-10 h-10 mx-auto mb-4 animate-spin" />
            Cargando clasificaciones premium...
          </div>
        ) : ranking.length === 0 ? (
          <div className="premium-panel rounded-[32px] p-10 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-fuchsia-300" />
            <p className="text-xl font-black text-white">Todavía no hay datos en esta clasificación</p>
            <p className="text-white/45 mt-2">En cuanto terminen partidas, los usuarios registrados irán entrando aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-3">
              {ranking.map((player, index) => (
                <RankCard key={`${player.id}-${boardKey}`} player={player} index={index} boardKey={boardKey} />
              ))}
            </div>

            <aside className="space-y-4">
              <div className="premium-panel rounded-[30px] p-5 sticky top-6">
                <p className="text-sm font-black text-white mb-4">Capas premium activas</p>
                <div className="space-y-3 text-sm text-white/65">
                  <div className="premium-panel-soft rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white mb-2 font-bold"><Zap className="w-4 h-4 text-cyan-300" /> Realtime</div>
                    <p>Cuando Supabase está activo, el Hall of Fame se refresca al momento con cambios en perfiles y estadísticas.</p>
                  </div>
                  <div className="premium-panel-soft rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white mb-2 font-bold"><Crown className="w-4 h-4 text-amber-300" /> Temporadas</div>
                    <p>La temporada actual se resalta con puntos propios, premios especiales y permanencia de insignias en el historial.</p>
                  </div>
                  <div className="premium-panel-soft rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white mb-2 font-bold"><Swords className="w-4 h-4 text-rose-300" /> Rachas</div>
                    <p>Las rachas y la mejor racha quedan guardadas, para que perder una partida no borre todo el mérito conseguido.</p>
                  </div>
                  <div className="premium-panel-soft rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white mb-2 font-bold"><Flame className="w-4 h-4 text-orange-300" /> Premios especiales</div>
                    <p>Season Royalty, Hot Streak, Hall Collector y Clutch Master convierten el Hall en una competición más viva.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
