import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/contexts/GameContext';
import { QuestionCard } from './QuestionCard';
import { TicTacToeBoard } from './TicTacToeBoard';
import { TicTacToeGame } from './TicTacToeGame';
import { Scoreboard } from './Scoreboard';
import { RoundSummary } from './RoundSummary';
import { PartyGame } from './PartyGame';
import { PokerRoom } from '../poker/PokerRoom';
import { ParchisGame } from './ParchisGame';
import { MegaBoardGame } from './MegaBoardGame';
import { GAME_MODES } from '@/types/game';

interface GamePlayProps {
  onExit: () => void;
  isTeamMode?: boolean;
  roomId?: string | null;
  isHost?: boolean;
}

export function GamePlay({ onExit, isTeamMode = false, roomId = null, isHost = false }: GamePlayProps) {
  const {
    game,
    players,
    teams,
    ticTacToeState,
    currentQuestion,
    getNextQuestion,
    answerQuestion,
    updateTicTacToeBoard,
    checkTicTacToeWinner,
    nextTurn,
    startNextRound,
    endGame,
    getCurrentPlayer,
  } = useGameContext();

  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const modeInfo = GAME_MODES.find(m => m.id === game?.mode);
  const currentPlayer = getCurrentPlayer();

  const handleNextRound = async () => {
    try {
      await startNextRound();
    } catch (err) {
      console.error('Error starting next round:', err);
    }
  };

  const handleEndGame = async () => {
    try {
      await endGame();
      onExit();
    } catch (err) {
      console.error('Error ending game:', err);
    }
  };

  useEffect(() => {
    if (game?.status === 'playing' && !currentQuestion && game.mode === 'futbol') {
      // Only load questions for futbol mode here
    }
  }, [game?.status, game?.current_turn, game?.mode, currentQuestion]);

  if (!game) return null;

  // Check if this is the new TicTacToe Fútbol mode - use dedicated component
  if (game?.mode === 'futbol') {
    return <TicTacToeGame onExit={onExit} />;
  }

  // Check if this is Poker mode
  if (game?.mode === 'poker') {
    return <PokerRoom onExit={onExit} roomId={roomId} isHost={isHost} />;
  }

  // Check if this is Parchis mode
  if (game?.mode === 'parchis') {
    // Attempt to get the local player from state or storage
    const storedId = localStorage.getItem('fiesta_player_id');
    const localP = players?.find(p => p.id === storedId);
    const localName = localP?.name || localStorage.getItem('fiesta_player_name') || 'Jugador';
    const localAvatar = localP?.avatar_url || undefined;

    return (
      <ParchisGame
        onExit={onExit}
        roomId={roomId || undefined}
        isHost={isHost}
        localPlayerName={localName}
        localPlayerAvatar={localAvatar}
      />
    );
  }

  // Check if this is MegaBoard mode
  if (game?.mode === 'megaboard') {
    const storedId = localStorage.getItem('fiesta_player_id');
    const localP = players?.find(p => p.id === storedId);
    const localName = localP?.name || localStorage.getItem('fiesta_player_name') || 'Jugador';
    const localAvatar = localP?.avatar_url || undefined;

    return (
      <MegaBoardGame
        onExit={onExit}
        localPlayerName={localName}
        localPlayerAvatar={localAvatar}
      />
    );
  }

  // Round end summary
  if ((game as any).status === 'round_end') {
    return (
      <RoundSummary
        game={game}
        players={players}
        teams={teams}
        onNextRound={handleNextRound}
        onEndGame={handleEndGame}
      />
    );
  }

  // Game finished
  if ((game as any).status === 'finished') {
    return (
      <RoundSummary
        game={game}
        players={players}
        teams={teams}
        onNextRound={handleNextRound}
        onEndGame={onExit}
        isGameOver
      />
    );
  }

  // Check if this is a party mode (non-trivia based)
  const isPartyMode = game?.mode && [
    'megamix', 'clasico', 'yo_nunca', 'picante',
    'espana', 'votacion', 'pacovers', 'trivia_futbol', 'cultura', 'yo_nunca_equipos'
  ].includes(game.mode);

  // For party modes, render the PartyGame component
  if (isPartyMode && game) {
    return (
      <PartyGame
        mode={game.mode as any}
        onExit={onExit}
        isMultiplayer={!!roomId}
        isHost={isHost}
        roomId={roomId}
      />
    );
  }

  const loadNextQuestion = async () => {
    try {
      await getNextQuestion();
      setShowQuestion(true);
    } catch (err) {
      console.error('Error loading question:', err);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (!ticTacToeState || ticTacToeState.board[row][col] !== null) return;

    setSelectedCell([row, col]);
    await loadNextQuestion();
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentQuestion || !currentPlayer) return;

    setIsAnswering(true);

    try {
      await answerQuestion(currentQuestion.id, currentPlayer.id, isCorrect);

      if (game?.mode === 'futbol' && selectedCell && isCorrect) {
        await updateTicTacToeBoard(selectedCell[0], selectedCell[1], currentPlayer.id);

        const winner = checkTicTacToeWinner();
        if (winner) {
          await endGame();
        }
      }

      setShowQuestion(false);
      setSelectedCell(null);

      await nextTurn();
    } catch (err) {
      console.error('Error processing answer:', err);
    } finally {
      setIsAnswering(false);
    }
  };







  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {modeInfo.icon} {modeInfo.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Ronda {game.current_round}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Turno de</p>
            <p className="font-semibold">{currentPlayer?.name || 'Cargando...'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Question Card */}
            {showQuestion && currentQuestion && currentPlayer && (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  playerName={currentPlayer.name}
                  timeLimit={30}
                />
              </motion.div>
            )}

            {/* Waiting for question */}
            {!showQuestion && !currentQuestion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="text-4xl mb-4 animate-bounce">{modeInfo?.icon}</div>
                <p className="text-lg text-muted-foreground">Cargando pregunta...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - Scoreboard */}
        <div className="space-y-4">
          <Scoreboard
            players={players}
            teams={teams}
            showTeams={modeInfo.teamBased}
            currentPlayerId={currentPlayer?.id}
          />

          {/* Round info */}
          <div className="bg-card rounded-2xl p-4 shadow-lg border">
            <h3 className="font-semibold mb-3">Estado de la Ronda</h3>
            <div className="space-y-2">
              {players.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 text-sm ${player.has_played_this_round ? 'text-muted-foreground' : ''
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${player.has_played_this_round ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  <span>{player.name}</span>
                  <span className="ml-auto text-xs">
                    {player.has_played_this_round ? '✓ Jugó' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
