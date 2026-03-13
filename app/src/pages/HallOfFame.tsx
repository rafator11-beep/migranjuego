import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star, Flame, Zap } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { loadLocalRankings } from '@/utils/localRanking';

// ─── Title System (10 Ranks) ─────────────────────────────────────────────────
function getPlayerTitle(xp: number, gamesPlayed: number, wins: number) {
  if (xp >= 5000 || wins >= 200) return { title: 'Dios de la Fiesta', emoji: '⚡', color: 'text-amber-300' };
  if (xp >= 3000 || wins >= 100) return { title: 'Leyenda Suprema', emoji: '👑', color: 'text-yellow-400' };
  if (xp >= 2000 || wins >= 75) return { title: 'Rey del Party', emoji: '🎉', color: 'text-pink-400' };
  if (xp >= 1000 || wins >= 50) return { title: 'El Fiestero', emoji: '🔥', color: 'text-orange-400' };
  if (xp >= 700 || wins >= 30) return { title: 'Alma de la Noche', emoji: '🌙', color: 'text-indigo-400' };
  if (xp >= 500 || wins >= 20) return { title: 'El Kamikaze', emoji: '💣', color: 'text-red-400' };
  if (xp >= 300 || wins >= 10) return { title: 'El Impostor Nato', emoji: '🎭', color: 'text-purple-400' };
  if (xp >= 200 || wins >= 5) return { title: 'El Diplomático', emoji: '🤝', color: 'text-blue-400' };
  if (xp >= 100 || gamesPlayed >= 10) return { title: 'Promesa', emoji: '⭐', color: 'text-yellow-300' };
  return { title: 'Aprendiz', emoji: '📖', color: 'text-slate-400' };
}

// ─── Neon border for TOP 3 ───────────────────────────────────────────────────
function getNeonBorder(idx: number) {
  if (idx === 0) return 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
  if (idx === 1) return 'ring-2 ring-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.4)]';
  if (idx === 2) return 'ring-2 ring-amber-600 shadow-[0_0_15px_rgba(180,83,9,0.4)]';
  return 'ring-1 ring-white/10';
}

function getMedal(idx: number) {
  if (idx === 0) return '🥇';
  if (idx === 1) return '🥈';
  if (idx === 2) return '🥉';
  return `${idx + 1}`;
}

type PlayerRow = {
  name: string;
  avatar: string | null;
  xp: number;
  gamesPlayed: number;
  wins: number;
  level: number;
};

