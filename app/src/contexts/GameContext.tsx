import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGame } from '@/hooks/useGame';
import { GameMode } from '@/types/game';

interface GameContextType extends ReturnType<typeof useGame> {
  gameId: string | null;
  setGameId: (id: string | null) => void;
  localPlayerId: string | null;
  setLocalPlayerId: (id: string | null) => void;
  remoteStreams: any[];
  setRemoteStreams: (streams: any[]) => void;
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<any[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const gameHook = useGame(gameId);

  return (
    <GameContext.Provider value={{
      ...gameHook,
      gameId,
      setGameId,
      localPlayerId,
      setLocalPlayerId,
      remoteStreams,
      setRemoteStreams,
      localStream,
      setLocalStream
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
