import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Trophy, ArrowLeft, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';

interface DueloComponentProps {
  dueloText: string;
  player1: Player;
  player2: Player;
  onWinner: (winner: Player) => void;
  onSkip: () => void;
}

export function DueloComponent({ dueloText, player1, player2, onWinner, onSkip }: DueloComponentProps) {
  const [phase, setPhase] = useState<'duel' | 'result'>('duel');
  const [winner, setWinner] = useState<Player | null>(null);

  // TTS Removed
  useEffect(() => {
    if (!dueloText) return;
    window.speechSynthesis.cancel();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [dueloText]);

  const handleDeclareWinner = (winningPlayer: Player) => {
    setWinner(winningPlayer);
    setPhase('result');

    setTimeout(() => {
      onWinner(winningPlayer);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 p-4">
      <div className="max-w-lg mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onSkip}>
            <ArrowLeft className="w-6 h-6 text-white/80" />
          </Button>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-white/10 backdrop-blur-sm">
            <Swords className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-white">¡DUELO!</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Duel Phase */}
        {phase === 'duel' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Players Face Off */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden border border-white/10 backdrop-blur-sm">
                  {player1?.avatar_url ? (
                    <img src={player1.avatar_url} alt={player1.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{player1?.name?.charAt(0) || '?'}</span>
                  )}
                </div>
                <p className="font-bold text-white">{player1?.name || 'Jugador 1'}</p>
              </div>

              <span className="text-4xl animate-pulse">⚔️</span>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-2 shadow-lg overflow-hidden border border-white/10 backdrop-blur-sm">
                  {player2?.avatar_url ? (
                    <img src={player2.avatar_url} alt={player2.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{player2?.name?.charAt(0) || '?'}</span>
                  )}
                </div>
                <p className="font-bold text-white">{player2?.name || 'Jugador 2'}</p>
              </div>
            </div>

            {/* Duelo Description */}
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-3xl p-6 text-center border border-white/10 backdrop-blur-xl">
              <p className="text-xl font-medium leading-relaxed text-white">{dueloText}</p>
            </div>

            {/* Winner Selection */}
            <p className="text-center text-sm text-white/60">
              ¿Quién ha ganado el duelo?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleDeclareWinner(player1)}
                className="py-8 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-white/10 backdrop-blur-sm"
              >
                <Trophy className="w-6 h-6 mr-2" />
                {player1?.name || 'Jugador 1'}
              </Button>
              <Button
                onClick={() => handleDeclareWinner(player2)}
                className="py-8 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-white/10 backdrop-blur-sm"
              >
                <Trophy className="w-6 h-6 mr-2" />
                {player2?.name || 'Jugador 2'}
              </Button>
            </div>

            {/* Skip */}
            <Button variant="ghost" onClick={onSkip} className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <SkipForward className="w-4 h-4 mr-2" />
              Saltar duelo
            </Button>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && winner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold mb-4 text-white">¡{winner.name} gana!</h3>
            <p className="text-2xl text-primary font-semibold text-white">+50 puntos</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
