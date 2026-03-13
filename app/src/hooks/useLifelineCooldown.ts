// Hook for managing lifeline cooldowns (each player can use a lifeline every 4 questions)
import { useState, useCallback } from 'react';

type Comodin = '50:50' | 'publico' | 'llamada';

interface PlayerCooldowns {
  [playerId: string]: {
    [comodin in Comodin]?: number; // Question number when used
  };
}

const COOLDOWN_QUESTIONS = 4;

export function useLifelineCooldown() {
  const [playerCooldowns, setPlayerCooldowns] = useState<PlayerCooldowns>({});

  const useLifeline = useCallback((playerId: string, comodin: Comodin, currentQuestionNumber: number) => {
    setPlayerCooldowns(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [comodin]: currentQuestionNumber,
      },
    }));
  }, []);

  const canUseLifeline = useCallback((playerId: string, comodin: Comodin, currentQuestionNumber: number): boolean => {
    const playerData = playerCooldowns[playerId];
    if (!playerData || playerData[comodin] === undefined) {
      return true; // Never used
    }
    
    const lastUsed = playerData[comodin]!;
    return currentQuestionNumber - lastUsed >= COOLDOWN_QUESTIONS;
  }, [playerCooldowns]);

  const getCooldownRemaining = useCallback((playerId: string, comodin: Comodin, currentQuestionNumber: number): number => {
    const playerData = playerCooldowns[playerId];
    if (!playerData || playerData[comodin] === undefined) {
      return 0; // Available
    }
    
    const lastUsed = playerData[comodin]!;
    const remaining = COOLDOWN_QUESTIONS - (currentQuestionNumber - lastUsed);
    return Math.max(0, remaining);
  }, [playerCooldowns]);

  const resetCooldowns = useCallback(() => {
    setPlayerCooldowns({});
  }, []);

  return {
    useLifeline,
    canUseLifeline,
    getCooldownRemaining,
    resetCooldowns,
  };
}
