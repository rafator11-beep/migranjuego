import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/contexts/GameContext';
import { Player } from '@/types/game';
import { TicTacToeBoard } from './TicTacToeBoard';
import { TriviaQuestionCard } from './TriviaQuestionCard';
import { footballQuestions } from '@/data/footballQuestionsNew';
import confetti from 'canvas-confetti';

interface TicTacToeGameProps {
  onExit: () => void;
}

export function TicTacToeGame({ onExit }: TicTacToeGameProps) {
  const { players } = useGameContext();
  
  const [board, setBoard] = useState<(string | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<typeof footballQuestions[0] | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [gamesWon, setGamesWon] = useState<Record<string, number>>({});
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [showGameEnd, setShowGameEnd] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  // Initialize games won counter
  useEffect(() => {
    const initialGamesWon: Record<string, number> = {};
    players.forEach(p => {
      initialGamesWon[p.id] = 0;
    });
    setGamesWon(initialGamesWon);
  }, [players]);

  // Shuffle questions on mount for randomness
  const getRandomQuestion = useCallback(() => {
    const availableQuestions = footballQuestions.filter(q => !usedQuestionIds.has(q.question));
    
    if (availableQuestions.length === 0) {
      // Reset used questions
      setUsedQuestionIds(new Set());
      const randomQ = footballQuestions[Math.floor(Math.random() * footballQuestions.length)];
      return randomQ;
    }
    
    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    return randomQ;
  }, [usedQuestionIds]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || showQuestion || winnerId) return;
    
    setSelectedCell([row, col]);
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setUsedQuestionIds(prev => new Set([...prev, question.question]));
    setShowQuestion(true);
  };

  const checkWinner = (newBoard: (string | null)[][]): string | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (newBoard[i][0] && newBoard[i][0] === newBoard[i][1] && newBoard[i][1] === newBoard[i][2]) {
        return newBoard[i][0];
      }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (newBoard[0][i] && newBoard[0][i] === newBoard[1][i] && newBoard[1][i] === newBoard[2][i]) {
        return newBoard[0][i];
      }
    }
    // Check diagonals
    if (newBoard[0][0] && newBoard[0][0] === newBoard[1][1] && newBoard[1][1] === newBoard[2][2]) {
      return newBoard[0][0];
    }
    if (newBoard[0][2] && newBoard[0][2] === newBoard[1][1] && newBoard[1][1] === newBoard[2][0]) {
      return newBoard[0][2];
    }
    return null;
  };

  const checkDraw = (newBoard: (string | null)[][]): boolean => {
    return newBoard.every(row => row.every(cell => cell !== null));
  };

  const handleAnswer = (isCorrect: boolean, points: number) => {
    if (!selectedCell) return;
    
    const newBoard = board.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === selectedCell[0] && ci === selectedCell[1]) {
          // Si acierta, marca la casilla; si falla, pasa al siguiente jugador sin marcar
          return isCorrect ? currentPlayer.id : cell;
        }
        return cell;
      })
    );
    
    if (isCorrect) {
      setBoard(newBoard);
    }
    
    // Check for winner (but game continues until board is full)
    const winner = checkWinner(newBoard);
    const isBoardFull = checkDraw(newBoard);
    
    if (winner && !winnerId) {
      // Mark winner, trigger confetti, and auto-start new board
      setWinnerId(winner);
      setGamesWon(prev => ({
        ...prev,
        [winner]: (prev[winner] || 0) + 1,
      }));
      setTotalGamesPlayed(prev => prev + 1);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      // Auto-reset to new board after short celebration
      setTimeout(() => {
        resetGame();
      }, 2500);
    } else if (isBoardFull && !winner) {
      // Board is full with no winner - draw, auto-reset
      setTotalGamesPlayed(prev => prev + 1);
      setTimeout(() => {
        resetGame();
      }, 2000);
    }
    
    setShowQuestion(false);
    setSelectedCell(null);
    setCurrentQuestion(null);
    
    // Switch player
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  };

  const resetGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setWinnerId(null);
    setShowGameEnd(false);
    setCurrentPlayerIndex(0);
    setSelectedCell(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const getWinnerName = () => {
    if (!winnerId) return '';
    const winner = players.find(p => p.id === winnerId);
    return winner?.name || '';
  };

  if (players.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Se necesitan al menos 2 jugadores</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24 pt-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              ⚽ TIC TAC TOE Fútbol
            </h1>
            <p className="text-sm text-muted-foreground">
              Partida {totalGamesPlayed + 1}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Games Won Counter */}
        <div className="bg-card/80 rounded-xl p-3 mb-4 flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Partidas ganadas:</span>
          </div>
          {players.slice(0, 2).map((player, index) => (
            <div key={player.id} className="flex items-center gap-1">
              <span className="text-lg">{index === 0 ? '⚽' : '🥅'}</span>
              <span className="font-bold">{player.name}:</span>
              <span className="text-primary font-bold">{gamesWon[player.id] || 0}</span>
            </div>
          ))}
        </div>

        {/* Show Question */}
        {showQuestion && currentQuestion && (
          <TriviaQuestionCard
            key={currentQuestion.question}
            question={currentQuestion}
            playerName={currentPlayer.name}
            onAnswer={handleAnswer}
            showComodines={false}
            timeLimit={30}
          />
        )}

        {/* Game End Screen */}
        {showGameEnd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 mb-4 text-center shadow-xl"
          >
            {winnerId ? (
              <>
                <span className="text-6xl block mb-4">🏆</span>
                <h2 className="text-2xl font-bold mb-2">
                  ¡{getWinnerName()} gana!
                </h2>
                <p className="text-muted-foreground mb-4">
                  ¡Tres en raya conseguido!
                </p>
              </>
            ) : (
              <>
                <span className="text-6xl block mb-4">🤝</span>
                <h2 className="text-2xl font-bold mb-2">¡Empate!</h2>
                <p className="text-muted-foreground mb-4">
                  Nadie consiguió tres en raya
                </p>
              </>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button onClick={resetGame} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Nueva Partida
              </Button>
              <Button variant="outline" onClick={onExit}>
                Salir
              </Button>
            </div>
          </motion.div>
        )}

        {/* Board - Hide when showing question */}
        {!showQuestion && (
          <TicTacToeBoard
            board={board}
            players={players}
            currentPlayerId={currentPlayer?.id || null}
            onCellClick={handleCellClick}
            disabled={false}
            winnerId={winnerId}
          />
        )}
      </div>
    </div>
  );
}
