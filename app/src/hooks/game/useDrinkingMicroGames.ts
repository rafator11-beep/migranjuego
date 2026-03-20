import { useRef } from 'react';
import { GameMode } from '@/types/game';
import { getRandomDrinkingGame, getRandomCascade, getRandomCoinGame, getRandomImpostorWord, DrinkingGame } from '@/data/drinkingGames';
import { formatMimicaChallenge, getRandomMimica } from '@/data/mimicaContent';
import { formatBocaCerradaChallenge, getRandomBocaCerrada } from '@/data/bocaCerradaContent';
import { pickWeighted } from '@/lib/godDeck';

export const useDrinkingMicroGames = (mode: GameMode, playersCount: number) => {
    const recentMiniRef = useRef<string[]>([]);
    const lastMiniTurnRef = useRef<Record<string, number>>({});

    const checkDrinkingGame = (
        currentIndex: number,
        currentPlayerName: string,
        setGameState: (updater: (prev: any) => any) => void
    ): boolean => {
        if (mode !== 'megamix' && mode !== 'clasico') return false;

        const triggerChance = mode === 'megamix' ? 0.30 : 0.22;
        if (Math.random() > triggerChance) return false;

        const turn = currentIndex;
        const last = recentMiniRef.current[recentMiniRef.current.length - 1];
        const recently = new Set(recentMiniRef.current.slice(-6));

        const canUse = (type: string, cooldownTurns: number) => {
            const lastTurn = lastMiniTurnRef.current[type];
            if (typeof lastTurn === 'number' && turn - lastTurn < cooldownTurns) return false;
            if (type === last) return false;
            if ((type === 'boca' || type === 'impostor_word') && recently.has(type)) return false;
            return true;
        };

        const candidates = [
            {
                type: 'cascada',
                weight: 0.9,
                ok: canUse('cascada', 8) && turn > 0 && turn % 5 === 0,
                run: () => {
                    const cascade = getRandomCascade();
                    const processed = {
                        ...cascade,
                        description: cascade.description.replace(/{player}/g, currentPlayerName)
                    };
                    setGameState((prev: any) => ({ ...prev, showDrinkingGame: true, currentDrinkingGame: processed }));
                },
            },
            {
                type: 'coin',
                weight: 0.8,
                ok: canUse('coin', 10) && turn > 0 && turn % 7 === 0,
                run: () => {
                    const coinGame = getRandomCoinGame();
                    const processed = {
                        ...coinGame,
                        description: coinGame.description.replace(/{player}/g, currentPlayerName)
                    };
                    setGameState((prev: any) => ({ ...prev, showDrinkingGame: true, currentDrinkingGame: processed }));
                },
            },
            {
                type: 'mimica',
                weight: 1.1,
                ok: canUse('mimica', 6),
                run: () => {
                    const mimica = getRandomMimica();
                    setGameState((prev: any) => ({ 
                        ...prev, 
                        showMimica: false, // Don't show immediately
                        showMimicaReveal: true, // Show handover first
                        currentMimicaText: formatMimicaChallenge(mimica, currentPlayerName) 
                    }));
                },
            },
            {
                type: 'drinking',
                weight: 1.0,
                ok: canUse('drinking', 4),
                run: () => {
                    const drinkingGame = getRandomDrinkingGame();
                    const processed = {
                        ...drinkingGame,
                        description: drinkingGame.description.replace(/{player}/g, currentPlayerName)
                    };
                    setGameState((prev: any) => ({ ...prev, showDrinkingGame: true, currentDrinkingGame: processed }));
                },
            },
            {
                type: 'boca',
                weight: 0.55,
                ok: canUse('boca', 14),
                run: () => {
                    const bocaCerrada = getRandomBocaCerrada();
                    setGameState((prev: any) => ({ 
                        ...prev, 
                        showBocaCerrada: false, // Don't show immediately
                        showBocaCerradaReveal: true, // Show handover first
                        currentBocaCerradaText: formatBocaCerradaChallenge(bocaCerrada, currentPlayerName) 
                    }));
                },
            },
            {
                type: 'impostor_word',
                weight: 0.55,
                ok: canUse('impostor_word', 14),
                run: () => {
                    const word = getRandomImpostorWord();
                    setGameState((prev: any) => ({ ...prev, showImpostorWord: true, currentImpostorWord: word }));
                },
            },
        ];

        const eligibleCandidates = candidates.filter(c => c.ok);
        if (eligibleCandidates.length === 0) return false;

        const picked = pickWeighted(eligibleCandidates, eligibleCandidates.map(c => c.weight));

        picked.run();
        lastMiniTurnRef.current[picked.type] = turn;
        recentMiniRef.current = [...recentMiniRef.current, picked.type].slice(-20);
        return true;
    };

    return {
        checkDrinkingGame,
        lastMiniTurnRef
    };
};
