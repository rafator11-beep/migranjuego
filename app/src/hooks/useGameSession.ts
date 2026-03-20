// Hook for managing game session persistence (10-minute save)
import { useState, useEffect, useCallback } from 'react';
import { GameMode } from '@/types/game';

export interface SavedGameSession {
  mode: GameMode;
  currentIndex: number;
  currentPlayerIndex: number;
  scores: Record<string, number>;
  gamesWon: Record<string, number>;
  usedQuestionIds: string[];
  round: number;
  savedAt: number;
  playerIds: string[];
  tictactoeBoard?: (string | null)[][];
  tictactoeCurrentPlayer?: number;
}

const SESSION_KEY = 'party_game_session';
const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

export function useGameSession(mode: GameMode, playerIds: string[]) {
  const [hasRestoredSession, setHasRestoredSession] = useState(false);

  const saveSession = useCallback((session: Omit<SavedGameSession, 'savedAt' | 'mode' | 'playerIds'>) => {
    const fullSession: SavedGameSession = {
      ...session,
      mode,
      playerIds,
      savedAt: Date.now(),
    };
    localStorage.setItem(`${SESSION_KEY}_${mode}`, JSON.stringify(fullSession));
  }, [mode, playerIds]);

  const loadSession = useCallback((): SavedGameSession | null => {
    try {
      const stored = localStorage.getItem(`${SESSION_KEY}_${mode}`);
      if (!stored) return null;

      const session: SavedGameSession = JSON.parse(stored);
      
      // Check if session is still valid (within 10 minutes)
      if (Date.now() - session.savedAt > SESSION_DURATION) {
        clearSession();
        return null;
      }

      // Check if same players (order might differ)
      const savedPlayerSet = new Set(session.playerIds);
      const currentPlayerSet = new Set(playerIds);
      
      if (savedPlayerSet.size !== currentPlayerSet.size || 
          !playerIds.every(id => savedPlayerSet.has(id))) {
        clearSession();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }, [mode, playerIds]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(`${SESSION_KEY}_${mode}`);
  }, [mode]);

  return {
    saveSession,
    loadSession,
    clearSession,
    hasRestoredSession,
    setHasRestoredSession,
  };
}