// ─── Avatar Component ────────────────────────────────────────────────────────
function PlayerAvatar({ url, name, size = 'md' }: { url: string | null; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-14 h-14' : size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  return (
    <div className={`${sz} rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0`}>
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="font-black text-white text-sm">{name.trim().charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

// ─── Classification Badges based on stats ────────────────────────────────────
function getClassifications(xp: number, gamesPlayed: number, wins: number): { label: string; emoji: string; color: string }[] {
  const badges: { label: string; emoji: string; color: string }[] = [];
  const winRate = gamesPlayed > 0 ? wins / gamesPlayed : 0;

  // Win-rate based
  if (winRate >= 0.8 && gamesPlayed >= 5) badges.push({ label: 'Invencible', emoji: '🛡️', color: 'bg-yellow-500/20 text-yellow-300' });
  else if (winRate >= 0.6 && gamesPlayed >= 5) badges.push({ label: 'Estratega', emoji: '🧠', color: 'bg-blue-500/20 text-blue-300' });
  else if (winRate < 0.2 && gamesPlayed >= 5) badges.push({ label: 'Kamikaze', emoji: '💥', color: 'bg-red-500/20 text-red-300' });

  // Volume based
  if (gamesPlayed >= 50) badges.push({ label: 'Veterano', emoji: '🎖️', color: 'bg-emerald-500/20 text-emerald-300' });
  else if (gamesPlayed >= 20) badges.push({ label: 'Habitual', emoji: '🔄', color: 'bg-teal-500/20 text-teal-300' });
  else if (gamesPlayed >= 10) badges.push({ label: 'Frecuente', emoji: '📅', color: 'bg-cyan-500/20 text-cyan-300' });

  // XP-based personality
  if (xp >= 2000) badges.push({ label: 'Party Animal', emoji: '🦁', color: 'bg-orange-500/20 text-orange-300' });
  if (xp >= 1000 && wins >= 30) badges.push({ label: 'Leyenda Viva', emoji: '👑', color: 'bg-amber-500/20 text-amber-300' });
  if (wins >= 10 && winRate >= 0.5) badges.push({ label: 'Clutch Master', emoji: '🎯', color: 'bg-pink-500/20 text-pink-300' });
  if (gamesPlayed >= 10 && wins === 0) badges.push({ label: 'El Optimista', emoji: '😅', color: 'bg-purple-500/20 text-purple-300' });
  if (gamesPlayed >= 5 && winRate >= 0.4 && winRate < 0.6) badges.push({ label: 'Equilibrado', emoji: '⚖️', color: 'bg-indigo-500/20 text-indigo-300' });
  if (xp >= 500 && xp < 1000) badges.push({ label: 'En Racha', emoji: '🔥', color: 'bg-rose-500/20 text-rose-300' });

  return badges.slice(0, 3); // Max 3 badges
}

// ─── Player Row ──────────────────────────────────────────────────────────────
function PlayerRowCard({ player, idx }: { player: PlayerRow; idx: number }) {
  const titleInfo = getPlayerTitle(player.xp, player.gamesPlayed, player.wins);
  const neon = getNeonBorder(idx);
  const medal = getMedal(idx);
  const classifications = getClassifications(player.xp, player.gamesPlayed, player.wins);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`p-3 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] ${neon} transition-all`}
    >
      <div className="flex items-center gap-3">
        {/* Medal */}
        <div className="text-xl w-8 text-center font-black text-white/80 shrink-0">{medal}</div>

        {/* Avatar */}
        <PlayerAvatar url={player.avatar} name={player.name} size={idx < 3 ? 'md' : 'sm'} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white leading-tight truncate">{player.name}</div>
          <div className={`text-xs font-bold ${titleInfo.color} flex items-center gap-1`}>
            <span>{titleInfo.emoji}</span>
            <span>{titleInfo.title}</span>
            <span className="text-white/40 font-normal ml-1">Nv.{player.level}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right shrink-0">
          <div className="font-black text-yellow-400 text-base">{player.xp} XP</div>
          <div className="text-[10px] text-white/50">{player.wins}V / {player.gamesPlayed}P</div>
        </div>

        {idx === 0 && <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />}
      </div>

      {/* Classification Badges */}
      {classifications.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 ml-10">
          {classifications.map(b => (
            <span key={b.label} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${b.color} border border-white/5`}>
              {b.emoji} {b.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── 10 Rank Titles for Legend Section ────────────────────────────────────────
const RANK_TITLES = [
  { emoji: '⚡', title: 'Dios de la Fiesta', req: '5000+ XP', color: 'text-amber-300' },
  { emoji: '👑', title: 'Leyenda Suprema', req: '3000+ XP', color: 'text-yellow-400' },
  { emoji: '🎉', title: 'Rey del Party', req: '2000+ XP', color: 'text-pink-400' },
  { emoji: '🔥', title: 'El Fiestero', req: '1000+ XP', color: 'text-orange-400' },
  { emoji: '🌙', title: 'Alma de la Noche', req: '700+ XP', color: 'text-indigo-400' },
  { emoji: '💣', title: 'El Kamikaze', req: '500+ XP', color: 'text-red-400' },
  { emoji: '🎭', title: 'El Impostor Nato', req: '300+ XP', color: 'text-purple-400' },
  { emoji: '🤝', title: 'El Diplomático', req: '200+ XP', color: 'text-blue-400' },
  { emoji: '⭐', title: 'Promesa', req: '100+ XP', color: 'text-yellow-300' },
  { emoji: '📖', title: 'Aprendiz', req: 'Inicio', color: 'text-slate-400' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export function HallOfFame() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [filter, setFilter] = useState<'xp' | 'wins' | 'played'>('xp');
  const [source, setSource] = useState<'local' | 'global'>('local');

  useEffect(() => {
    loadData();
  }, [source]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (source === 'global' && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, total_xp, games_played, total_wins, level')
          .order('total_xp', { ascending: false })
          .limit(20);

        if (!error && data) {
          setPlayers(data.map((r: any) => ({
            name: r.username || 'Jugador',
            avatar: r.avatar_url,
            xp: r.total_xp || 0,
            gamesPlayed: r.games_played || 0,
            wins: r.total_wins || 0,
            level: r.level || 1,
          })));
        } else {
          loadLocal();
        }
      } else {
        loadLocal();
      }
    } catch {
      loadLocal();
    } finally {
      setLoading(false);
    }
  };

  const loadLocal = () => {
    const local = loadLocalRankings();
    const mapped: PlayerRow[] = local.map((r: any) => ({
      name: r.player_name || 'Jugador',
      avatar: r.avatar_url || null,
      xp: r.total_score || 0,
      gamesPlayed: r.games_played || 0,
      wins: r.games_won || 0,
      level: Math.floor((r.total_score || 0) / 100) + 1,
    }));
    setPlayers(mapped);
  };

  const sorted = [...players].sort((a, b) => {
    if (filter === 'xp') return b.xp - a.xp;
    if (filter === 'wins') return b.wins - a.wins;
    return b.gamesPlayed - a.gamesPlayed;
  });

  const filterBtns = [
    { key: 'xp', label: 'XP', icon: '⚡' },
    { key: 'wins', label: 'Victorias', icon: '🏆' },
    { key: 'played', label: 'Partidas', icon: '🎮' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 pb-28 pt-6 px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
              Hall of Fame
            </h1>
          </div>
          <p className="text-xs text-white/40 ml-10">Clasificación de leyendas del party</p>
        </div>

        {/* Source Toggle */}
        <div className="flex gap-2 mb-4">
          {(['local', 'global'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${source === s
                ? 'bg-purple-600/40 border-purple-500/60 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70'
                }`}
            >
              {s === 'local' ? '📱 Local' : '🌍 Global'}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {filterBtns.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f.key
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70'
                }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
            <p className="text-white/40 text-sm">Cargando leyendas...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-white/40 font-bold">Nadie ha jugado aún</p>
            <p className="text-white/30 text-sm mt-1">¡Sé el primero en entrar al Hall of Fame!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((p, idx) => (
              <PlayerRowCard key={`${p.name}-${idx}`} player={p} idx={idx} />
            ))}
          </div>
        )}

        {/* Legend - 10 Rank Titles */}
        <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Títulos de Rango (10 niveles)</p>
          <div className="grid grid-cols-2 gap-1.5">
            {RANK_TITLES.map(t => (
              <div key={t.title} className="flex items-center gap-1.5 text-[10px]">
                <span>{t.emoji}</span>
                <span className={`${t.color} font-bold truncate`}>{t.title}</span>
                <span className="text-white/30 ml-auto shrink-0">{t.req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
