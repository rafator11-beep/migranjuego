import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LogOut, Loader2, Trophy, ArrowRight, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { RewardPopup } from './RewardPopup';
import { loadLocalRankings, upsertLocalRanking, saveLocalRankings } from '@/utils/localRanking';
import { toast } from 'sonner';
import { ParchisBoard } from './ParchisBoard';
import { getRandomTeamId, getTeamLogoUrl } from '@/lib/footballTeams';
import { ParchisPiece, PlayerColor, PieceState, COLOR_ORDER, createInitialPieces, calculateNextPosition, isSafe } from '@/lib/parchisLogic';
import tapete from '@/assets/tapete.jpg';

export interface ParchisPlayer {
    id: string;
    name: string;
    avatarUrl?: string;
    color: PlayerColor;
    isBot: boolean;
    isReady: boolean;
    score: number;
}

export interface ParchisGameState {
    players: Record<PlayerColor, ParchisPlayer | null>;
    pieces: ParchisPiece[];
    currentTurn: PlayerColor;
    dice: number[];
    status: 'waiting' | 'playing' | 'finished';
    winner: PlayerColor | null;
    lastAction?: string;
}

const COLORS: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];

interface ParchisGameProps {
    roomId?: string;
    isHost?: boolean;
    onExit: () => void;
    localPlayerName: string;
    localPlayerAvatar?: string;
}

