import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Clock, Users, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { GAME_MODES } from '@/types/game';

interface GameRecord {
  id: string;
  mode: string;
  created_at: string;
  status: string;
  players: string[];
  winner: string | null;
  duration: number;
}

interface GameHistoryProps {
  onRejoinGame?: (gameId: string, mode: string) => void;
}

export function GameHistory({ onRejoinGame }: GameHistoryProps) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameHistory();
  }, []);

  const loadGameHistory = async () => {
    try {
      // 1. Load Local History (Instant & Offline)
      const localHistoryJson = localStorage.getItem('partyGameHistory');
      let localGames: GameRecord[] = [];
      if (localHistoryJson) {
        try {
          localGames = JSON.parse(localHistoryJson);
        } catch (e) {
          console.error('Error parsing local history', e);
        }
      }

      // 2. Try Supabase (Online)
      let supabaseGames: GameRecord[] = [];
      if (typeof supabase !== 'undefined') {
        const { data: gamesData, error } = await supabase
          .from('games')
          .select(`
              id,
              mode,
              created_at,
              status,
              players (name)
            `)
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && gamesData) {
          supabaseGames = (gamesData).map((game: any) => ({
            id: game.id,
            mode: game.mode,
            created_at: game.created_at,
            status: game.status,
            players: game.players?.map((p: any) => p.name) || [],
            winner: null,
            duration: Math.floor(Math.random() * 15) + 3,
          }));
        }
      }

      // Merge: Local moves usually come first if they are newer, but let's just combine unique IDs
      // For now, if local exists, show local + supabase.
      const combined = [...localGames, ...supabaseGames];
      // Deduplicate by ID
      const uniqueGames = Array.from(new Map(combined.map(g => [g.id, g])).values());
      // Sort by date desc
      uniqueGames.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setGames(uniqueGames);
    } catch (err) {
      console.error('Error loading game history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModeInfo = (modeId: string) => {
    return GAME_MODES.find(m => m.id === modeId) || { name: modeId, icon: '🎮', color: 'from-gray-500 to-gray-600' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const totalGames = games.length;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[hsl(var(--neon-blue))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-black neon-text text-[hsl(var(--neon-purple))] mb-2">Historial</h1>
          <p className="text-muted-foreground">Revive tus partidas anteriores</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 text-center neon-border">
            <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--neon-blue))]" />
            <p className="text-2xl font-bold">{totalGames}</p>
            <p className="text-xs text-muted-foreground">Partidas jugadas</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 text-center neon-border">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--neon-yellow))]" />
            <p className="text-2xl font-bold">{games.filter(g => g.status === 'finished').length}</p>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Cargando historial...
            </div>
          ) : games.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No hay partidas en el historial</p>
              <p className="text-sm">¡Empieza a jugar para ver tu historial!</p>
            </motion.div>
          ) : (
            games.map((game, index) => {
              const modeInfo = getModeInfo(game.mode);
              const canRejoin = game.status === 'finished' || game.status === 'playing' || game.status === 'round_end';
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 neon-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{modeInfo.icon}</span>
                      <div>
                        <p className="font-bold">{modeInfo.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(game.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${game.status === 'finished' ? 'bg-green-500/20 text-green-500' :
                          game.status === 'playing' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        {game.status === 'finished' ? 'Finalizada' : game.status === 'playing' ? 'En juego' : game.status}
                      </span>
                    </div>
                  </div>

                  {game.players.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {game.players.join(', ')}
                    </div>
                  )}

                  {canRejoin && onRejoinGame && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => onRejoinGame(game.id, game.mode)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {game.status === 'finished' ? 'Reentrar en partida' : 'Continuar partida'}
                    </Button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
