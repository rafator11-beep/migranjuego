import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserX, Vote, Clock, ThumbsUp, ThumbsDown, ArrowLeft, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';

interface ImpostorRoundProps {
  players: Player[];
  impostorPlayerId: string;
  realQuestion: string;
  impostorQuestion: string;
  onComplete: (impostorCaught: boolean, votedPlayerId?: string) => void;
  onExit: () => void;
}

export function ImpostorRound({ 
  players, 
  impostorPlayerId, 
  realQuestion, 
  impostorQuestion, 
  onComplete, 
  onExit 
}: ImpostorRoundProps) {
  const [phase, setPhase] = useState<'reveal' | 'discussion' | 'voting' | 'result'>('reveal');
  const [revealedPlayers, setRevealedPlayers] = useState<Set<string>>(new Set());
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [discussionTime, setDiscussionTime] = useState(30);
  const [mostVotedId, setMostVotedId] = useState<string>('');

  // Discussion timer
  useEffect(() => {
    if (phase !== 'discussion' || discussionTime <= 0) return;
    
    const timer = setInterval(() => {
      setDiscussionTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('voting');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, discussionTime]);

  const handleReveal = (playerId: string) => {
    setRevealedPlayers(prev => new Set([...prev, playerId]));
    
    // Check if all players have seen their card
    if (revealedPlayers.size + 1 >= players.length) {
      setTimeout(() => setPhase('discussion'), 1000);
    }
  };

  const handleVote = (voterId: string, suspectId: string) => {
    const newVotes = { ...votes, [voterId]: suspectId };
    setVotes(newVotes);
    
    // Check if all votes are in
    if (Object.keys(newVotes).length >= players.length) {
      setTimeout(() => calculateResult(newVotes), 500);
    }
  };

  const calculateResult = (finalVotes: Record<string, string>) => {
    // Count votes
    const voteCounts: Record<string, number> = {};
    Object.values(finalVotes).forEach(suspectId => {
      voteCounts[suspectId] = (voteCounts[suspectId] || 0) + 1;
    });
    
    // Find most voted
    let maxVotes = 0;
    let voted = '';
    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        voted = id;
      }
    });
    
    setMostVotedId(voted);
    setPhase('result');
    
    // Delay before completing
    setTimeout(() => {
      onComplete(voted === impostorPlayerId, voted);
    }, 4000);
  };

  const getPlayerQuestion = (playerId: string) => {
    return playerId === impostorPlayerId ? impostorQuestion : realQuestion;
  };

  const getImpostor = () => players.find(p => p.id === impostorPlayerId);
  
  const wasImpostorCaught = () => mostVotedId === impostorPlayerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <ArrowLeft className="w-6 h-6 text-white/80" />
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-white/10 backdrop-blur-sm">
              <UserX className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white">RONDA IMPOSTOR</span>
            </div>
          </motion.div>
          <div className="w-10" />
        </div>

        {/* Reveal Phase */}
        {phase === 'reveal' && (
          <div className="space-y-4">
            <p className="text-center text-white/60 mb-4 text-sm">
              Cada jugador debe tocar su nombre para ver su pregunta en secreto
            </p>
            
            {players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {revealedPlayers.has(player.id) ? (
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-white/10 backdrop-blur-sm text-center">
                    <span className="text-green-400 text-sm">✓ {player.name} ya vio su pregunta</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      alert(`🤫 ${player.name}, tu pregunta es:\n\n"${getPlayerQuestion(player.id)}"\n\n¡No la digas en voz alta!`);
                      handleReveal(player.id);
                    }}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm"
                  >
                    <UserX className="w-5 h-5 mr-2" />
                    {player.name}: Toca para ver tu pregunta
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Discussion Phase */}
        {phase === 'discussion' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-6 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-3xl border border-white/10 backdrop-blur-xl">
              <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-2 text-white">¡Discusión!</h2>
              <p className="text-white/60 mb-4 text-sm">
                Cada uno debe decir su respuesta. ¡Descubrid al impostor!
              </p>
              
              <div className="text-4xl font-mono font-bold text-yellow-500 mb-4">
                {discussionTime}s
              </div>
              
              <p className="text-sm text-white/40 italic">
                💡 Pista: Las preguntas son parecidas pero diferentes...
              </p>
            </div>

            <Button 
              onClick={() => setPhase('voting')} 
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm"
            >
              <Vote className="w-5 h-5 mr-2" />
              Pasar a votación
            </Button>
          </motion.div>
        )}

        {/* Voting Phase */}
        {phase === 'voting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center mb-4 text-white">
              <Vote className="w-6 h-6 inline mr-2" />
              ¿Quién es el impostor?
            </h2>
            
            {players.map((voter) => (
              <div key={voter.id} className="space-y-2">
                <p className="text-sm font-medium text-white">{voter.name} vota a:</p>
                <div className="grid grid-cols-2 gap-2">
                  {players.filter(p => p.id !== voter.id).map((suspect) => (
                    <Button
                      key={suspect.id}
                      variant={votes[voter.id] === suspect.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(voter.id, suspect.id)}
                      disabled={!!votes[voter.id]}
                      className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    >
                      {suspect.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(votes).length >= players.length && (
              <Button onClick={() => calculateResult(votes)} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm">
                Ver resultado
              </Button>
            )}
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className={`p-8 rounded-3xl ${wasImpostorCaught() ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-rose-500/20'} border border-white/10 backdrop-blur-xl`}>
              <div className="text-6xl mb-4">
                {wasImpostorCaught() ? '🎉' : '😈'}
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-white">
                {wasImpostorCaught() ? '¡Impostor descubierto!' : '¡El impostor ha escapado!'}
              </h2>
              
              <p className="text-lg mb-4 text-white">
                El impostor era: <strong>{getImpostor()?.name}</strong>
              </p>
              
              <div className="text-sm text-white/60 space-y-1">
                <p>Pregunta normal: "{realQuestion}"</p>
                <p>Pregunta impostor: "{impostorQuestion}"</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              {wasImpostorCaught() ? (
                <div className="flex items-center gap-2 text-green-400">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-white">El grupo gana +20 puntos</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-white">{getImpostor()?.name} gana +50 puntos</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
