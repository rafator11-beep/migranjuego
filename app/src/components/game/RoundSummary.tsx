import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw, Home, Users, Star, Medal, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Player, Team, Game } from '@/types/game';
import { PlayerStats } from '@/hooks/useRanking';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

interface RoundSummaryProps {
  game?: Game;
  round?: number;
  players: Player[];
  scores?: Record<string, number>;
  teams?: Team[];
  globalStats?: PlayerStats[];
  onNextRound?: () => void;
  onEndGame?: () => void;
  onContinue?: () => void;
  isGameOver?: boolean;
  trackingData?: {
    voteCounts?: Record<string, number>;
    drinkCounts?: Record<string, number>;
    virusReceived?: Record<string, number>;
    skipCounts?: Record<string, number>;
  };
}

export function RoundSummary({
  game,
  round,
  players,
  scores,
  teams = [],
  globalStats = [],
  onNextRound,
  onEndGame,
  onContinue,
  isGameOver = false,
  trackingData
}: RoundSummaryProps) {
  const [activeTab, setActiveTab] = useState<'partida' | 'global'>('partida');

  // Merge scores if provided
  const playersWithScores = scores
    ? players.map(p => ({ ...p, score: scores[p.id] || 0 }))
    : players;

  const sortedPlayers = [...playersWithScores].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // Team totals: sum player scores by team
  const teamScores = teams.map(team => {
    const teamPlayers = playersWithScores.filter(p => p.team_id === team.id);
    const totalScore = teamPlayers.reduce((sum, p) => sum + p.score, 0);
    return { ...team, totalScore, players: teamPlayers };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const winningTeam = teamScores[0];
  const hasTeams = teams.length > 0;

  // Global stats for participants only
  const participantStats = globalStats.filter(gs =>
    players.some(p => p.name.toLowerCase() === gs.name.toLowerCase())
  );

  // Find "bests" from global stats
  const bestPlayer = participantStats.length > 0
    ? participantStats.reduce((best, p) => (p.games_won > best.games_won ? p : best), participantStats[0])
    : null;
  const mostPlayed = participantStats.length > 0
    ? participantStats.reduce((best, p) => (p.games_played > best.games_played ? p : best), participantStats[0])
    : null;
  const bestFiesta = participantStats.length > 0
    ? participantStats.reduce((best, p) => ((p.fiesta_games_won || 0) > (best.fiesta_games_won || 0) ? p : best), participantStats[0])
    : null;
  const bestPoker = participantStats.length > 0
    ? participantStats.reduce((best, p) => ((p.poker_chips_won || 0) > (best.poker_chips_won || 0) ? p : best), participantStats[0])
    : null;

  useEffect(() => {
    if (isGameOver && winner) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } }), 500);
    }
  }, [isGameOver, winner]);

  const medalEmoji = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;

  // --- 20+ FUN CLASSIFICATIONS ---
  const classifications = (() => {
    if (!isGameOver || sortedPlayers.length < 2) return [];

    const vc = trackingData?.voteCounts || {};
    const dc = trackingData?.drinkCounts || {};
    const vr = trackingData?.virusReceived || {};
    const sc = trackingData?.skipCounts || {};

    const maxBy = (data: Record<string, number>) => {
      let best = ''; let max = -1;
      for (const [id, v] of Object.entries(data)) { if (v > max) { max = v; best = id; } }
      return best;
    };
    const minBy = (data: Record<string, number>, ids: string[]) => {
      let best = ''; let min = Infinity;
      for (const id of ids) { const v = data[id] || 0; if (v < min) { min = v; best = id; } }
      return best;
    };

    const getName = (id: string) => players.find(p => p.id === id)?.name || '???';
    const pIds = players.map(p => p.id);

    const cls: { emoji: string; title: string; player: string; color: string }[] = [];

    // 1. El Fiestero - Mayor puntuación
    cls.push({ emoji: '🔥', title: 'El Fiestero', player: getName(sortedPlayers[0]?.id), color: 'from-orange-500/20 to-red-500/10 border-orange-500/30' });
    // 2. El Santito - Menor puntuación
    cls.push({ emoji: '😇', title: 'El Santito', player: getName(sortedPlayers[sortedPlayers.length - 1]?.id), color: 'from-sky-400/20 to-blue-500/10 border-sky-400/30' });
    // 3. El Borrachín - Más veces bebió
    if (Object.keys(dc).length > 0) cls.push({ emoji: '🍺', title: 'El Borrachín', player: getName(maxBy(dc)), color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30' });
    // 4. El Abstemio - Menos veces bebió
    if (Object.keys(dc).length > 0) cls.push({ emoji: '💧', title: 'El Abstemio', player: getName(minBy(dc, pIds)), color: 'from-cyan-400/20 to-teal-500/10 border-cyan-400/30' });
    // 5. El Infectado - Más virus recibidos
    if (Object.keys(vr).length > 0) cls.push({ emoji: '🧬', title: 'El Infectado', player: getName(maxBy(vr)), color: 'from-green-500/20 to-lime-500/10 border-green-500/30' });
    // 6. Inmune - Menos virus 
    if (Object.keys(vr).length > 0) cls.push({ emoji: '🛡️', title: 'El Inmune', player: getName(minBy(vr, pIds)), color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30' });
    // 7. El Francotirador - Más votado
    if (Object.keys(vc).length > 0) cls.push({ emoji: '🎯', title: 'El Francotirador', player: getName(maxBy(vc)), color: 'from-red-500/20 to-pink-500/10 border-red-500/30' });
    // 8. El Invisible - Menos votado
    if (Object.keys(vc).length > 0) cls.push({ emoji: '👻', title: 'El Invisible', player: getName(minBy(vc, pIds)), color: 'from-gray-500/20 to-slate-500/10 border-gray-500/30' });

    // Random fun classifications (assigned to random players for extra laughs)
    const shuffledIds = [...pIds].sort(() => Math.random() - 0.5);
    const funTitles: { emoji: string; title: string; color: string }[] = [
      { emoji: '👑', title: 'Rey del Drama', color: 'from-purple-500/20 to-violet-500/10 border-purple-500/30' },
      { emoji: '🎭', title: 'El Impostor Nato', color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30' },
      { emoji: '💣', title: 'El Kamikaze', color: 'from-red-600/20 to-orange-500/10 border-red-600/30' },
      { emoji: '🤝', title: 'El Diplomático', color: 'from-green-400/20 to-emerald-500/10 border-green-400/30' },
      { emoji: '🧊', title: 'De Hielo', color: 'from-ice-400/20 to-blue-300/10 border-blue-300/30' },
      { emoji: '😈', title: 'El Diablillo', color: 'from-red-500/20 to-rose-500/10 border-red-500/30' },
      { emoji: '🤡', title: 'El Payaso del Grupo', color: 'from-yellow-400/20 to-amber-500/10 border-yellow-400/30' },
      { emoji: '🔮', title: 'El Adivino', color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30' },
      { emoji: '🎤', title: 'El Showman', color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30' },
      { emoji: '📚', title: 'El Empollón', color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30' },
      { emoji: '💔', title: 'Rompecora zones', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30' },
      { emoji: '🏆', title: 'MVP Absoluto', color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30' },
      { emoji: '🤖', title: 'El Robot Sin Emociones', color: 'from-slate-500/20 to-gray-500/10 border-slate-500/30' },
      { emoji: '👾', title: 'El Troll Supremo', color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30' },
      { emoji: '🌟', title: 'Estrella de la Noche', color: 'from-amber-400/20 to-yellow-500/10 border-amber-400/30' },
      { emoji: '🧑‍🎤', title: 'El Cantante Oculto', color: 'from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30' },
      { emoji: '💤', title: 'El Dormilón', color: 'from-indigo-400/20 to-violet-500/10 border-indigo-400/30' },
      { emoji: '🧙', title: 'El Mago de la Fiesta', color: 'from-purple-400/20 to-indigo-500/10 border-purple-400/30' },
      { emoji: '🍷', title: 'Sommelier Oficial', color: 'from-rose-400/20 to-red-500/10 border-rose-400/30' },
      { emoji: '🚀', title: 'Speed Runner', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30' },
    ];

    // Assign each fun title to a different player
    for (let i = 0; i < Math.min(funTitles.length, shuffledIds.length); i++) {
      // Avoid duplicating a player if possible
      const pId = shuffledIds[i % shuffledIds.length];
      cls.push({ ...funTitles[i], player: getName(pId) });
    }

    return cls;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20 max-w-lg w-full text-center max-h-[90vh] overflow-y-auto">

        {/* Header */}
        {isGameOver ? (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-6xl mb-3">
              🏆
            </motion.div>
            <h1 className="text-3xl font-black neon-text mb-1">¡Fin del Juego!</h1>
            <p className="text-muted-foreground text-sm mb-4">
              {game?.current_round || round || '?'} rondas completadas
            </p>
          </>
        ) : (
          <>
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 10 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }} className="text-5xl mb-3">
              🎉
            </motion.div>
            <h1 className="text-2xl font-bold mb-1">¡Ronda {round || game?.current_round || '?'} Completada!</h1>
            <p className="text-muted-foreground text-sm mb-4">Resumen de resultados</p>
          </>
        )}

        {/* Tab Switcher (only on game over) */}
        {isGameOver && participantStats.length > 0 && (
          <div className="flex gap-2 mb-5 bg-muted/30 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('partida')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'partida' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Trophy className="w-4 h-4 inline mr-1" /> Esta Partida
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'global' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Star className="w-4 h-4 inline mr-1" /> Estadísticas
            </button>
          </div>
        )}

        {activeTab === 'partida' && (
          <>
            {/* TEAM TOTALS */}
            {hasTeams && teamScores.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Puntuación por Equipos</h3>
                </div>
                <div className="space-y-3">
                  {teamScores.map((team, i) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className={`rounded-2xl p-4 border ${i === 0 ? 'bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'bg-muted/30 border-white/10'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{medalEmoji(i)}</span>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                          <span className="font-bold text-white">{team.name}</span>
                        </div>
                        <span className={`text-2xl font-black ${i === 0 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                          {team.totalScore} pts
                        </span>
                      </div>
                      {/* Team members */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.players.sort((a, b) => b.score - a.score).map(p => (
                          <span key={p.id} className="text-xs bg-black/20 px-2 py-0.5 rounded-full text-muted-foreground">
                            {p.name} ({p.score})
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* INDIVIDUAL WINNER */}
            {winner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 rounded-2xl p-5 mb-5 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
              >
                <div className="flex items-center justify-center gap-3">
                  <Crown className="h-7 w-7 text-yellow-500" />
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-widest text-yellow-400/80 font-bold">
                      {isGameOver ? 'MVP de la Partida' : 'Líder actual'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-10 w-10 border-2 border-yellow-500">
                        {winner.avatar_url ? (
                          <AvatarImage src={winner.avatar_url} />
                        ) : (
                          <AvatarFallback>{winner.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-bold text-xl text-white">{winner.name}</span>
                      <span className="text-2xl font-black text-yellow-400">{winner.score} pts</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ALL PLAYERS RANKING */}
            <div className="mb-5">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Ranking Individual</h3>
              <div className="space-y-1.5">
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl ${index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : index === 1 ? 'bg-gray-400/10 border border-gray-400/10' : index === 2 ? 'bg-amber-700/10 border border-amber-700/10' : 'bg-muted/30'}`}
                  >
                    <span className="w-7 text-center font-bold">
                      {medalEmoji(index)}
                    </span>
                    <Avatar className="h-8 w-8">
                      {player.avatar_url ? (
                        <AvatarImage src={player.avatar_url} />
                      ) : (
                        <AvatarFallback className="text-xs">{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="flex-1 text-left font-medium text-sm">{player.name}</span>
                    <span className="font-bold text-lg">{player.score}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 20+ FUN CLASSIFICATIONS */}
            {isGameOver && classifications.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Clasificaciones de la Partida</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {classifications.slice(0, 20).map((cls, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className={`bg-gradient-to-br ${cls.color} rounded-xl p-2.5 border text-center`}
                    >
                      <span className="text-lg">{cls.emoji}</span>
                      <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">{cls.title}</p>
                      <p className="font-bold text-xs text-white truncate">{cls.player}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* GLOBAL STATS TAB */}
        {activeTab === 'global' && participantStats.length > 0 && (
          <div className="mb-5 space-y-4">
            <div className="text-center mb-3">
              <Sparkles className="w-6 h-6 inline text-primary mb-1" />
              <h3 className="font-bold text-lg">Mejores Estadísticas Globales</h3>
              <p className="text-xs text-muted-foreground">Datos acumulados de todas las partidas</p>
            </div>

            {/* Best Stats Highlight Cards */}
            <div className="grid grid-cols-2 gap-3">
              {bestPlayer && bestPlayer.games_won > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-yellow-500/15 to-amber-500/5 rounded-2xl p-3 border border-yellow-500/20 text-center"
                >
                  <Medal className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase tracking-wider text-yellow-400/80 font-bold">Más Victorias</p>
                  <p className="font-bold text-sm text-white truncate">{bestPlayer.name}</p>
                  <p className="text-xl font-black text-yellow-400">{bestPlayer.games_won}</p>
                </motion.div>
              )}

              {mostPlayed && mostPlayed.games_played > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-500/15 to-cyan-500/5 rounded-2xl p-3 border border-blue-500/20 text-center"
                >
                  <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase tracking-wider text-blue-400/80 font-bold">Más Partidas</p>
                  <p className="font-bold text-sm text-white truncate">{mostPlayed.name}</p>
                  <p className="text-xl font-black text-blue-400">{mostPlayed.games_played}</p>
                </motion.div>
              )}

              {bestFiesta && (bestFiesta.fiesta_games_won || 0) > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-pink-500/15 to-rose-500/5 rounded-2xl p-3 border border-pink-500/20 text-center"
                >
                  <span className="text-lg">🎉</span>
                  <p className="text-[10px] uppercase tracking-wider text-pink-400/80 font-bold">Rey Fiesta</p>
                  <p className="font-bold text-sm text-white truncate">{bestFiesta.name}</p>
                  <p className="text-xl font-black text-pink-400">{bestFiesta.fiesta_games_won}</p>
                </motion.div>
              )}

              {bestPoker && (bestPoker.poker_chips_won || 0) > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-green-500/15 to-emerald-500/5 rounded-2xl p-3 border border-green-500/20 text-center"
                >
                  <span className="text-lg">🃏</span>
                  <p className="text-[10px] uppercase tracking-wider text-green-400/80 font-bold">Crack Poker</p>
                  <p className="font-bold text-sm text-white truncate">{bestPoker.name}</p>
                  <p className="text-xl font-black text-green-400">{bestPoker.poker_chips_won}</p>
                </motion.div>
              )}
            </div>

            {/* Per-player stats table */}
            <div className="mt-3">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Tus Jugadores</h4>
              <div className="space-y-2">
                {participantStats.sort((a, b) => b.games_won - a.games_won).map((ps, i) => (
                  <motion.div key={ps.user_id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-white/5"
                  >
                    <Avatar className="h-8 w-8">
                      {ps.avatar_url ? (
                        <AvatarImage src={ps.avatar_url} />
                      ) : (
                        <AvatarFallback className="text-xs">{ps.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm truncate">{ps.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {ps.games_played} partidas · {ps.games_won} victorias
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        🎉{ps.fiesta_games_won || 0} · 🎮{ps.juego_games_won || 0}
                      </p>
                      {(ps.poker_chips_won || 0) > 0 && (
                        <p className="text-xs text-green-400">🃏{ps.poker_chips_won}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          {(onEndGame || onContinue) && (
            <Button variant="outline" onClick={onEndGame || onContinue} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              {onEndGame ? "Terminar" : "Cerrar"}
            </Button>
          )}

          {!isGameOver && (onNextRound || onContinue) && (
            <Button onClick={onNextRound || onContinue} className="flex-1">
              {onNextRound ? "Siguiente Ronda" : "Continuar"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {isGameOver && (onEndGame || onContinue) && (
            <Button onClick={onEndGame || onContinue} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Nueva Partida
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
