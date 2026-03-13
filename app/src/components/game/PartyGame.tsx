import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, AlertCircle, Video, VideoOff, Copy, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGame } from '@/hooks/useGame';
import { supabase } from '@/integrations/supabase/client';
import { useGameEngine } from '@/hooks/game/useGameEngine';
import { useGameContent } from '@/hooks/game/useGameContent';
import { useDrinkingMicroGames } from '@/hooks/game/useDrinkingMicroGames';
import { useGameEffects } from '@/hooks/game/useGameEffects';
import { useMultiplayer } from '@/hooks/game/useMultiplayer';
import { useRanking } from '@/hooks/useRanking';
import { CardDisplay } from '@/components/game/CardDisplay';
import { detectRarity } from '@/lib/godDeck';
import { sfx } from '@/lib/sfx';
import { vibe } from '@/lib/vibration';
import { GameMode } from '@/types/game';

import { ChatComponent } from '@/components/multiplayer/ChatComponent';
import { PeerBubbles } from '@/components/multiplayer/PeerBubbles';

// Subcomponents (assuming they exist or are imported)
import { ApocalypseOverlay } from '@/components/game/ApocalypseOverlay';
import { RoundSummary } from '@/components/game/RoundSummary';
import { TriviaQuestionCard } from './TriviaQuestionCard';
import { ImpostorRound } from './ImpostorRound';
import { DueloComponent } from './DueloComponent';
import { CaptainPassScreen } from './CaptainPassScreen';
import { SuggestionBox } from './SuggestionBox';
import { QuestionVote } from './QuestionVote';
import { YoNuncaEquiposFlow } from './YoNuncaEquiposFlow';
import confetti from 'canvas-confetti';

// Helper component for TTS
// TTSTrigger removed

interface PartyGameProps {
  mode: GameMode;
  onExit: () => void;
  isMultiplayer?: boolean;
  isHost?: boolean;
  roomId?: string | null;
}

