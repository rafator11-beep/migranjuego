import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Star, Users, MapPin, ShoppingBag, Coins, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRanking, PlayerStats } from '@/hooks/useRanking';
import { ImagePreviewDialog } from '@/components/ui/ImagePreviewDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS, getUnlocked } from '@/lib/achievementStore';
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

function RankingList({ data, mode, onAvatarClick }: { data: PlayerStats[]; mode: ModeKey; onAvatarClick: (url: string | null) => void }) {
  return (
    <div className="space-y-2">
      {data.map((rank, i) => {
        const wins = pickWins(rank, mode);
        const games = pickGames(rank, mode);

        return (
          <motion.div
            key={rank.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`bg-card/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 ${i < 3 ? 'neon-border' : 'border border-border/30'
              }`}
          >
            <span className="text-xl w-8 text-center font-bold">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </span>

            <Avatar className="h-12 w-12 ring-1 ring-primary/30 cursor-pointer" onClick={() => onAvatarClick(rank.avatar_url)}>
              {rank.avatar_url ? <AvatarImage src={rank.avatar_url} loading="lazy" /> : null}
              <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-white text-sm">
                {rank.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{rank.name}</p>
              <p className="text-xs text-muted-foreground">
                {games} partidas
              </p>
            </div>

            <p className="font-bold text-primary text-sm flex items-center gap-1">
              {mode === 'poker' ? '🪙 ' : '🏆 '}
              {wins} {mode === 'poker' ? 'fichas' : 'vics'}
            </p>
          </motion.div>
        );
      })}

      {data.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No hay datos aún para esta categoría
        </p>
      ) : null}
    </div>
  );
}

