import { useState, useRef, MutableRefObject } from 'react';
import { GameMode, PlayerVirus, Player } from '@/types/game';
import { virusEffects, normasRonda } from '@/data/gameContent';
import { impostorRounds } from '@/data/impostorContent';
import { duelos } from '@/data/duelosContent';
import { footballQuestions } from '@/data/footballQuestionsNew';
import { cultureQuestions } from '@/data/cultureQuestions';
import { shuffleArray } from '@/lib/utils';

export const useGameEffects = (mode: GameMode, players: Player[]) => {
    const [playerViruses, setPlayerViruses] = useState<PlayerVirus[]>([]);
    const [virusReceivedByPlayer, setVirusReceivedByPlayer] = useState<Record<string, number>>({});
    const [brutalCounts, setBrutalCounts] = useState<Record<string, { legendaryDrops: number; chaosEvents: number; cursedEvents: number; virusesReceived: number }>>({});

    const getPlayerVirus = (playerId: string) => {
        return playerViruses.find(v => v.playerId === playerId);
    };

    // State for tracking periodic events
    const lastVirusRoundRef = useRef<number>(-1);
    const lastNormaRoundRef = useRef<number>(-1);

    const applyRandomVirus = (force: boolean = false, specificPlayerId?: string) => {
        // If not forced, apply random chance
        if (!force && ((mode !== 'megamix' && mode !== 'clasico') || Math.random() > 0.20)) return null;

        const targetPlayer = specificPlayerId
            ? players.find(p => p.id === specificPlayerId)
            : players[Math.floor(Math.random() * players.length)];

        if (!targetPlayer) return null;

        const randomVirus = virusEffects[Math.floor(Math.random() * virusEffects.length)];

        setVirusReceivedByPlayer(prev => ({
            ...prev,
            [targetPlayer.id]: (prev[targetPlayer.id] || 0) + 1,
        }));

        setBrutalCounts(prev => ({
            ...prev,
            [targetPlayer.id]: {
                ...prev[targetPlayer.id],
                virusesReceived: (prev[targetPlayer.id]?.virusesReceived || 0) + 1,
                legendaryDrops: prev[targetPlayer.id]?.legendaryDrops || 0,
                chaosEvents: prev[targetPlayer.id]?.chaosEvents || 0,
                cursedEvents: prev[targetPlayer.id]?.cursedEvents || 0
            }
        }));

        setPlayerViruses(prev => {
            // Remove existing virus for this player to avoid clutter/conflicts, or stack? 
            // Replacing is cleaner for UI bubbles.
            const filtered = prev.filter(p => p.playerId !== targetPlayer.id);
            return [
                ...filtered,
                {
                    playerId: targetPlayer.id,
                    virusName: randomVirus.name,
                    virusDescription: randomVirus.description,
                    turnsRemaining: Math.max(players.length * 2, 4), // Lasts 2 rounds roughly
                },
            ];
        });

        return { player: targetPlayer, virus: randomVirus };
    };

    const updateViruses = () => {
        setPlayerViruses(prev =>
            prev
                .map(v => ({ ...v, turnsRemaining: v.turnsRemaining - 1 }))
                .filter(v => v.turnsRemaining > 0)
        );
    };

    // Manage Periodic Viruses (Every 7 Rounds -> Infection or Rest)
    const manageMegamixViruses = (currentRound: number) => {
        if (mode !== 'megamix') return null;

        // Start Virus on Round 1
        if (currentRound === 1 && lastVirusRoundRef.current === -1) {
            lastVirusRoundRef.current = 1;
            const randomVirus = virusEffects[Math.floor(Math.random() * virusEffects.length)];
            const targetPlayer = players[Math.floor(Math.random() * players.length)];
            const newVirus: PlayerVirus = {
                playerId: targetPlayer.id,
                virusName: randomVirus.name,
                virusDescription: randomVirus.description,
                turnsRemaining: 7,
            };
            setPlayerViruses([newVirus]);
            return { type: 'INFECTION', title: '¡VIRUS DETECTADO!', message: `El virus inicial ha infectado a ${targetPlayer.name}.` };
        }

        // Check if round is multiple of 7 and we haven't triggered yet for this round
        if (currentRound > 1 && currentRound % 7 === 0 && currentRound !== lastVirusRoundRef.current) {
            lastVirusRoundRef.current = currentRound;

            // Logic: Rotate Virus to next player
            setPlayerViruses([]);
            
            const randomVirus = virusEffects[Math.floor(Math.random() * virusEffects.length)];
            const nextIndex = (currentRound / 7) % players.length;
            const targetPlayer = players[nextIndex];

            const newVirus: PlayerVirus = {
                playerId: targetPlayer.id,
                virusName: randomVirus.name,
                virusDescription: randomVirus.description,
                turnsRemaining: 7, // Lasts until next cycle
            };

            setPlayerViruses([newVirus]);
            return { type: 'INFECTION', title: '¡EL VIRUS HA MUTADO!', message: `El virus se ha propagado a ${targetPlayer.name}. ¡Suerte!` };
        }

        return null;
    };

    // Manage Periodic Normas (Every 5 Rounds)
    const manageMegamixNormas = (currentRound: number) => {
        if (mode !== 'megamix') return null;

        // Initial Norma Round 1
        if (currentRound === 1 && lastNormaRoundRef.current === -1) {
            lastNormaRoundRef.current = 1;
            const randomNorma = normasRonda[Math.floor(Math.random() * normasRonda.length)];
            return {
                type: 'NORMA',
                title: '¡NORMA INICIAL!',
                message: randomNorma,
                duration: players.length * 2
            };
        }

        // Manage Periodic Normas (Every 3 Rounds)
        if (currentRound > 1 && currentRound % 3 === 0 && currentRound !== lastNormaRoundRef.current) {
            lastNormaRoundRef.current = currentRound;
            const randomNorma = normasRonda[Math.floor(Math.random() * normasRonda.length)];
            return {
                type: 'NORMA',
                title: '¡NUEVA NORMA!',
                message: randomNorma,
                duration: players.length * 2 // Lasts 2 full rounds
            };
        }
        return null;
    };

    // Megamix Special Events (Impostor, Duelo, forced Trivia, Random Norma)
    const checkMegamixSpecialEvents = (
        currentIndex: number,
        currentRound: number, // Added usage
        currentPlayer: Player,
        usedQuestionIds: Set<string>,
        setCurrentQuestion: (q: any) => void,
        setUsedQuestionIds: (ids: Set<string>) => void,
        setGameState: (updater: (prev: any) => any) => void,
        lastMiniTurnRef: MutableRefObject<Record<string, number>>
    ) => {
        if (mode !== 'megamix') return false;

        const roll = Math.random();
        const lastImpostorTurn = lastMiniTurnRef.current['impostor_round'] ?? -9999;
        const impostorCooldown = Math.max(players.length * 2, 18);

        // Random Norma removed - now strict every 3 rounds via manageMegamixNormas


        // Impostor round - needs at least 3 players. Reduced frequency: ~every 12 rounds per person.
        const targetImpostorTurns = players.length * 12;

        if (players.length >= 3 && roll < 0.06 && currentIndex > 0 && (currentIndex - lastImpostorTurn) >= targetImpostorTurns) {
            const randomImpostor = impostorRounds[Math.floor(Math.random() * impostorRounds.length)];
            const impostorPlayer = players[Math.floor(Math.random() * players.length)];
            setGameState((prev: any) => ({
                ...prev,
                showImpostorWarning: true, // NEW state for anti-spoiler
                showImpostor: false, // Don't show the main screen yet
                impostorData: {
                    currentImpostorReal: randomImpostor.normalQuestion,
                    currentImpostorFake: randomImpostor.impostorQuestion,
                    impostorPlayerId: impostorPlayer.id,
                }
            }));
            lastMiniTurnRef.current['impostor_round'] = currentIndex;
            return true;
        }

        // Duelo
        if (players.length >= 2 && roll >= 0.10 && roll < 0.22) {
            const randomDuelo = duelos[Math.floor(Math.random() * duelos.length)];
            const opponents = players.filter(p => p.id !== currentPlayer.id);
            const opponent = opponents[Math.floor(Math.random() * opponents.length)];
            setGameState((prev: any) => ({
                ...prev,
                showDuel: true,
                currentDuelo: `${randomDuelo.name}: ${randomDuelo.description}`,
                duelPlayers: [currentPlayer, opponent],
            }));
            return true;
        }

        // Forced Trivia
        const playerTurnCount = Math.floor(currentIndex / Math.max(players.length, 1));
        const forceTrivia = playerTurnCount > 0 && playerTurnCount % 6 === 0;

        if (forceTrivia || (roll >= 0.88)) {
            const isFootball = Math.random() > 0.5;
            const shuffled = [...(isFootball ? footballQuestions : cultureQuestions)].sort(() => Math.random() - 0.5);
            const availableQuestions = shuffled.filter(q => !usedQuestionIds.has(q.question));

            if (availableQuestions.length > 0) {
                const randomQ = availableQuestions[0];
                setCurrentQuestion(randomQ);
                setUsedQuestionIds(new Set([...usedQuestionIds, randomQ.question]));
                setGameState((prev: any) => ({ ...prev, showTrivia: true }));
                return true;
            }
        }

        return false;
    };

    return {
        playerViruses,
        setPlayerViruses,
        virusReceivedByPlayer,
        brutalCounts,
        setBrutalCounts,
        applyRandomVirus,
        updateViruses,
        checkMegamixSpecialEvents,
        manageMegamixViruses,
        manageMegamixNormas,
        getPlayerVirus
    };
};