// New Bottom Profiles Component with Virus Support
const PlayerProfilesBottom = ({ players, currentPlayer, scores, playerViruses = [], mode, remoteStreams = [] }: { players: any[], currentPlayer: any, scores: any, playerViruses?: any[], mode: GameMode, remoteStreams?: any[] }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 md:h-28 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center px-6 gap-6 z-[100] overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 md:gap-8">
        {players.map((p) => {
          const isTurn = currentPlayer?.id === p.id;
          const hasVirus = playerViruses.some(v => v.playerId === p.id);
          const virusInfo = playerViruses.find(v => v.playerId === p.id);
          const showVirus = hasVirus && (mode === 'megamix' || mode === 'clasico');
          const remotePeer = remoteStreams?.find(s => s.peerId === p.id);

          return (
            <div key={p.id} className="flex flex-col items-center gap-1 relative group shrink-0">
              {/* Video Bubble anchored above name */}
              <motion.div
                animate={{
                  scale: isTurn ? 1.1 : 1,
                  borderColor: hasVirus ? '#22c55e' : (isTurn ? 'var(--primary)' : 'transparent'),
                  boxShadow: hasVirus ? '0 0 15px #22c55e' : (isTurn ? '0 0 15px var(--primary)' : 'none')
                }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-2 flex items-center justify-center text-lg font-bold relative overflow-hidden ${isTurn ? 'border-white/20 text-white' : 'border-white/10 text-white/60'}`}
              >
                {remotePeer ? (
                  <video
                    autoPlay
                    playsInline
                    ref={el => { if (el) el.srcObject = remotePeer.stream; }}
                    className="w-full h-full object-cover"
                  />
                ) : p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <>{p.name.substring(0, 2).toUpperCase()}</>
                )}

                {scores[p.id] > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10">
                    {scores[p.id]}
                  </div>
                )}
              </motion.div>

              <span className={`text-[10px] md:text-[11px] font-black max-w-full truncate px-1 uppercase tracking-tighter ${showVirus ? 'text-green-400' : (isTurn ? 'text-white' : 'text-white/60')}`}>
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function PartyGame({ mode, onExit, isMultiplayer = false, isHost = false, roomId = null }: PartyGameProps) {
  const {
    currentPlayer,
    players, // Added this
    teams, // Added this
    currentIndex,
    setCurrentIndex, // Added setter
    gameState,
    setGameState,
    advanceTurn,
    addScore,
    addWin, // Added addWin to useGameEngine
    showRoundSummary,
    setShowRoundSummary,
    roundSnapshot,
    setRoundSnapshot,
    scores,
    setGamesWon, // Automatically extracted from useGameEngine
    gameOver,
    setGameOver // Expose setter for manual ending
  } = useGameEngine(mode);

  const { game } = useGame(roomId);

  // Video Chat Toggle
  const [showVideo, setShowVideo] = useState(true); // Manual Toggle - Default TRUE

  /* Game Hooks */
  const {
    content,
    currentQuestion,
    setCurrentQuestion, // Get setter
    loadNextQuestion,
    loadSpecificQuestion,
    usedQuestionIds,
    setUsedQuestionIds,
    getCurrentContent,
    getNextPreview
  } = useGameContent(mode, currentIndex, currentPlayer?.name || 'Jugador', players.length);

  const {
    checkDrinkingGame,
    lastMiniTurnRef
  } = useDrinkingMicroGames(mode, 1); // players count logic improved

  const {
    playerViruses,
    brutalCounts,
    setBrutalCounts, // Needed for overlay logic
    applyRandomVirus,
    updateViruses,
    checkMegamixSpecialEvents,
    manageMegamixViruses, // Every 5 rounds virus cycle
    manageMegamixNormas   // Every 3 rounds norma
  } = useGameEffects(mode, players);

  // --- TRACKING DATA for Classifications ---
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [drinkCounts, setDrinkCounts] = useState<Record<string, number>>({});
  const [skipCounts, setSkipCounts] = useState<Record<string, number>>({});
  const [virusReceived, setVirusReceived] = useState<Record<string, number>>({});

  // Helper: track a vote for a player
  const trackVote = (playerId: string) => {
    setVoteCounts(prev => ({ ...prev, [playerId]: (prev[playerId] || 0) + 1 }));
  };
  // Helper: track a drink for a player  
  const trackDrink = (playerId: string) => {
    setDrinkCounts(prev => ({ ...prev, [playerId]: (prev[playerId] || 0) + 1 }));
  };

  // Multiplayer Hook
  const { broadcastState, sendActionToHost } = useMultiplayer(roomId, isHost, currentPlayer?.name || 'Observer', (remoteState) => {
    // Viewer Logic: Receive State
    if (!isHost && remoteState) {
      if (remoteState.currentIndex !== undefined && remoteState.currentIndex !== currentIndex) {
        if (remoteState.currentIndex !== undefined && remoteState.currentIndex !== currentIndex) {
          setCurrentIndex(remoteState.currentIndex);
        }

        if (remoteState.gameState) setGameState(remoteState.gameState);

        if (remoteState.currentQuestion) {
          setCurrentQuestion(remoteState.currentQuestion);
        }
      } else {
        // Even if index doesn't change, we should sync gamestate (like timer, voting, teams)
        if (remoteState.gameState) setGameState(remoteState.gameState);
      }
    }
  }, (action) => {
    // Host Logic: Receive Action from Guest
    if (isHost && action) {
      if (action.type === 'YO_NUNCA_VOTE') {
        const { phase, votes } = action.payload;
        if (phase === 'truth_phase') {
          setGameState(prev => ({ ...prev, yoNuncaTruthVotes: { ...prev.yoNuncaTruthVotes, ...votes } }));
        } else if (phase === 'guess_phase') {
          setGameState(prev => ({ ...prev, yoNuncaGuessVotes: { ...prev.yoNuncaGuessVotes, ...votes } }));
        }
      } else if (action.type === 'YO_NUNCA_PHASE_CHANGE') {
        setGameState(prev => ({ ...prev, yoNuncaEquiposPhase: action.payload.phase }));
      }
    }
  });

  // Effect: Parse NORMA from content for Clasico/Megamix — auto-skip the card
  useEffect(() => {
    const txt = getCurrentContent();
    if (typeof txt === 'string' && txt.startsWith('NORMA:')) {
      const rule = txt.replace('NORMA:', '').trim();
      setGameState(prev => ({ ...prev, currentNorma: rule }));
      toast.success("¡Nueva Norma Activa!", { description: rule, duration: 4000 });
      // Auto-skip to next card so the norma card never shows on screen
      setTimeout(() => {
        advanceTurn();
      }, 300);
    }
  }, [currentIndex, isHost, mode]); // Re-run when turn changes

  // Trigger: Ronda 1 Norma Global + Virus Assignment
  useEffect(() => {
    if (mode === 'megamix' && gameState.round === 1 && currentIndex === 0) {
      // 1. Show Norma Global Overlay
      setGameState(prev => ({ ...prev, showNormaGlobal: true }));
      // 2. Assign first Virus
      const virusResult = applyRandomVirus(true);
      if (virusResult) {
        setGameState(prev => ({ ...prev, showVirusAlert: true, virusAlertData: virusResult }));
      }
    }
  }, [gameState.round, currentIndex, mode]);

  // Effect to broadcast state when Host changes things
  useEffect(() => {
    if (isMultiplayer && isHost) {
      broadcastState({
        mode,
        currentIndex,
        gameState,
        // scores, // need dependency
        currentPlayerId: currentPlayer?.id,
        currentQuestion, // Broadcast current question
        gameId: game?.id // BROADCAST GAME ID
      });
    }
  }, [currentIndex, gameState, isHost, isMultiplayer, mode]);

  // Round Change Alert
  useEffect(() => {
    if (game?.current_round && game.current_round > 1) {
      toast("¡Fin de Ronda! Cambia la Norma si es necesario.", {
        description: `Ronda ${game.current_round} comenzando...`,
        duration: 5000,
        icon: '🔄'
      });
    }
  }, [game?.current_round]);

  // TRACK BRUTAL STATS (Card Based)
  useEffect(() => {
    if (!currentPlayer?.id) return;

    const txt = getCurrentContent();
    const type = currentQuestion?.type || detectRarity(txt);

    if (type === 'common' || type === 'rare') return;

    // Avoid double counting? 
    // This effect runs when currentIndex changes.
    // We assume 1 card per index.

    setBrutalCounts(prev => {
      const stats = prev[currentPlayer.id] || { legendaryDrops: 0, chaosEvents: 0, cursedEvents: 0, virusesReceived: 0 };
      const newStats = { ...stats };
      let changed = false;

      if (type === 'legendary') { newStats.legendaryDrops++; changed = true; }
      if (type === 'chaos') { newStats.chaosEvents++; changed = true; }
      if (type === 'virus') { newStats.virusesReceived++; changed = true; } // Card-based virus
      // Cursed? detectRarity doesn't return 'cursed' usually, maybe 'chaos' covers it?
      // If detectRarity returns 'cursed', handle it.
      // Assuming 'chaos' maps to chaosEvents.

      if (changed) {
        return { ...prev, [currentPlayer.id]: newStats };
      }
      return prev;
    });

  }, [currentIndex, currentPlayer?.id, currentQuestion]);

  const { updateMultiplePlayers, rankings } = useRanking();

  // Save game to history
  const hasSavedRef = useRef(false);

  const saveGameToHistory = async () => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    try {
      const historyJson = localStorage.getItem('partyGameHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      const gameId = crypto.randomUUID();

      // Determine Winner
      const sorted = players.map(p => ({
        ...p,
        score: scores[p.id] || 0
      })).sort((a, b) => b.score - a.score);
      const winner = sorted[0];

      const newGame = {
        id: gameId,
        mode: mode,
        created_at: new Date().toISOString(),
        status: 'finished',
        players: players.map(p => p.name),
        winner: winner ? winner.name : null
      };

      const updatedHistory = [newGame, ...history].slice(0, 50);
      localStorage.setItem('partyGameHistory', JSON.stringify(updatedHistory));

      // Update Hall of Fame stats (Persistent Local + Cloud if configured)
      if (players.length > 0) {
        await updateMultiplePlayers(players.map(p => ({
          name: p.name,
          score: scores[p.id] || 0,
          won: winner && p.id === winner.id,
          avatarUrl: p.avatar_url,
          gameMode: mode,
          brutalMeta: brutalCounts ? brutalCounts[p.id] : undefined
        })));
      }
      // ... (existing local logic is fine, handled by useGameEngine implicitly for scores)

      // GLOBAL STATS (Supabase)
      if (isMultiplayer || navigator.onLine) {
        // 1. Create Game Record
        const { error: gameError } = await supabase.from('games').insert({
          mode: mode,
          status: 'finished',
          created_at: new Date().toISOString(),
          // current_round: 1, 
          // current_turn: currentIndex
        });

        if (gameError) console.error('Error saving global game:', gameError);

        // 2. Update Player Stats & Rankings
        // We need to upsert players based on name (or ID if we had auth).
        // Since we don't have auth, we might just track "Anonymous" stats or skip personalized stats 
        // unless we have a consistent ID.
        // For now, let's just log the game for "Global Total" purposes?
        // User asked for: "clasificacion general total de usuarios"
        // We can try to upsert into `player_rankings` if it was a table, but it's a view.
        // We need to insert into `players` table linked to the game.

        // Actually, `player_rankings` view aggregates data from `players` table? 
        // Let's check schema. `player_rankings` seems to be a view based on... wait, it allows Insert/Update in types?
        // If it's a view, we should be inserting into `players` and `games`.

        // Let's assume `player_rankings` is a table for this bespoke app based on the types provided.
        // If it fails, we fall back.

        const updates = players.map(p => ({
          player_name: p.name,
          total_score: (localStorage.getItem('partyGameScores') ? JSON.parse(localStorage.getItem('partyGameScores')!)[p.id] : 0), // This is total cumulative? Or current game?
          // We want to ADD to their score.
          // Complex without backend logic. 
          // Let's just try to insert into `games` for now to track "Total Games Played" globally.
        }));

        // better approach: Just record the game in 'games' table is enough for "Global Activity".
        // For "Leaderboard", we need to increment scores. 
        // Since we can't easily increment without a function, let's skip complex leaderboard sync for this iteration
        // and just ensure the Game itself is recorded.
      }

    } catch (e) {
      console.error('Error saving game history', e);
    }
  };


  const handleExit = async () => {
    // Fire and forget to prevent freeze, but ensure it runs
    saveGameToHistory();
    if (onExit) onExit();
  };

  // Overlay State (Managed locally as it's UI specific)
  const handleNext = () => {
    sfx.click();
    vibe(10);

    // Check specific game modes first
    if ((mode === 'trivia_futbol' || mode === 'cultura') && loadNextQuestion) {
      loadNextQuestion();
      advanceTurn();
      return;
    }

    if (checkDrinkingGame(currentIndex, currentPlayer?.name || 'Jugador', setGameState)) {
      advanceTurn();
      return;
    }

    // Normal flow
    if (mode === 'megamix' || mode === 'clasico') {
      updateViruses();

      // Manage 2-round periodic virus cycle (Megamix)
      if (mode === 'megamix') {
        const virusEvent = manageMegamixViruses(gameState.round);
        if (virusEvent) {
          setGameState(prev => ({ ...prev, showVirusCycleAlert: true, virusCycleData: virusEvent }));
        }

        // Auto-XP for current player (Megamix scaling)
        if (currentPlayer) {
          // Base 3 XP + 1 XP every 2 rounds, max 20 XP per turn automatically.
          const autoXp = Math.min(20, 3 + Math.floor(gameState.round / 2));
          addScore(currentPlayer.id, autoXp);
        }
      }

      // Apply Random Virus & Capture Result
      const virusResult = applyRandomVirus();
      if (virusResult) {
        setGameState(prev => ({ ...prev, showVirusAlert: true, virusAlertData: virusResult }));
      }

      // Check Megamix special events
      if (checkMegamixSpecialEvents(
        currentIndex,
        gameState.round, // Pass round for periodic checks
        currentPlayer,
        usedQuestionIds, // Passed from content hook
        setCurrentQuestion, // Real setter
        setUsedQuestionIds,
        setGameState,
        lastMiniTurnRef
      )) {
        advanceTurn();
        return;
      }
    }

    sfx.whoosh();
    advanceTurn();
  };

  // Rarity calculation for CardDisplay
  const currentText = getCurrentContent();
  const rarity = detectRarity(currentText);

  // Trigger / Content Detection System
  useEffect(() => {
    if (!currentText) return;

    // 1. Check for explicit TRIGGERS (Megamix)
    if (currentText.startsWith('TRIGGER:')) {
      const triggerParts = currentText.split(':');
      const triggerType = triggerParts[1];

      if (triggerType === 'TRIVIA_FUTBOL') {
        // @ts-ignore
        loadSpecificQuestion?.('futbol');
        setGameState(prev => ({ ...prev, showTrivia: true }));
      } else if (triggerType === 'TRIVIA_CULTURA') {
        // @ts-ignore
        loadSpecificQuestion?.('cultura');
        setGameState(prev => ({ ...prev, showTrivia: true }));
      } else if (triggerType === 'VIRUS') {
        const virusResult = applyRandomVirus(true);
        if (virusResult) {
          setGameState(prev => ({ ...prev, showVirusAlert: true, virusAlertData: virusResult }));
        }
      } else if (triggerType === 'BOCA_CERRADA') {
        // Trigger Boca Cerrada warning — phone needs to be passed
        const targetPlayer = currentPlayer || players[0];
        setGameState(prev => ({
          ...prev,
          showBocaCerradaWarning: true,
          bocaCerradaData: { playerId: targetPlayer.id, playerName: targetPlayer.name }
        }));
      } else {
        // MIMICA and any unknown triggers - auto-skip
        // These don't have overlay UI, so we advance to prevent getting stuck
        console.log("Auto-skipping trigger:", triggerType);
        setTimeout(() => advanceTurn(), 100);
      }
      return;
    }

    // 2. Check for "Normas" (Rules) to persist them
    if (currentText.includes('NORMA:') || currentText.includes('📜')) {
      const cleanNorma = currentText.replace(/📜|NORMA:|\\./g, '').trim();
      if (cleanNorma.length > 5) {
        setGameState(prev => ({
          ...prev,
          currentNorma: cleanNorma,
          currentNormaTurnsRemaining: players.length * 2
        }));
      }
    }

  }, [currentText]);

  // YoNunca Equipos Logic Interception
  useEffect(() => {
    if (mode === 'yo_nunca_equipos' && currentText && gameState.yoNuncaEquiposPhase === 'idle') {
      // Find team of current player to be the target team
      const targetTeamId = currentPlayer?.team_id;
      if (targetTeamId) {
        setGameState(prev => ({
          ...prev,
          yoNuncaEquiposPhase: 'truth_phase',
          yoNuncaTargetTeamId: targetTeamId,
          yoNuncaTruthVotes: {},
          yoNuncaGuessVotes: {}
        }));
      }
    }
  }, [mode, currentText, gameState.yoNuncaEquiposPhase, currentPlayer]);

  // Handle Virus Expiration Notifications
  const prevVirusesRef = useRef(playerViruses);
  useEffect(() => {
    const prev = prevVirusesRef.current;
    const current = playerViruses;

    // Find players who had a virus before but don't have it now
    prev.forEach(oldVirus => {
      const stillHasVirus = current.some(v => v.playerId === oldVirus.playerId);
      if (!stillHasVirus) {
        const pInfo = players.find(p => p.id === oldVirus.playerId);
        if (pInfo) {
          toast(`¡VIRUS TERMINADO para ${pInfo.name}! 🟢`, {
            description: "Ya puedes dejar de cumplir el castigo.",
            duration: 8000,
            icon: '✅'
          });
        }
      }
    });

    prevVirusesRef.current = current;
  }, [playerViruses, players]);

  // Sound effects on rarity
  useEffect(() => {
    if (rarity === 'legendary') {
      sfx.legendary();
      vibe(30);
    } else if (rarity === 'chaos') {
      sfx.chaos();
      vibe(50);
    }
  }, [currentText, rarity]);

  // Auto-save on Game Over
  useEffect(() => {
    if (gameOver && !showRoundSummary) {
      saveGameToHistory();
      setRoundSnapshot({
        round: gameState.round,
        scores: scores
      });
      setShowRoundSummary(true);
    }
  }, [gameOver, showRoundSummary, gameState.round, scores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 flex flex-col relative overflow-hidden pb-24 md:pb-32">

      <PlayerProfilesBottom
        players={players}
        currentPlayer={currentPlayer}
        scores={scores}
        playerViruses={playerViruses}
        mode={mode}
        remoteStreams={[]}
      />

      {/* Voting Overlay for "Who is most likely" and similar prompts */}
      {(() => {
        const isVoting = !!currentText && (
          currentText.toLowerCase().includes('¿quién') ||
          currentText.toLowerCase().includes('¿qué dos jugadores') ||
          currentText.toLowerCase().includes('¿qué tres jugadores') ||
          currentText.toLowerCase().includes('votación:')
        );
        let maxVotes = 1;
        if (currentText?.toLowerCase().includes('dos jugadores')) maxVotes = 2;
        if (currentText?.toLowerCase().includes('tres jugadores')) maxVotes = 3;

        return (
          <Dialog open={isVoting} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-primary/50 text-white z-[60]" aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center neon-text text-primary">
                  🗳️ Votación {maxVotes > 1 ? `(Elige a ${maxVotes})` : ''}
                </DialogTitle>
                <DialogDescription id="voting-desc" className="text-center text-lg text-white/90 font-medium pt-4">
                  {currentText}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 py-4">
                {players.map(p => {
                  const isSelected = gameState.votingSelections?.includes(p.id);
                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const currentSelections = gameState.votingSelections || [];
                        if (maxVotes === 1) {
                          // Instant cast & advance
                          addScore(p.id, 2);
                          trackVote(p.id);
                          toast.success(`${p.name} ha sido elegido! (+2 ptos)`);
                          handleNext();
                        } else {
                          // Toggle Selection
                          if (currentSelections.includes(p.id)) {
                            setGameState(prev => ({ ...prev, votingSelections: currentSelections.filter(id => id !== p.id) }));
                          } else if (currentSelections.length < maxVotes) {
                            setGameState(prev => ({ ...prev, votingSelections: [...currentSelections, p.id] }));
                          }
                        }
                      }}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl transition-all border-2 ${isSelected ? 'bg-primary/40 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]' : 'bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-white/10 hover:border-primary/50'}`}
                    >
                      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-transform ${isSelected ? 'border-primary scale-110' : 'border-white/20'}`}>
                        {p.avatar_url ? (
                          <img src={p.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 flex items-center justify-center text-2xl font-bold">
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-black text-base tracking-tight text-white">{p.name}</span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="text-center text-xs text-white/60">
                {maxVotes === 1 ? 'Pulsa en quien creas que es más probable.' : `Selecciona a ${maxVotes} jugadores.`}
              </div>

              {maxVotes > 1 && (
                <div className="mt-4">
                  <Button
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm"
                    disabled={(gameState.votingSelections?.length || 0) < maxVotes}
                    onClick={() => {
                      const selections = gameState.votingSelections || [];
                      selections.forEach(id => {
                        addScore(id, 2);
                        trackVote(id);
                        const name = players.find(p => p.id === id)?.name;
                        toast.success(`${name} elegido! (+2 ptos)`);
                      });
                      // Clear selections and advance
                      setGameState(prev => ({ ...prev, votingSelections: [] }));
                      handleNext();
                    }}
                  >
                    Confirmar Votación
                  </Button>
                </div>
              )}

              {isHost && (
                <div className="flex justify-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="text-xs text-white/60 hover:text-white border border-white/20"
                  >
                    Saltar Votación (Host)
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Top Bar */}
      <header className="p-4 flex justify-between items-center z-10 relative">
        <Button variant="ghost" size="icon" onClick={() => {
          if (window.confirm("¿Seguro que quieres salir?")) {
            onExit();
          }
        }}>
          <ArrowLeft className="h-6 w-6 text-white/80" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 border border-red-500/50"
            onClick={() => {
              if (window.confirm("¿Terminar partida y ver resultados?")) {
                setGameOver(true);
              }
            }}
          >
            Finalizar
          </Button>
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
            <span className="font-mono font-bold text-xl text-white">{gameState.round}</span>
            <span className="text-xs text-white/60 ml-1 uppercase">Ronda</span>
          </div>
        </div>
      </header>

      {/* Active Norma Display for Megamix (If a rule is active, show it globally) */}
      {
        mode === 'megamix' && gameState.showTrivia && currentText && currentText.includes('NORMA ALEATORIA') && (
          <div className="w-full flex justify-center z-10 -mt-2 mb-2">
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500 text-red-100 px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse flex items-center gap-2">
              <span>🚨 NORMA ACTIVA:</span>
              <span className="text-sm font-normal">{typeof currentQuestion?.answer === 'string' ? currentQuestion.answer : ''}</span>
            </div>
          </div>
        )
      }

      {/* Captain Indicator */}
      {
        gameState.captainId && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border-2 border-yellow-400 px-5 py-2.5 rounded-full text-sm font-black text-yellow-100 flex items-center gap-2 z-50 shadow-[0_0_20px_rgba(234,179,8,0.4)] backdrop-blur-md animate-pulse">
            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="uppercase tracking-widest">Capitán:</span>
            <span className="capitalize text-lg">{players.find(p => p.id === gameState.captainId)?.name}</span>
          </div>
        )
      }

      {
        isMultiplayer && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-3 py-1 rounded-full text-xs font-mono text-green-400 border border-green-500/30 flex items-center gap-2 cursor-pointer hover:bg-slate-800/90 hover:border-green-500/60 transition-all z-50"
            onClick={() => {
              if (roomId) {
                const url = `${window.location.origin}?room=${roomId}`;
                navigator.clipboard.writeText(url);
                toast.success('Enlace de invitación copiado');
              }
            }}
          >
            <span>{isHost ? 'HOST' : 'ESPEC'} • SALA: {roomId}</span>
            <Copy className="w-3 h-3 opacity-70" />
          </div>
        )
      }

      {/* Mobile Player Indicator (only visible on small screens where sidebar is hidden) */}
      <div className="sm:hidden flex items-center gap-2">
        <span className="text-sm text-white/60">Turno de:</span>
        <span className="font-bold text-white">{currentPlayer?.name}</span>
      </div>

      <div className="flex items-center gap-2">
        {roomId && (
          <Button
            variant={showVideo ? "destructive" : "secondary"}
            size="sm"
            onClick={() => setShowVideo(!showVideo)}
            className={showVideo ? "animate-pulse border-red-500" : "bg-transparent border-white/20"}
          >
            {showVideo ? <VideoOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
            {showVideo ? "Salir" : "Video"}
          </Button>
        )}

        <Button variant="destructive" size="sm" className="text-xs h-8 mr-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-white/10 backdrop-blur-sm" onClick={handleExit}>
          Finalizar
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-xs gap-1">
              <AlertCircle className="w-3 h-3" />
              Estado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-white/10" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Estado de la Partida</DialogTitle>
              <DialogDescription id="status-desc">
                Revisa los virus activos y las normas vigentes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Active Viruses Section */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-400">
                  🦠 Virus Activos
                </h3>
                {playerViruses.length === 0 ? (
                  <p className="text-white/60 text-sm italic">No hay virus activos en este momento.</p>
                ) : (
                  <div className="grid gap-3">
                    {playerViruses.map((v, i) => {
                      const affectedPlayer = players.find(p => p.id === v.playerId);
                      return (
                        <div key={i} className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-3 rounded-lg border border-purple-500/20">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-purple-300">
                              {affectedPlayer?.name || 'Jugador'}
                            </span>
                            <span className="text-xs bg-gradient-to-r from-purple-500/20 to-purple-600/20 px-2 py-0.5 rounded-full text-purple-200">
                              {v.turnsRemaining} turnos
                            </span>
                          </div>
                          <p className="font-bold text-sm text-white">{v.virusName}</p>
                          <p className="text-xs text-white/60">{v.virusDescription}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ranking Dialog with Real Classification */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-xs gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              Ranking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-white/10" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Clasificación General</DialogTitle>
              <DialogDescription id="ranking-desc">
                Puntuaciones y clasificación de jugadores.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {[...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)).map((p, i) => {
                // Get real stats from localStorage rankings
                const allRankings = (() => { try { return JSON.parse(localStorage.getItem('fiesta-party-local-rankings-v1') || '[]'); } catch { return []; } })();
                const playerRanking = allRankings.find((r: any) => r.player_name?.toLowerCase() === p.name?.toLowerCase());

                // Import classification inline
                const getTitle = (r: any) => {
                  if (!r) return { title: 'Nuevo', emoji: '🌟', color: 'text-slate-400' };
                  const won = r.games_won || 0;
                  const played = r.games_played || 0;
                  const level = r.level || 1;
                  const streak = r.win_streak || 0;
                  if (won >= 100 && level >= 30) return { title: 'Leyenda Suprema', emoji: '👑', color: 'text-yellow-400' };
                  if (played >= 200) return { title: 'Dios del Party', emoji: '⚡', color: 'text-purple-400' };
                  if (streak >= 15) return { title: 'El Inmortal', emoji: '🔥', color: 'text-red-400' };
                  if (won >= 50) return { title: 'Máquina de Ganar', emoji: '🏆', color: 'text-yellow-400' };
                  if (played >= 100) return { title: 'El Incombustible', emoji: '🛡️', color: 'text-slate-300' };
                  if (played >= 50) return { title: 'Veterano', emoji: '🎖️', color: 'text-amber-500' };
                  if (won >= 20) return { title: 'El Imparable', emoji: '💪', color: 'text-orange-400' };
                  if (won >= 10) return { title: 'Promesa', emoji: '⭐', color: 'text-yellow-300' };
                  if (played >= 15) return { title: 'Explorador', emoji: '🧭', color: 'text-teal-400' };
                  if (played >= 5) return { title: 'Aprendiz', emoji: '📖', color: 'text-slate-300' };
                  if (played >= 1) return { title: 'Recién Llegado', emoji: '👋', color: 'text-slate-400' };
                  return { title: 'Nuevo', emoji: '🌟', color: 'text-slate-500' };
                };

                const info = getTitle(playerRanking);
                const realGamesPlayed = playerRanking?.games_played || 0;
                const realGamesWon = playerRanking?.games_won || 0;
                const realStreak = playerRanking?.win_streak || 0;
                const winRate = realGamesPlayed > 0 ? Math.round((realGamesWon / realGamesPlayed) * 100) : 0;

                return (
                  <div key={p.id} className="p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-white/5">
                    {/* Player header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-white/60 w-6">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 flex items-center justify-center text-xs font-bold overflow-hidden border border-white/10">
                          {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight text-white">{p.name}</p>
                          <p className={`text-[10px] font-bold ${info.color}`}>{info.emoji} {info.title}</p>
                        </div>
                      </div>
                      <span className="font-black text-lg text-yellow-500">{scores[p.id] || 0}</span>
                    </div>
                    {/* Real stats */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-1.5">
                        <p className="text-[10px] text-white/60">Partidas</p>
                        <p className="text-xs font-bold text-white">{realGamesPlayed}</p>
                      </div>
                      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-1.5">
                        <p className="text-[10px] text-white/60">Victorias</p>
                        <p className="text-xs font-bold text-emerald-400">{realGamesWon}</p>
                      </div>
                      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-1.5">
                        <p className="text-[10px] text-white/60">Racha</p>
                        <p className="text-xs font-bold text-orange-400">🔥{realStreak}</p>
                      </div>
                      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-1.5">
                        <p className="text-[10px] text-white/60">Win%</p>
                        <p className={`text-xs font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>{winRate}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CAPTAIN SELECTION SCREEN */}
      <Dialog open={gameState.showCaptainSelection} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-yellow-500/50 text-white z-[60]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center text-yellow-500 flex items-center justify-center gap-3">
              👑 ELIGE AL CAPITÁN
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 space-y-4">
            <p className="text-lg text-white/80">
              El <strong>Capitán</strong> es el dueño del móvil durante <span className="text-white font-bold">TODA</span> la partida. Su trabajo es leer las cartas al resto y <strong>repartir la Experiencia (+XP)</strong>.
            </p>
            <p className="text-sm text-yellow-200 font-bold tracking-widest uppercase">¿Quién tiene el móvil ahora mismo?</p>

            <div className="grid grid-cols-2 gap-3 mt-6 max-h-[40vh] overflow-y-auto no-scrollbar pb-2">
              {players.map(p => (
                <Button
                  key={`pick-captain-${p.id}`}
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 hover:bg-gradient-to-r hover:from-yellow-600/30 hover:to-yellow-700/30 border border-white/10 hover:border-yellow-500/50 transition-all rounded-xl relative overflow-hidden group"
                  onClick={() => {
                    sfx.click();
                    setGameState(prev => ({
                      ...prev,
                      captainId: p.id,
                      showCaptainSelection: false
                    }));
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-transparent group-hover:border-yellow-400">
                    {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-bold truncate w-full px-2 text-white">{p.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NEW: Impostor Anti-Spoiler Warning */}
      <Dialog open={gameState.showImpostorWarning}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-red-900/80 to-red-800/80 border-red-500/50 text-white z-[60]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-red-500 flex items-center justify-center gap-2">
              <AlertCircle /> ATENCIÓN CAPITÁN
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6 space-y-4">
            <p className="text-lg">Por favor, pasa el móvil a:</p>
            <p className="text-4xl font-black text-white bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-4 rounded-xl border border-red-500/30">
              {players.find(p => p.id === gameState.impostorData?.impostorPlayerId)?.name || currentPlayer?.name}
            </p>
            <p className="text-sm text-red-200 mt-4">¡Que nadie más mire la pantalla!</p>
          </div>
          <Button
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-white/10 backdrop-blur-sm"
            onClick={() => {
              setGameState(prev => ({
                ...prev,
                showImpostorWarning: false,
                showImpostor: true, // proceed to actual logic
                currentImpostorReal: prev.impostorData?.currentImpostorReal,
                currentImpostorFake: prev.impostorData?.currentImpostorFake,
                impostorPlayerId: prev.impostorData?.impostorPlayerId,
              }));
            }}
          >
            Ya lo tengo yo, mostrar secreto
          </Button>
        </DialogContent>
      </Dialog>

      {/* Boca Cerrada Warning */}
      <Dialog open={gameState.showBocaCerradaWarning}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-orange-900/80 to-orange-800/80 border-orange-500/50 text-white z-[60]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-orange-500 flex items-center justify-center gap-2">
              <AlertCircle /> ATENCIÓN CAPITÁN
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6 space-y-4">
            <p className="text-lg">Por favor, pasa el móvil a:</p>
            <p className="text-4xl font-black text-white bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-4 rounded-xl border border-orange-500/30">
              {gameState.bocaCerradaData?.playerName || currentPlayer?.name}
            </p>
            <p className="text-sm text-orange-200 mt-4">¡Tu reto de BOCA CERRADA está a punto de empezar!</p>
          </div>
          <Button
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 border border-white/10 backdrop-blur-sm"
            onClick={() => {
              setGameState(prev => ({
                ...prev,
                showBocaCerradaWarning: false,
                showBocaCerrada: true // proceed to actual logic
              }));
            }}
          >
            Ya lo tengo yo, mostrar reto
          </Button>
        </DialogContent>
      </Dialog>

      {/* Boca Cerrada Reto Content */}
      <Dialog open={gameState.showBocaCerrada}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-orange-900/80 to-orange-800/80 border-orange-500/50 text-white z-[60]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-orange-500">
              BOCA CERRADA 🤐
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-lg mb-4 text-orange-100">
              Intenta que el grupo adivine una palabra o concepto.
            </p>
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-4 rounded-xl border border-orange-500/30 text-xl font-bold text-white mb-4">
              ¡REGLAS!<br /><br />
              ❌ No puedes abrir la boca<br />
              ❌ No puedes usar las manos<br />
              ✅ Solo sonidos nasales (Mmm, mmmm)
            </div>
            <p className="text-sm text-orange-200 uppercase font-bold text-center mt-2 animate-pulse">
              🍺 SI NADIE ACIERTA, BEBES 3 TRAGOS
            </p>
          </div>
          <Button
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 border border-white/10 backdrop-blur-sm"
            onClick={() => {
              setGameState(prev => ({ ...prev, showBocaCerrada: false }));
              handleNext(); // Skip to next card after challenge
            }}
          >
            Prueba Completada ⏭
          </Button>
        </DialogContent>
      </Dialog>

      {/* Virus Cycle Notification */}
      <Dialog open={gameState.showVirusCycleAlert}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-purple-900/80 to-purple-800/80 border-purple-500/50 text-white z-[70]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-purple-400">
              {gameState.virusCycleData?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-lg">{gameState.virusCycleData?.message}</p>
          </div>
          <Button
            className="w-full h-12 font-bold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border border-white/10 backdrop-blur-sm"
            onClick={() => setGameState(prev => ({ ...prev, showVirusCycleAlert: false }))}
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col items-center justify-center p-4 relative transition-opacity duration-300 ${isMultiplayer && !isHost && currentPlayer?.id !== currentPlayer?.id ? 'opacity-80 pointer-events-none' : ''}`}>

        {/* Turn Blocker Overlay */}
        {isMultiplayer && !isHost && false && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div className="bg-gradient-to-r from-black/80 to-slate-900/80 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/10 animate-pulse shadow-2xl skew-x-[-10deg]">
              <span className="font-bold text-yellow-500 mr-2">⏳ ESPERANDO A:</span>
              <span className="font-mono text-xl">{currentPlayer?.name.toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Active Rule Display */}
        {gameState.currentNorma && (
          <div className="mb-6 mx-auto max-w-sm z-10 pointer-events-none relative">
            <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border border-yellow-500/50 backdrop-blur-md rounded-xl p-3 text-center shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
              <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold mb-1">📜 NORMA ACTIVA</p>
              <p className="text-sm text-yellow-100 font-medium leading-tight">
                {gameState.currentNorma}
              </p>
            </div>
          </div>
        )}

        {/* CAPTAIN ACTION PANEL - Give/Take XP in real-time */}
        {(!gameState.showTrivia && !gameState.showVoting && !gameState.showDuel && !gameState.showImpostor && !gameState.showMimica && !gameState.showBocaCerrada && !gameState.showImpostorWord && mode !== 'cultura' && mode !== 'trivia_futbol') && (
          <div className="w-full max-w-sm mt-4 mb-2 z-10 flex flex-col items-center">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-2 opacity-70">Panel del Capitán</p>
            <div className="flex flex-wrap justify-center gap-3">
              {players.map(p => {
                const captainXp = Math.min(50, 10 + Math.floor(gameState.round / 2) * 5);
                return (
                  <div key={p.id} className="flex flex-col items-center gap-1">
                    {/* Avatar bubble */}
                    <div className={`relative w-12 h-12 rounded-full border-2 shadow-lg overflow-hidden
                      ${currentPlayer?.id === p.id ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110' : 'border-white/10'}`}>
                      {p.avatar_url ? (
                        <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-black text-white/90">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-white/60 truncate max-w-[48px] text-center">{p.name}</span>
                    {/* +/- buttons */}
                    <div className="flex gap-1">
                      {/* Penalty button */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          if (isMultiplayer && !isHost) return;
                          const penalty = Math.max(5, Math.floor(captainXp / 2));
                          addScore(p.id, -penalty);
                          toast(`❌ -${penalty} XP para ${p.name}`, { duration: 1200, position: 'top-center' });
                        }}
                        className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-400/50 flex items-center justify-center text-white font-black text-sm shadow-[0_0_8px_rgba(239,68,68,0.4)] transition-all"
                      >
                        −
                      </motion.button>
                      {/* Reward button */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          if (isMultiplayer && !isHost) return;
                          addScore(p.id, captainXp);
                          setGamesWon(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
                          toast.success(`+${captainXp} XP para ${p.name}! 🔥`, { duration: 1200, position: 'top-center' });
                        }}
                        className="w-6 h-6 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/50 flex items-center justify-center text-white font-black text-sm shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-white/60 mt-2 text-center leading-tight">Verde = +XP por cumplir · Rojo = −XP por fallar</p>
          </div>
        )}

        {/* YO NUNCA - INTERACTIVE AVATARS with EXP rewards */}
        {currentText && (currentText.toLowerCase().includes('yo nunca') || mode === 'yo_nunca' || mode === 'yo_nunca_equipos') && (
          <div className="w-full max-w-sm mt-3 mb-2 z-10">
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-3">
              <p className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-2 text-center">🍺 ¿Quién ha bebido? (toca para registrar)</p>
              <div className="flex flex-wrap justify-center gap-2">
                {players.map(p => (
                  <motion.button
                    key={`drink-${p.id}`}
                    whileTap={{ scale: 0.85 }}
                    onClick={async () => {
                      trackDrink(p.id);
                      // Award EXP for drinking (brave soul!)
                      const drinkXp = 5;
                      addScore(p.id, drinkXp);
                      toast(`🍺 ${p.name} ha bebido! +${drinkXp} XP (Total: ${(drinkCounts[p.id] || 0) + 1})`, { duration: 1500, position: 'top-center' });
                      // Sync EXP to Supabase profile if player has a linked account
                      try {
                        const pid = (p as any).supabase_id;
                        if (pid) {
                          await supabase.rpc('increment_player_exp', { player_id: pid, exp_amount: drinkXp }).catch(() => { });
                        }
                      } catch { /* silent fail */ }
                    }}
                    className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:bg-gradient-to-r hover:from-amber-500/40 hover:to-orange-500/40 transition-all min-w-[60px] active:shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-amber-400/50 overflow-hidden shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center text-sm font-bold text-white">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-amber-300 truncate max-w-[55px]">{p.name}</span>
                    <span className="text-[10px] font-black text-amber-400">{drinkCounts[p.id] || 0} 🍺</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-[9px] text-amber-500/60 text-center mt-2">Cada trago otorga +5 XP al jugador</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Ensure Norma is visible even if other things are showing? */}
          {!gameState.showTrivia && !gameState.showDrinkingGame && !gameState.showImpostor && !gameState.showDuel &&
            !gameState.showMimica && !gameState.showBocaCerrada && !gameState.showImpostorWord &&
            !gameState.showVoting && !gameState.showCaptainPass && !gameState.showVirusAlert &&
            gameState.yoNuncaEquiposPhase === 'idle' &&
            mode !== 'cultura' && mode !== 'trivia_futbol' && (
              <motion.div
                key="card-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                {/* 
                   If content is a NORMA, do NOT show the card text. 
                   Instead show a generic "New Rule" card or just the rule overlay?
                   User said: "que las cartas de norma no salgan en el mazo normal, ya sale arriba en una ventana"
                */}
                <CardDisplay
                  content={currentText}
                  type={rarity}
                  onClick={() => {
                    if (isMultiplayer && !isHost) return; // Viewers can't click info
                    handleNext();
                  }}
                  gameMode={mode}
                  players={players}
                  round={gameState.round}
                />
              </motion.div>
            )}
        </AnimatePresence>

        {/* Render other game components (Trivia, Drinking, etc) overlaying or replacing card */}
        {((gameState.showTrivia) || (mode === 'cultura') || (mode === 'trivia_futbol')) && currentQuestion && (
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-4 flex items-center justify-center">
            <TriviaQuestionCard
              question={currentQuestion}
              playerName={currentPlayer?.name || "Jugador"}
              onAnswer={(correct, points) => {
                if (correct) {
                  addScore(currentPlayer.id, points);
                  confetti();
                }

                // If it was a trigger (megamix), close the overlay.
                // If it is a full mode, just go to next question (handleNext handles it).
                if (mode === 'megamix') {
                  setGameState((prev: any) => ({ ...prev, showTrivia: false }));
                }

                handleNext();
              }}
            />
          </div>
        )}

        {/* Drinking Games Overlay */}
        {gameState.showDrinkingGame && gameState.currentDrinkingGame && (
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 flex items-center justify-center p-6 text-center text-white">
            <div>
              <h2 className="text-3xl font-bold mb-4">{gameState.currentDrinkingGame.name}</h2>
              <p className="text-xl mb-8">{gameState.currentDrinkingGame.description}</p>
              <Button onClick={() => {
                setGameState((prev: any) => ({ ...prev, showDrinkingGame: false }));
                handleNext();
              }}>Continuar</Button>
            </div>
          </div>
        )}

        {/* Impostor Round */}
        {gameState.showImpostor && gameState.impostorPlayerId && (
          <div className="absolute inset-0 z-30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 overflow-y-auto">
            <ImpostorRound
              players={players}
              impostorPlayerId={gameState.impostorPlayerId}
              realQuestion={gameState.currentImpostorReal || ''}
              impostorQuestion={gameState.currentImpostorFake || ''}
              onComplete={(caught, votedId) => {
                // Simple score logic for now
                if (caught) {
                  players.forEach(p => {
                    if (p.id !== gameState.impostorPlayerId) addScore(p.id, 20);
                  });
                } else {
                  addScore(gameState.impostorPlayerId, 50);
                }
                setGameState((prev: any) => ({ ...prev, showImpostor: false }));
                handleNext();
              }}
              onExit={() => {
                setGameState((prev: any) => ({ ...prev, showImpostor: false }));
              }}
            />
          </div>
        )}

        {/* Duel Round */}
        {gameState.showDuel && gameState.duelPlayers.length >= 2 && (
          <div className="absolute inset-0 z-30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 overflow-y-auto">
            <DueloComponent
              dueloText={gameState.currentDuelo || ''}
              player1={gameState.duelPlayers[0]}
              player2={gameState.duelPlayers[1]}
              onWinner={(winner) => {
                addWin(winner.id);
                addScore(winner.id, 50);
                setGameState((prev: any) => ({ ...prev, showDuel: false }));
                handleNext();
              }}
              onSkip={() => {
                setGameState((prev: any) => ({ ...prev, showDuel: false }));
                handleNext();
              }}
            />
          </div>
        )}

        {/* Mimica Overlay - Secret Handover with hold-to-reveal */}
        {gameState.showMimica && gameState.currentMimicaText && (
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-slate-950/95 via-purple-950/80 to-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-center text-white">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
              <h2 className="text-3xl font-black mb-2 text-purple-400">🎭 Mímica</h2>
              <p className="text-base mb-6 text-purple-200/80">
                ¡CAPITÁN! Entrega el móvil a <strong className="text-white">{currentPlayer?.name}</strong> y no mires.
              </p>

              {/* Hold to reveal */}
              <div
                className="relative bg-white/[0.06] border-2 border-purple-500/40 rounded-2xl p-6 cursor-pointer select-none mb-6 transition-all active:scale-95"
                onMouseDown={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onMouseUp={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onMouseLeave={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onTouchStart={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onTouchEnd={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
              >
                {gameState.showMimicaReveal ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-2xl font-bold text-white leading-relaxed">{gameState.currentMimicaText}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-purple-300/60">
                    <span className="text-4xl">👆</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Mantén pulsado para revelar</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-purple-300/60 mb-4">El grupo debe adivinar lo que estás representando</p>
              <p className="text-xs text-purple-300 font-bold animate-pulse mb-6">🍺 Si nadie adivina → 2 tragos</p>

              <Button
                className="w-full h-12 font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 shadow-[0_8px_25px_rgba(168,85,247,0.4)]"
                onClick={() => {
                  setGameState((prev: any) => ({ ...prev, showMimica: false, showMimicaReveal: false }));
                  handleNext();
                }}
              >
                ¡Hecho! ⏭
              </Button>
            </motion.div>
          </div>
        )}

        {/* Boca Cerrada Overlay - Secret Handover with hold-to-reveal */}
        {gameState.showBocaCerrada && gameState.currentBocaCerradaText && (
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-slate-950/95 via-orange-950/80 to-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-center text-white">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
              <h2 className="text-3xl font-black mb-2 text-orange-400">🤐 Boca Cerrada</h2>
              <p className="text-base mb-6 text-orange-200/80">
                ¡CAPITÁN! Entrega el móvil a <strong className="text-white">{currentPlayer?.name}</strong> y no mires.
              </p>

              {/* Hold to reveal */}
              <div
                className="relative bg-white/[0.06] border-2 border-orange-500/40 rounded-2xl p-6 cursor-pointer select-none mb-6 transition-all active:scale-95"
                onMouseDown={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onMouseUp={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onMouseLeave={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onTouchStart={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onTouchEnd={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
              >
                {gameState.showMimicaReveal ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-2xl font-bold text-white leading-relaxed">{gameState.currentBocaCerradaText}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-orange-300/60">
                    <span className="text-4xl">👆</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Mantén pulsado para revelar</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-3 mb-6 text-left space-y-1">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Reglas</p>
                <p className="text-sm text-orange-100">❌ No puedes abrir la boca</p>
                <p className="text-sm text-orange-100">❌ No puedes usar las manos</p>
                <p className="text-sm text-orange-100">✅ Solo sonidos nasales (Mmm...)</p>
                <p className="text-xs text-orange-300 font-bold mt-2 animate-pulse">🍺 Si nadie adivina → 3 tragos</p>
              </div>

              <Button
                className="w-full h-12 font-bold bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 border-0 shadow-[0_8px_25px_rgba(234,88,12,0.4)]"
                onClick={() => {
                  setGameState((prev: any) => ({ ...prev, showBocaCerrada: false, showMimicaReveal: false }));
                  handleNext();
                }}
              >
                ¡Prueba Completada! ⏭
              </Button>
            </motion.div>
          </div>
        )}

        {/* Impostor Word Overlay - Hold to Reveal */}
        {gameState.showImpostorWord && gameState.currentImpostorWord && (
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-slate-950/95 via-red-950/80 to-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-center text-white">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
              <h2 className="text-3xl font-black mb-2 text-red-400">🕵️ Palabra Impostor</h2>
              <p className="text-base mb-6 text-red-200/80">
                Pasa el móvil a los <strong className="text-white">NO impostores</strong>. ¡El impostor NO debe ver esto!
              </p>

              {/* Hold to reveal */}
              <div
                className="relative bg-white/[0.06] border-2 border-red-500/40 rounded-2xl p-6 cursor-pointer select-none mb-6 transition-all active:scale-95"
                onMouseDown={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onMouseUp={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onMouseLeave={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
                onTouchStart={() => setGameState(prev => ({ ...prev, showMimicaReveal: true }))}
                onTouchEnd={() => setGameState(prev => ({ ...prev, showMimicaReveal: false }))}
              >
                {gameState.showMimicaReveal ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-sm text-red-300 mb-2 uppercase tracking-widest font-bold">La palabra es:</p>
                    <p className="text-4xl font-black text-white leading-relaxed">{gameState.currentImpostorWord}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-red-300/60">
                    <span className="text-4xl">👆</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Mantén pulsado para revelar</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-red-300/60 mb-6">Solo los jugadores normales deben ver la palabra. El impostor intentará adivinarla.</p>

              <Button
                className="w-full h-12 font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-0 shadow-[0_8px_25px_rgba(239,68,68,0.4)]"
                onClick={() => {
                  setGameState((prev: any) => ({ ...prev, showImpostorWord: false, showMimicaReveal: false }));
                  handleNext();
                }}
              >
                Todos lo han visto ⏭
              </Button>
            </motion.div>
          </div>
        )}

        {/* Voting Support (Suggestion/Voting) */}
        {gameState.showVoting && (
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-6">Votación</h2>
            <QuestionVote
              questionText={gameState.votingQuestion || ''}
              questionCategory="megamix"
              gameId={""}
            />
            <Button className="mt-8" onClick={() => {
              setGameState((prev: any) => ({ ...prev, showVoting: false }));
              handleNext();
            }}>Continuar</Button>
          </div>
        )}

        {/* Virus Alert Overlay - Increased z-index and fixed positioning */}
        {gameState.showVirusAlert && gameState.virusAlertData && (
          <div className="fixed inset-0 z-[100] bg-gradient-to-r from-slate-900/80 to-slate-800/80 flex items-center justify-center p-6 text-center text-white animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-slate-900 border-2 border-green-500 p-6 rounded-xl shadow-[0_0_100px_rgba(34,197,94,0.6)] relative overflow-hidden"
            >
              {/* Background scanning effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(34,197,94,0.1)_50%,transparent_100%)] animate-scan pointer-events-none" style={{ backgroundSize: '100% 200%' }}></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-500/20 rounded-full animate-pulse ring-4 ring-green-500/30">
                    <span className="text-5xl">🦠</span>
                  </div>
                </div>

                <h2 className="text-4xl font-black mb-2 text-green-400 font-mono tracking-tighter shadow-green-glow">¡VIRUS DETECTADO!</h2>

                <div className="my-6 p-6 bg-black/60 rounded-xl border border-green-500/50 backdrop-blur-sm">
                  <p className="text-xs text-green-400/80 mb-1 uppercase tracking-widest font-bold">Infectado</p>
                  <p className="text-3xl font-black text-white mb-6 tracking-wide">{gameState.virusAlertData.player.name}</p>

                  <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-full mb-6"></div>

                  <p className="text-xs text-green-400/80 mb-1 uppercase tracking-widest font-bold">Efecto</p>
                  <p className="text-2xl font-bold text-green-300 leading-tight mb-2">{gameState.virusAlertData.virus.name}</p>
                  <p className="text-sm text-gray-300 font-medium">{gameState.virusAlertData.virus.description}</p>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.02]"
                  onClick={() => {
                    setGameState((prev: any) => ({ ...prev, showVirusAlert: false, virusAlertData: null }));
                    handleNext();
                  }}
                >
                  ACEPTAR DESTINO
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Video Chat is now handled globally at Index.tsx level */}


        {/* Captain Pass Screen */}
        {gameState.showCaptainPass && (
          <div className="absolute inset-0 z-30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 overflow-y-auto">
            <CaptainPassScreen
              onComplete={() => {
                setGameState((prev: any) => ({ ...prev, showCaptainPass: false }));
                handleNext();
              }}
            />
          </div>
        )}

        {/* Yo Nunca Equipos Flow */}
        {mode === 'yo_nunca_equipos' && gameState.yoNuncaEquiposPhase !== 'idle' && (
          <YoNuncaEquiposFlow
            questionText={currentText}
            gameState={gameState}
            setGameState={setGameState}
            players={players}
            teams={teams}
            onNext={handleNext}
            localPlayerId={currentPlayer?.id}
            isHost={isHost}
            isMultiplayer={isMultiplayer}
            addScore={addScore}
            sendActionToHost={sendActionToHost}
          />
        )}

        {/* Final Emergency Fallback: If any of the flags are true but we failed to render the subcomponent, provide a way out */}
        {(gameState.showTrivia || gameState.showDrinkingGame || gameState.showImpostor || gameState.showDuel ||
          gameState.showMimica || gameState.showBocaCerrada || gameState.showImpostorWord ||
          gameState.showVoting || gameState.showCaptainPass || gameState.showVirusAlert ||
          mode === 'cultura' || mode === 'trivia_futbol') && (
            <div className="absolute bottom-4 left-0 right-0 p-4 flex flex-col items-center justify-center pointer-events-none gap-2">
              {/* Safety message if screen is likely empty */}
              {((gameState.showDrinkingGame && !gameState.currentDrinkingGame) ||
                (gameState.showMimica && !gameState.currentMimicaText) ||
                (gameState.showBocaCerrada && !gameState.currentBocaCerradaText)) && (
                  <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse pointer-events-auto">
                    ⚠️ Error de contenido - Pulsa Saltar
                  </div>
                )}

              {/* Special Loading State for Trivia if question is fetching */}
              {((mode === 'cultura' || mode === 'trivia_futbol' || gameState.showTrivia) && !currentQuestion) && (
                <div className="bg-blue-500/80 text-white px-4 py-2 rounded-lg text-sm font-bold animate-pulse pointer-events-auto">
                  🔄 Cargando pregunta...
                </div>
              )}

              <Button variant="outline" className="opacity-60 hover:opacity-100 pointer-events-auto bg-background/50 backdrop-blur text-xs" onClick={handleNext}>
                Saltar (Emergencia)
              </Button>
            </div>
          )}

        {/* Global Next Button for MegaMix Cards */}
        {!gameState.showTrivia && !gameState.showDrinkingGame && !gameState.showImpostor &&
          !gameState.showDuel && !gameState.showMimica && !gameState.showBocaCerrada &&
          !gameState.showImpostorWord && !gameState.showVoting && !gameState.showCaptainPass &&
          !gameState.showVirusAlert && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md px-6 mb-4 mt-8"
            >
              <Button
                onClick={handleNext}
                className="w-full h-20 text-2xl font-black uppercase tracking-widest rounded-[2rem] shadow-[0_15px_40px_rgba(var(--primary-rgb),0.35)] border-b-8 border-white/20 active:border-b-0 active:translate-y-2 transition-all bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-sm"
              >
                SIGUIENTE CARTA ⏭️
              </Button>
              <p className="text-center text-white/60 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold opacity-40">Toca el botón o la carta para avanzar</p>
            </motion.div>
          )}

      </main>

      {/* Round Summary Overlay */}
      {
        showRoundSummary && roundSnapshot && (
          <div className="absolute inset-0 z-[100] bg-gradient-to-r from-slate-900/80 to-slate-800/80 flex items-center justify-center">
            <RoundSummary
              round={roundSnapshot.round}
              scores={roundSnapshot.scores}
              players={players}
              teams={teams}
              globalStats={rankings}
              onContinue={() => setShowRoundSummary(false)}
              onEndGame={handleExit}
              isGameOver={gameOver}
              trackingData={{ voteCounts, drinkCounts, virusReceived, skipCounts }}
            />
          </div>
        )
      }
    </div >
  );
}