export default function Profiles() {
  const [achOpen, setAchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState<string>('');
  const [screencastActive, setScreencastActive] = useState(false);
  const { profile, syncEconomy } = useAuth();

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreencastActive(true);
      toast.success('¡Perfil proyectado! Disfruta en tu TV.');
      stream.getVideoTracks()[0].onended = () => {
        setScreencastActive(false);
      };
    } catch {
      toast.error('No se pudo iniciar la proyección.');
    }
  };

  React.useEffect(() => {
    setLocalPlayerName(localStorage.getItem('fiesta_player_name') || '');
  }, []);

  const { rankings, loading } = useRanking();

  const totalGames = rankings.reduce((sum, r) => sum + (r.games_played || 0), 0);

  const globalRank = sortByWins(rankings.filter(r => (r.games_played || 0) > 0), 'global');
  const fiesta = sortByWins(rankings.filter(r => (r.fiesta_games_played || 0) > 0), 'fiesta');
  const juego = sortByWins(rankings.filter(r => (r.juego_games_played || 0) > 0), 'juego');
  const poker = sortByWins(rankings.filter(r => (r.poker_games_played || 0) > 0 || r.poker_chips_won > 0), 'poker');
  const parchis = sortByWins(rankings.filter(r => (r.parchis_games_played || 0) > 0), 'parchis');
  const megamix = sortByWins(rankings.filter(r => (r.megamix_games_played || 0) > 0), 'megamix');
  const clasico = sortByWins(rankings.filter(r => (r.clasico_games_played || 0) > 0), 'clasico');
  const picante = sortByWins(rankings.filter(r => (r.picante_games_played || 0) > 0), 'picante');

  const topPlayer = globalRank[0];
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))] opacity-10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black neon-text text-[hsl(var(--neon-purple))] mb-2">
            🏆 Perfil y Online
          </h1>
          <p className="text-muted-foreground">Comienza una partida para ver tu progreso</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" className="rounded-xl flex gap-2 items-center" onClick={() => setAchOpen(true)}>
              <Trophy className="w-4 h-4" /> Logros
            </Button>
            <Button
              className="rounded-xl flex gap-2 items-center bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black border-none"
              onClick={() => setShopOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" /> Tienda Web
            </Button>
            <Button
              variant="outline"
              className={`rounded-xl flex gap-2 items-center border-white/10 ${screencastActive ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5'}`}
              onClick={handleScreenShare}
            >
              <Monitor className={`w-4 h-4 ${screencastActive ? 'animate-pulse' : ''}`} />
              {screencastActive ? 'PROYECTANDO...' : 'PROYECTAR TV'}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border">
            <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-blue))]" />
            <p className="text-xl font-bold">{totalGames}</p>
            <p className="text-xs text-muted-foreground">Partidas</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border">
            <Users className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-yellow))]" />
            <p className="text-xl font-bold">{rankings.length}</p>
            <p className="text-xs text-muted-foreground">Jugadores</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border">
            <Star className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-orange))]" />
            <p className="text-xl font-bold">Online</p>
            <p className="text-xs text-muted-foreground">Live</p>
          </div>
        </motion.div>

        {/* Mi Perfil Card */}
        {(() => {
          const myProfile = rankings.find(r => r.name.toLowerCase() === localPlayerName.toLowerCase());
          if (!myProfile) return null;

          const xpInfo = getXPProgress(myProfile.xp || 0);

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border-2 border-primary/20 rounded-2xl p-4 mb-6 relative overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    {myProfile.equipped_items?.avatar || myProfile.avatar_url ? <AvatarImage src={myProfile.equipped_items?.avatar || myProfile.avatar_url || ''} /> : null}
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {myProfile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Mi Perfil</h3>
                    <p className="text-sm text-muted-foreground">{myProfile.name}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 mb-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-500">{myProfile.coins || 0}</span>
                  </div>
                  <div className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    Nivel {xpInfo.level}
                  </div>
                </div>
              </div>

              {/* Global XP Bar */}
              <div className="relative z-10 mb-3">
                <div className="flex justify-between text-xs font-bold mb-1 text-muted-foreground">
                  <span>EXP Global: {xpInfo.currentXP} / {xpInfo.neededXP}</span>
                  <span>{xpInfo.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${xpInfo.percent}%` }}
                  />
                </div>
              </div>

              {/* Specific Levels (Poker & Parchis) */}
              <div className="grid grid-cols-2 gap-2 mt-4 relative z-10 border-t border-primary/10 pt-3">
                <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Poker LVL <span className="text-white">{myProfile.poker_level || 1}</span></p>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-amber-500"
                      style={{ width: `${getXPProgress(myProfile.poker_xp || 0).percent}%` }}
                    />
                  </div>
                </div>

                <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Parchís LVL <span className="text-white">{myProfile.parchis_level || 1}</span></p>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                      style={{ width: `${getXPProgress(myProfile.parchis_xp || 0).percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {topPlayer ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-4"
          >
            <Avatar className="h-14 w-14 ring-2 ring-amber-500">
              {topPlayer.avatar_url ? <AvatarImage src={topPlayer.avatar_url} /> : null}
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-500 text-white text-lg">
                {topPlayer.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm text-muted-foreground">👑 Líder del ranking</p>
              <p className="font-bold text-lg">{topPlayer.name}</p>
              <p className="text-sm text-amber-400">
                {topPlayer.games_won || 0} victorias totales
              </p>
            </div>
          </motion.div>
        ) : null}

        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40 p-4 neon-border">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
            <h2 className="font-bold text-lg">Rankings</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando ranking...</div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Tabs defaultValue="global" className="w-full">
                <div className="overflow-x-auto -mx-1 px-1 pb-2">
                  <TabsList className="inline-flex w-auto min-w-full gap-1 mb-4 bg-card/60">
                    <TabsTrigger value="global" className="text-[11px] sm:text-sm px-2">🌎 TOP</TabsTrigger>
                    <TabsTrigger value="megamix" className="text-[11px] sm:text-sm px-2">🎲 Megamix</TabsTrigger>
                    <TabsTrigger value="clasico" className="text-[11px] sm:text-sm px-2">🍻 Clásico</TabsTrigger>
                    <TabsTrigger value="picante" className="text-[11px] sm:text-sm px-2">🌶️ Picante</TabsTrigger>
                    <TabsTrigger value="juego" className="text-[11px] sm:text-sm px-2">🏆 Trivia</TabsTrigger>
                    <TabsTrigger value="poker" className="text-[11px] sm:text-sm px-2">🃏 Poker</TabsTrigger>
                    <TabsTrigger value="parchis" className="text-[11px] sm:text-sm px-2">🎲 Parchís</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="global">
                  <RankingList data={globalRank} mode="global" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="megamix">
                  <RankingList data={megamix} mode="megamix" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="clasico">
                  <RankingList data={clasico} mode="clasico" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="picante">
                  <RankingList data={picante} mode="picante" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="juego">
                  <RankingList data={juego} mode="juego" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="poker">
                  <RankingList data={poker} mode="poker" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>

                <TabsContent value="parchis">
                  <RankingList data={parchis} mode="parchis" onAvatarClick={(url) => { setPreviewAvatar(url); setPreviewOpen(true); }} />
                </TabsContent>
              </Tabs>

              {rankings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 text-muted-foreground"
                >
                  <Trophy className="w-14 h-14 mx-auto mb-3 opacity-30" />
                  <p>Aún no hay jugadores en el ranking</p>
                  <p className="text-sm">¡Juega una partida para aparecer aquí!</p>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {/* Tienda Modal */}
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
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Logros</DialogTitle>
            <DialogDescription>Lista de logros desbloqueados y pendientes.</DialogDescription>
          </DialogHeader>
          {(() => {
            const unlocked = getUnlocked();
            return (
              <div className="space-y-2">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.id} className="rounded-xl border border-white/10 p-3 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{a.label}</div>
                      <div className="text-xs text-white/60">{unlocked[a.id] ? "DESBLOQUEADO" : "BLOQUEADO"}</div>
                    </div>
                    <div className="text-sm text-white/70 mt-1">{a.desc}</div>
                  </div>
                ))}
              </div>
            );
          })()}
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