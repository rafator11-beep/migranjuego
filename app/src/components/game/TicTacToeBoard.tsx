import { motion } from 'framer-motion';
import { Player } from '@/types/game';

interface TicTacToeBoardProps {
  board: (string | null)[][];
  players: Player[];
  currentPlayerId: string | null;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
  winnerId?: string | null;
}

export function TicTacToeBoard({ 
  board, 
  players, 
  currentPlayerId, 
  onCellClick, 
  disabled = false,
  winnerId 
}: TicTacToeBoardProps) {
  const getPlayerSymbol = (playerId: string | null) => {
    if (!playerId) return null;
    const playerIndex = players.findIndex(p => p.id === playerId);
    return playerIndex === 0 ? '⚽' : '🥅';
  };

  const getPlayerColor = (playerId: string | null) => {
    if (!playerId) return '';
    const playerIndex = players.findIndex(p => p.id === playerId);
    return playerIndex === 0 ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600';
  };

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return '';
    const player = players.find(p => p.id === playerId);
    return player?.name || '';
  };

  const checkWinningLine = (): [number, number][] | null => {
    if (!winnerId) return null;

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === winnerId && board[i][1] === winnerId && board[i][2] === winnerId) {
        return [[i, 0], [i, 1], [i, 2]];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] === winnerId && board[1][i] === winnerId && board[2][i] === winnerId) {
        return [[0, i], [1, i], [2, i]];
      }
    }

    // Check diagonals
    if (board[0][0] === winnerId && board[1][1] === winnerId && board[2][2] === winnerId) {
      return [[0, 0], [1, 1], [2, 2]];
    }
    if (board[0][2] === winnerId && board[1][1] === winnerId && board[2][0] === winnerId) {
      return [[0, 2], [1, 1], [2, 0]];
    }

    return null;
  };

  const winningLine = checkWinningLine();

  const isWinningCell = (row: number, col: number) => {
    if (!winningLine) return false;
    return winningLine.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Current Player Indicator */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Turno de</p>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-2xl">{getPlayerSymbol(currentPlayerId)}</span>
          <span className="font-bold text-lg">{getPlayerName(currentPlayerId)}</span>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isWinner = isWinningCell(rowIndex, colIndex);
            const isEmpty = cell === null;
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={isEmpty && !disabled ? { scale: 1.05 } : {}}
                whileTap={isEmpty && !disabled ? { scale: 0.95 } : {}}
                onClick={() => isEmpty && !disabled && onCellClick(rowIndex, colIndex)}
                disabled={!isEmpty || disabled}
                className={`
                  w-20 h-20 md:w-24 md:h-24 rounded-xl
                  flex items-center justify-center
                  text-4xl md:text-5xl
                  transition-all duration-300
                  ${isEmpty 
                    ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-2 border-dashed border-white/20' 
                    : `bg-gradient-to-br ${getPlayerColor(cell)} shadow-lg`
                  }
                  ${isWinner ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-background animate-pulse' : ''}
                  ${disabled && isEmpty ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    {getPlayerSymbol(cell)}
                  </motion.span>
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {/* Player Legend */}
      <div className="mt-6 flex gap-6">
        {players.slice(0, 2).map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              player.id === currentPlayerId ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted'
            }`}
          >
            <span className="text-xl">{index === 0 ? '⚽' : '🥅'}</span>
            <span className="font-medium">{player.name}</span>
            <span className="text-sm text-muted-foreground">({player.score} pts)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