export function ParchisGame({ roomId, isHost, onExit, localPlayerName, localPlayerAvatar }: ParchisGameProps) {
    const [gameState, setGameState] = useState<ParchisGameState>({
        players: { red: null, blue: null, yellow: null, green: null },
        pieces: [],
        currentTurn: 'red',
        dice: [],
        status: 'waiting',
        winner: null
    });

    const [myColor, setMyColor] = useState<PlayerColor | null>(null);
    const [rolling, setRolling] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState({ coins: 0, xp: 0, oldLevel: 1, newLevel: 1, streak: 0 });
    const [rerollCost, setRerollCost] = useState(1);

    const [teamLogos] = useState<Record<PlayerColor, string>>(() => ({
        red: getTeamLogoUrl(getRandomTeamId()),
        blue: getTeamLogoUrl(getRandomTeamId()),
        yellow: getTeamLogoUrl(getRandomTeamId()),
        green: getTeamLogoUrl(getRandomTeamId())
    }));

    const [equippedTokens, setEquippedTokens] = useState<Record<PlayerColor, string>>({} as Record<PlayerColor, string>);

    useEffect(() => {
        // Setup local player initially as red
        setMyColor('red');
        setGameState(prev => ({
            ...prev,
            players: {
                ...prev.players,
                red: { id: 'local', name: localPlayerName, color: 'red', isBot: false, isReady: true, score: 0 }
            },
            pieces: createInitialPieces()
        }));

        // Load equipped tokens
        const rankings = loadLocalRankings();
        const me = rankings.find(r => r.player_name.toLowerCase() === localPlayerName.toLowerCase());
        if (me?.equipped_items?.ficha) {
            setEquippedTokens(prev => ({ ...prev, red: me.equipped_items.ficha }));
        }

    }, [localPlayerName]);

    // Bot AI and Auto-pass logic
    useEffect(() => {
        if (gameState.status !== 'playing' || gameState.winner) return;

        const currentPlayer = gameState.players[gameState.currentTurn];
        const isBot = currentPlayer?.isBot;

        if (isBot) {
            if (gameState.dice.length === 0 && !rolling) {
                // Bot rolls dice
                setRolling(true);
                setTimeout(() => {
                    setRolling(false);
                    const d1 = Math.floor(Math.random() * 6) + 1;
                    const d2 = Math.floor(Math.random() * 6) + 1;
                    setGameState(prev => ({ ...prev, dice: [d1, d2] }));
                }, 1000);
            } else if (gameState.dice.length > 0) {
                // Bot needs to move
                const timer = setTimeout(() => {
                    const myPieces = gameState.pieces.filter(p => p.color === gameState.currentTurn);
                    const steps = gameState.dice[0];
                    let moved = false;

                    // Try to find a valid move
                    for (const piece of myPieces) {
                        const newPos = calculateNextPosition(piece, steps);
                        if (newPos) {
                            handlePieceClick(piece); // reuse the existing logic
                            moved = true;
                            break;
                        }
                    }

                    // If no piece could move, pass turn or consume die
                    if (!moved) {
                        setGameState(prev => {
                            const newDice = prev.dice.slice(1);
                            if (newDice.length === 0) {
                                setTimeout(nextTurn, 500);
                            }
                            return { ...prev, dice: newDice };
                        });
                    }
                }, 1000);
                return () => clearTimeout(timer);
            }
        } else {
            // Human player: Auto pass if no valid moves
            if (gameState.dice.length > 0) {
                const steps = gameState.dice[0];
                const myPieces = gameState.pieces.filter(p => p.color === gameState.currentTurn);
                const hasValidMove = myPieces.some(p => calculateNextPosition(p, steps) !== null);
                if (!hasValidMove) {
                    const timer = setTimeout(() => {
                        toast.info("No tienes movimientos válidos.");
                        setGameState(prev => {
                            const newDice = prev.dice.slice(1);
                            if (newDice.length === 0) setTimeout(nextTurn, 500);
                            return { ...prev, dice: newDice };
                        });
                    }, 1000);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [gameState.currentTurn, gameState.status, gameState.dice, rolling, gameState.winner]);

    const handleGameEnd = async (winnerColor: PlayerColor) => {
        setGameState(prev => ({ ...prev, status: 'finished', winner: winnerColor }));

        const isWin = winnerColor === myColor;

        // Update economics
        const rankings = upsertLocalRanking({
            playerName: localPlayerName,
            scoreToAdd: 0,
            won: isWin,
            gameMode: 'parchis' as any
        });
        const result = rankings.find(r => r.player_name.toLowerCase() === localPlayerName.toLowerCase());

        if (result) {
            setRewardData({
                coins: isWin ? 25 : 3,
                xp: isWin ? 50 : 15,
                oldLevel: result.level || 1, // Assume no level down
                newLevel: result.level || 1,
                streak: result.win_streak || 0
            });
            setShowReward(true);
        }
    };

    const checkWinCondition = (pieces: ParchisPiece[], color: PlayerColor) => {
        const colorPieces = pieces.filter(p => p.color === color);
        if (colorPieces.every(p => p.state === 'goal')) {
            handleGameEnd(color);
            return true;
        }
        return false;
    };

    const handleStartGame = () => {
        // Fill empty slots with bots
        const newPlayers = { ...gameState.players };
        let botCount = 1;
        COLOR_ORDER.forEach(c => {
            if (!newPlayers[c]) {
                newPlayers[c] = { id: `bot-${botCount}`, name: `Bot ${botCount}`, color: c, isBot: true, isReady: true, score: 0 };
                botCount++;
            }
        });

        setGameState(prev => ({ ...prev, status: 'playing', players: newPlayers }));
    };

    const nextTurn = () => {
        setRerollCost(1);
        setGameState(prev => {
            const currentIndex = COLOR_ORDER.indexOf(prev.currentTurn);
            const nextColor = COLOR_ORDER[(currentIndex + 1) % 4];
            return { ...prev, currentTurn: nextColor, dice: [] };
        });
    };

    const handlePieceClick = (piece: ParchisPiece) => {
        if (gameState.dice.length === 0) return;

        const steps = gameState.dice[0];
        const newPos = calculateNextPosition(piece, steps);

        if (newPos) {
            setGameState(prev => {
                const newPieces = prev.pieces.map(p => p.id === piece.id ? { ...p, state: newPos.state, position: newPos.position } : p);

                // Handle eating logic
                if (newPos.state === 'board' && !isSafe(newPos.position)) {
                    const eatenIdx = newPieces.findIndex(p => p.state === 'board' && p.position === newPos.position && p.id !== piece.id && p.color !== piece.color);
                    if (eatenIdx >= 0) {
                        newPieces[eatenIdx].state = 'home';
                        newPieces[eatenIdx].position = 0;
                        toast.success(`¡Te has comido una ficha!`);
                        // Standard Parchis: gives +20 to any piece, but we'll deal with rewards later.
                    }
                }

                const remainingDice = prev.dice.slice(1);

                // Check win condition synchronously before setting state
                if (checkWinCondition(newPieces, piece.color)) {
                    return { ...prev, pieces: newPieces, dice: [] };
                }

                return { ...prev, pieces: newPieces, dice: remainingDice };
            });
            // If no dice left, check for doubles (not implemented yet, just next turn)
            if (gameState.dice.length === 1 && !gameState.winner) {
                setTimeout(nextTurn, 500);
            }
        } else {
            toast.error("Movimiento inválido");
        }
    };

    const handleReroll = () => {
        const rankings = loadLocalRankings();
        const idx = rankings.findIndex(r => r.player_name.toLowerCase() === localPlayerName.toLowerCase());

        if (idx >= 0) {
            const currentGems = rankings[idx].gems || 0;
            if (currentGems < rerollCost) {
                toast.error(`Necesitas ${rerollCost} gemas para volver a tirar (tienes ${currentGems} 💎)`);
                return;
            }

            rankings[idx].gems -= rerollCost;
            saveLocalRankings(rankings);

            toast.success(`Pagaste ${rerollCost} 💎 por relanzar dados`);
            setRerollCost(prev => prev * 2);

            setRolling(true);
            setGameState(prev => ({ ...prev, dice: [] }));

            setTimeout(() => {
                setRolling(false);
                const d1 = Math.floor(Math.random() * 6) + 1;
                const d2 = Math.floor(Math.random() * 6) + 1;
                setGameState(prev => ({ ...prev, dice: [d1, d2] }));
            }, 500);
        }
    };

    const getDiceIcon = (value: number) => {
        switch (value) {
            case 1: return Dice1;
            case 2: return Dice2;
            case 3: return Dice3;
            case 4: return Dice4;
            case 5: return Dice5;
            case 6: return Dice6;
            default: return Dice1;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0f172a] text-white flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10 relative z-10 shadow-lg">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                        🎲 Parchís SD Huesca
                        {roomId && <span className="text-xs bg-white/10 px-2 py-1 rounded text-white font-normal uppercase tracking-widest ml-2 border border-white/20">Sala: {roomId}</span>}
                    </h2>
                </div>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onExit}
                    className="rounded-xl shadow-lg shadow-red-500/20 font-bold"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Salir
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 relative">
                {/* Background Huesca Shield Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <img src={tapete} alt="Centro" className="w-[500px] h-auto grayscale mix-blend-overlay" />
                </div>

                {gameState.status === 'waiting' ? (
                    <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center border-2 border-white/10 shadow-2xl relative z-10">
                        <h3 className="text-2xl font-black mb-6 neon-text text-[hsl(var(--neon-blue))]">Sala de Espera</h3>
                        {/* Player Slots */}
                        <div className="space-y-3 mb-8">
                            {COLORS.map(color => {
                                const p = gameState.players[color];
                                return (
                                    <div key={color} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${color === 'red' ? 'border-red-500/50 bg-red-500/10 text-red-100' :
                                        color === 'blue' ? 'border-blue-500/50 bg-blue-500/10 text-blue-100' :
                                            color === 'yellow' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-100' :
                                                'border-green-500/50 bg-green-500/10 text-green-100'
                                        }`}>
                                        <div className={`w-4 h-4 rounded-full ${color === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_blue]' : color === 'yellow' ? 'bg-yellow-500 shadow-[0_0_10px_yellow]' : 'bg-green-500 shadow-[0_0_10px_green]'}`} />
                                        {p ? (
                                            <span className="font-bold">{p.name} {p.isBot && '(Bot)'} {p.id === myColor && '(Tú)'}</span>
                                        ) : (
                                            <span className="text-white/40 italic">Esperando jugador...</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {(!roomId || isHost) && (
                            <Button
                                onClick={handleStartGame}
                                className="w-full h-14 rounded-xl font-black text-lg bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/50"
                            >
                                ¡Comenzar Partida! <ArrowRight className="ml-2" />
                            </Button>
                        )}
                        {roomId && !isHost && (
                            <div className="flex items-center justify-center gap-2 text-white/50 bg-white/5 p-4 rounded-xl border border-white/10">
                                <Loader2 className="w-5 h-5 animate-spin" /> Esperando al host...
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-2xl">
                        {/* Tablero SVG UI */}
                        <ParchisBoard
                            pieces={gameState.pieces}
                            currentTurn={gameState.currentTurn}
                            myColor={myColor}
                            onPieceClick={handlePieceClick}
                            teamLogos={teamLogos}
                            equippedTokens={equippedTokens}
                        />
                        {/* Controles del Jugador */}
                        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 w-full max-w-[500px] border border-white/10 shadow-xl flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Turno actual</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${gameState.currentTurn === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : gameState.currentTurn === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_blue]' : gameState.currentTurn === 'yellow' ? 'bg-yellow-500 shadow-[0_0_10px_yellow]' : 'bg-green-500 shadow-[0_0_10px_green]'}`} />
                                    <span className="font-black text-xl capitalize">{gameState.currentTurn}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                {/* Visualizador de Dados */}
                                <div className="flex gap-2">
                                    <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black bg-white text-black shadow-inner ${rolling ? 'animate-bounce' : ''}`}>
                                        {gameState.dice.length > 0 ? gameState.dice[0] : '?'}
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black bg-white text-black shadow-inner ${rolling ? 'animate-bounce delay-75' : ''}`}>
                                        {gameState.dice.length > 1 ? gameState.dice[1] : (gameState.dice.length === 1 ? '✓' : '?')}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {gameState.dice.length === 2 && gameState.currentTurn === myColor && (
                                        <Button
                                            onClick={handleReroll}
                                            disabled={rolling}
                                            className="h-8 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400 text-xs"
                                        >
                                            <span className="mr-1">💎</span> Relanzar ({rerollCost})
                                        </Button>
                                    )}
                                    <Button
                                        disabled={gameState.currentTurn !== myColor || rolling || gameState.dice.length > 0}
                                        onClick={() => {
                                            setRolling(true);
                                            setTimeout(() => {
                                                setRolling(false);
                                                const d1 = Math.floor(Math.random() * 6) + 1;
                                                const d2 = Math.floor(Math.random() * 6) + 1;
                                                setGameState(prev => ({
                                                    ...prev,
                                                    dice: [d1, d2]
                                                }));
                                            }, 500);
                                        }}
                                        className={`h-12 px-6 rounded-xl font-black text-white border ${gameState.currentTurn === myColor && gameState.dice.length === 0
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] border-blue-400'
                                            : 'bg-white/10 text-white/30 border-white/5 cursor-not-allowed'
                                            }`}
                                    >
                                        Tirar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <RewardPopup
                isOpen={showReward}
                onClose={() => {
                    setShowReward(false);
                    onExit();
                }}
                result={gameState.winner === myColor ? 'win' : 'lose'}
                coinsEarned={rewardData.coins}
                xpEarned={rewardData.xp}
                oldLevel={rewardData.oldLevel}
                newLevel={rewardData.newLevel}
                streak={rewardData.streak}
            />
        </div>
    );
}