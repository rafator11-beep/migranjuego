import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  Star,
  Users,
  ShoppingBag,
  Coins,
  Crown,
  Sparkles,
  Medal,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRanking, PlayerStats } from '@/hooks/useRanking';
import { ImagePreviewDialog } from '@/components/ui/ImagePreviewDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { buildPremiumSummaryFromRanking, getPremiumBadgeCatalog, getPremiumOverview } from '@/lib/premiumProgression';
import { CoinShop } from '@/components/game/CoinShop';
import { getXPProgress } from '@/lib/playerEconomy';
import { useAuth } from '@/contexts/AuthContext';

type ModeKey = 'global' | 'fiesta' | 'juego' | 'poker' | 'megamix' | 'clasico' | 'picante' | 'parchis';

function pickWins(r: PlayerStats, mode: ModeKey) {
  if (mode === 'fiesta') return r.fiesta_games_won || 0;
  if (mode === 'juego') return r.juego_games_won || 0;
  if (mode === 'poker') return r.poker_chips_won || 0;
  if (mode === 'megamix') return r.megamix_games_won || 0;
  if (mode === 'clasico') return r.clasico_games_won || 0;
  if (mode === 'picante') return r.picante_games_won || 0;
  if (mode === 'parchis') return r.parchis_games_won || 0;
  return r.games_won || 0;
}

function pickGames(r: PlayerStats, mode: ModeKey) {
  if (mode === 'fiesta') return r.fiesta_games_played || 0;
  if (mode === 'juego') return r.juego_games_played || 0;
  if (mode === 'poker') return r.poker_games_played || 0;
  if (mode === 'megamix') return r.megamix_games_played || 0;
  if (mode === 'clasico') return r.clasico_games_played || 0;
  if (mode === 'picante') return r.picante_games_played || 0;
  if (mode === 'parchis') return r.parchis_games_played || 0;
  return r.games_played || 0;
}

function sortByWins(list: PlayerStats[], mode: ModeKey) {
  return [...list].sort((a, b) => pickWins(b, mode) - pickWins(a, mode));
}

function heroRankLabel(index: number) {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `#${index + 1}`;
}

function SummaryStat({ icon: Icon, label, value, accent }: { icon: typeof Trophy; label: string; value: string | number; accent?: string }) {
  return (
    <div className="premium-stat">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          <Icon className={`h-4.5 w-4.5 ${accent || 'text-[hsl(var(--accent))]'}`} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RankingList({ data, mode, onAvatarClick, localPlayerName }: { data: PlayerStats[]; mode: ModeKey; onAvatarClick: (url: string | null) => void; localPlayerName: string }) {
  return (
    <div className="space-y-3">
      {data.map((rank, i) => {
        const wins = pickWins(rank, mode);
        const games = pickGames(rank, mode);
        const isLocal = localPlayerName && rank.name.toLowerCase() === localPlayerName.toLowerCase();

        return (
          <motion.div
            key={`${rank.name}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025 }}
            className={`rounded-[24px] border p-3.5 sm:p-4 ${
              i < 3
                ? 'border-amber-400/20 bg-[linear-gradient(180deg,rgba(255,217,102,0.12),rgba(255,255,255,0.04))]'
                : isLocal
                  ? 'border-[hsl(var(--primary)/0.34)] bg-[linear-gradient(180deg,hsl(var(--primary)/0.12),rgba(255,255,255,0.03))]'
                  : 'border-white/8 bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
                {heroRankLabel(i)}
              </div>

              <Avatar className="h-12 w-12 ring-1 ring-white/10 cursor-pointer" onClick={() => onAvatarClick(rank.avatar_url)}>
                {rank.avatar_url ? <AvatarImage src={rank.avatar_url} loading="lazy" /> : null}
                <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-white text-sm font-bold">
                  {rank.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-white">{rank.name}</p>
                  {isLocal ? (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--accent))]">
                      tú
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{games} partidas registradas</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-white">{wins}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{mode === 'poker' ? 'fichas' : 'victorias'}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {data.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-muted-foreground">
          No hay datos todavía para esta categoría.
        </div>
      ) : null}
    </div>
  );
}

export default function Profiles() {
  const [achOpen, setAchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState<string>('');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const { profile, syncEconomy } = useAuth();

  React.useEffect(() => {
    setLocalPlayerName(localStorage.getItem('fiesta_player_name') || '');
  }, []);

  const { rankings, loading } = useRanking();

  const totalGames = rankings.reduce((sum, r) => sum + (r.games_played || 0), 0);
  const globalRank = sortByWins(rankings.filter(r => (r.games_played || 0) > 0), 'global');
  const juego = sortByWins(rankings.filter(r => (r.juego_games_played || 0) > 0), 'juego');
  const poker = sortByWins(rankings.filter(r => (r.poker_games_played || 0) > 0 || r.poker_chips_won > 0), 'poker');
  const parchis = sortByWins(rankings.filter(r => (r.parchis_games_played || 0) > 0), 'parchis');
  const megamix = sortByWins(rankings.filter(r => (r.megamix_games_played || 0) > 0), 'megamix');
  const clasico = sortByWins(rankings.filter(r => (r.clasico_games_played || 0) > 0), 'clasico');
  const picante = sortByWins(rankings.filter(r => (r.picante_games_played || 0) > 0), 'picante');

  const topPlayer = globalRank[0];
  const myProfile = rankings.find(r => r.name.toLowerCase() === localPlayerName.toLowerCase());
  const myRankPosition = myProfile ? globalRank.findIndex(r => r.name.toLowerCase() === myProfile.name.toLowerCase()) + 1 : 0;
  const xpInfo = myProfile ? getXPProgress(myProfile.xp || 0) : null;
  const pokerXp = myProfile ? getXPProgress(myProfile.poker_xp || 0) : null;
  const parchisXp = myProfile ? getXPProgress(myProfile.parchis_xp || 0) : null;
  const myPremium = myProfile
    ? buildPremiumSummaryFromRanking({
        id: myProfile.user_id,
        player_name: myProfile.name,
        avatar_url: myProfile.avatar_url,
        city: null,
        total_score: myProfile.xp || 0,
        games_played: myProfile.games_played || 0,
        games_won: myProfile.games_won || 0,
        football_score: 0,
        football_games: 0,
        football_wins: 0,
        culture_score: 0,
        culture_games: 0,
        culture_wins: 0,
        megamix_games: myProfile.megamix_games_played || 0,
        megamix_wins: myProfile.megamix_games_won || 0,
        megamix_score: 0,
        poker_games: myProfile.poker_games_played || 0,
        poker_wins: 0,
        poker_score: myProfile.poker_chips_won || 0,
        clasico_games: myProfile.clasico_games_played || 0,
        clasico_wins: myProfile.clasico_games_won || 0,
        clasico_score: 0,
        picante_games: myProfile.picante_games_played || 0,
        picante_wins: myProfile.picante_games_won || 0,
        picante_score: 0,
        parchis_games: myProfile.parchis_games_played || 0,
        parchis_wins: myProfile.parchis_games_won || 0,
        parchis_score: 0,
        coins: myProfile.coins || 0,
        gems: myProfile.gems || 0,
        xp: myProfile.xp || 0,
        level: myProfile.level || 1,
        poker_xp: myProfile.poker_xp || 0,
        poker_level: myProfile.poker_level || 1,
        parchis_xp: myProfile.parchis_xp || 0,
        parchis_level: myProfile.parchis_level || 1,
        win_streak: 0,
        unlocked_items: myProfile.unlocked_items || [],
        equipped_items: myProfile.equipped_items || {},
        created_at: myProfile.updated_at || new Date().toISOString(),
        updated_at: myProfile.updated_at || new Date().toISOString(),
        legendary_drops: 0,
        chaos_events: 0,
        cursed_events: 0,
        viruses_received: 0,
      })
    : profile
      ? getPremiumOverview({
          id: profile.id,
          playerName: profile.username,
          avatar_url: profile.avatar_url || null,
          games_played: profile.games_played || 0,
          games_won: profile.total_wins || 0,
          total_xp: profile.total_xp || 0,
          win_streak: 0,
        }, profile.badges)
      : null;

  return (
    <div className="premium-screen min-h-screen px-4 pb-28 pt-5 md:px-6 md:pb-32 md:pt-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-panel overflow-hidden rounded-[34px] p-4 sm:p-5 md:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <span className="premium-chip text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                perfil premium
              </span>
              <h1 className="premium-title mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-[2.8rem]">
                Ranking, progreso y tienda con acabado unificado.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                Esta zona ahora tiene mejor jerarquía visual, métricas más legibles, tarjetas más limpias y una estructura que encaja con el resto de la app premium.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" className="h-11 rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-white hover:bg-white/[0.12]" onClick={() => setAchOpen(true)}>
                <Trophy className="h-4 w-4" />
                Logros premium
              </Button>
              <Button
                className="h-11 rounded-2xl border-none bg-[linear-gradient(135deg,#facc15,#f59e0b)] px-4 text-black hover:opacity-95"
                onClick={() => setShopOpen(true)}
              >
                <ShoppingBag className="h-4 w-4" />
                Tienda Web
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStat icon={Gamepad2} label="Partidas" value={totalGames} accent="text-cyan-300" />
            <SummaryStat icon={Users} label="Jugadores" value={rankings.length} accent="text-amber-300" />
            <SummaryStat icon={Crown} label="Top global" value={topPlayer?.name || 'Pendiente'} accent="text-fuchsia-300" />
            <SummaryStat icon={Flame} label="Tu puesto" value={myRankPosition || '—'} accent="text-emerald-300" />
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              {myProfile || profile ? (
                <motion.section
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="premium-panel-soft rounded-[30px] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 border border-white/10">
                        {(myProfile?.equipped_items?.avatar || myProfile?.avatar_url || profile?.avatar_url) ? (
                          <AvatarImage src={myProfile?.equipped_items?.avatar || myProfile?.avatar_url || profile?.avatar_url || ''} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-white font-bold">
                          {(myProfile?.name || profile?.username || 'GU').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tu perfil</p>
                        <h2 className="mt-1 text-2xl font-black text-white">{myProfile?.name || profile?.username || 'Jugador'}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {myRankPosition ? `Posición global #${myRankPosition}` : 'Juega una partida para aparecer en el ranking.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-sm font-bold text-yellow-300">
                        <span className="inline-flex items-center gap-1.5"><Coins className="h-4 w-4" /> {myProfile?.coins ?? profile?.coins ?? 0}</span>
                      </div>
                      <div className="rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.12)] px-3 py-1.5 text-sm font-bold text-white">
                        Nivel {xpInfo?.level || myProfile?.level || profile?.level || 1}
                      </div>
                    </div>
                  </div>

                  {xpInfo ? (
                    <div className="mt-5 space-y-3">
                      <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-white">Progreso global</span>
                          <span className="text-muted-foreground">{xpInfo.currentXP} / {xpInfo.neededXP} XP</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-black/30">
                          <div className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)]" style={{ width: `${xpInfo.percent}%` }} />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-white">Poker LVL {myProfile?.poker_level || 1}</span>
                            <span className="text-muted-foreground">{pokerXp?.percent || 0}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-black/30">
                            <div className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#f59e0b)]" style={{ width: `${pokerXp?.percent || 0}%` }} />
                          </div>
                        </div>
                        <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-white">Parchís LVL {myProfile?.parchis_level || 1}</span>
                            <span className="text-muted-foreground">{parchisXp?.percent || 0}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-black/30">
                            <div className="h-full rounded-full bg-[linear-gradient(90deg,#10b981,#22c55e)]" style={{ width: `${parchisXp?.percent || 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.section>
              ) : null}

              {topPlayer ? (
                <motion.section
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 }}
                  className="rounded-[30px] border border-amber-400/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.15),rgba(255,255,255,0.04))] p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-amber-400/50">
                      {topPlayer.avatar_url ? <AvatarImage src={topPlayer.avatar_url} /> : null}
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-bold">
                        {topPlayer.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">Líder actual</p>
                      <h3 className="mt-1 text-2xl font-black text-white">{topPlayer.name}</h3>
                      <p className="mt-1 text-sm text-amber-100/80">{topPlayer.games_won || 0} victorias totales acumuladas</p>
                    </div>
                  </div>
                </motion.section>
              ) : null}

              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                className="premium-panel-soft rounded-[30px] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Trophy className="h-5 w-5 text-[hsl(var(--neon-yellow))]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Ranking</p>
                    <h2 className="text-xl font-bold text-white">Clasificaciones por modo</h2>
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-muted-foreground">
                    Cargando ranking...
                  </div>
                ) : (
                  <Tabs defaultValue="global" className="w-full">
                    <div className="overflow-x-auto no-scrollbar pb-3">
                      <TabsList className="inline-flex h-auto min-w-full gap-2 rounded-[22px] border border-white/8 bg-white/[0.04] p-2">
                        <TabsTrigger value="global" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🌎 Top</TabsTrigger>
                        <TabsTrigger value="megamix" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🎲 Megamix</TabsTrigger>
                        <TabsTrigger value="clasico" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🍻 Clásico</TabsTrigger>
                        <TabsTrigger value="picante" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🌶️ Picante</TabsTrigger>
                        <TabsTrigger value="juego" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🏆 Trivia</TabsTrigger>
                        <TabsTrigger value="poker" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🃏 Poker</TabsTrigger>
                        <TabsTrigger value="parchis" className="rounded-2xl px-3 py-2 text-xs sm:text-sm">🎲 Parchís</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="global">
                      <RankingList data={globalRank} mode="global" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="megamix">
                      <RankingList data={megamix} mode="megamix" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="clasico">
                      <RankingList data={clasico} mode="clasico" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="picante">
                      <RankingList data={picante} mode="picante" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="juego">
                      <RankingList data={juego} mode="juego" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="poker">
                      <RankingList data={poker} mode="poker" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                    <TabsContent value="parchis">
                      <RankingList data={parchis} mode="parchis" localPlayerName={localPlayerName} onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                    </TabsContent>
                  </Tabs>
                )}
              </motion.section>
            </div>

            <div className="space-y-5">
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="premium-panel-soft rounded-[30px] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">
                    <Medal className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Vista rápida</p>
                    <h2 className="text-xl font-bold text-white">Estado del perfil</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Acabado premium', 'Paneles más limpios, mejores espacios y lectura móvil más cómoda.'],
                    ['Jerarquía visual', 'Tu perfil, el líder y el ranking ya no compiten entre sí.'],
                    ['Acciones claras', 'Logros, tienda y proyección quedan arriba y más accesibles.'],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="premium-panel-soft rounded-[30px] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Indicadores</p>
                    <h2 className="text-xl font-bold text-white">Tus mejores datos</h2>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Victorias globales</p>
                    <p className="mt-2 text-2xl font-black text-white">{myProfile?.games_won ?? 0}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Poker</p>
                    <p className="mt-2 text-2xl font-black text-white">{myProfile?.poker_chips_won ?? 0} fichas</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Parchís</p>
                    <p className="mt-2 text-2xl font-black text-white">{myProfile?.parchis_games_won ?? 0} victorias</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Megamix</p>
                    <p className="mt-2 text-2xl font-black text-white">{myProfile?.megamix_games_won ?? 0} victorias</p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="premium-panel-soft rounded-[30px] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-400/10">
                    <Star className="h-5 w-5 text-fuchsia-300" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Sugerencia</p>
                    <h2 className="text-xl font-bold text-white">Cómo destacar más aquí</h2>
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4 text-sm leading-7 text-muted-foreground">
                  Juega al menos una partida en cada modo importante para llenar tus métricas. En cuanto haya datos, esta pantalla ya los enseña con más claridad y un aspecto mucho más premium.
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>

      <CoinShop
        playerName={localPlayerName || profile?.username || 'Guest'}
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        currentCoins={profile?.coins ?? rankings.find(r => r.name.toLowerCase() === localPlayerName.toLowerCase())?.coins ?? 0}
        currentGems={profile?.gems ?? rankings.find(r => r.name.toLowerCase() === localPlayerName.toLowerCase())?.gems ?? 0}
        onCoinsUpdate={(newCoins) => {
          if (profile) syncEconomy(newCoins, profile.gems);
        }}
        onGemsUpdate={(newGems) => {
          if (profile) syncEconomy(profile.coins, newGems);
        }}
      />

      <Dialog open={achOpen} onOpenChange={setAchOpen}>
        <DialogContent className="max-w-2xl border-white/10 bg-[hsl(var(--card))]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Logros premium</DialogTitle>
            <DialogDescription>Insignias persistentes, rachas guardadas y premios especiales conectados al Hall of Fame.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-2">
              {(myPremium?.badges || getPremiumBadgeCatalog().map((badge) => ({ ...badge, unlocked: false }))).map((badge) => (
                <div key={badge.id} className={`rounded-2xl border p-3 ${badge.unlocked ? 'border-white/12 bg-white/[0.06]' : 'border-white/8 bg-white/[0.03]'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-white flex items-center gap-2"><span>{badge.emoji}</span>{badge.name}</div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-white/55">{badge.unlocked ? 'Desbloqueado' : 'Bloqueado'}</div>
                  </div>
                  <div className="mt-1 text-sm text-white/70">{badge.description}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold">Temporada actual</p>
                <p className="mt-2 text-lg font-black text-white">{myPremium?.currentSeason?.label || 'Temporada activa'}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-[10px] text-white/40 uppercase">Partidas</p><p className="mt-1 text-white font-black">{myPremium?.currentSeason?.games || 0}</p></div>
                  <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-[10px] text-white/40 uppercase">Victorias</p><p className="mt-1 text-white font-black">{myPremium?.currentSeason?.wins || 0}</p></div>
                  <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-[10px] text-white/40 uppercase">Puntos</p><p className="mt-1 text-white font-black">{myPremium?.currentSeason?.points || 0}</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold">Rachas y premios</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-300">🔥 Racha actual {myPremium?.currentStreak || 0}</span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">💎 Mejor racha {myPremium?.bestStreak || 0}</span>
                  <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-300">🏛️ {myPremium?.unlockedCount || 0} insignias</span>
                </div>
                <div className="mt-3 space-y-2">
                  {(myPremium?.awards || []).length > 0 ? myPremium?.awards.map((award) => (
                    <div key={award.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="font-semibold text-white">{award.emoji} {award.name}</div>
                      <div className="mt-1 text-sm text-white/65">{award.description}</div>
                    </div>
                  )) : <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-sm text-white/50">Gana más partidas para desbloquear premios especiales de temporada.</div>}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        imageUrl={previewAvatar}
      />
    </div>
  );
}
