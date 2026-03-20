import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { upsertLocalRanking } from '@/utils/localRanking';

interface ArcadeTicTacToeProps {
    roomId: string;
    playerId?: string;
    onClose: () => void;
}

type PlayerSymbol = 'X' | 'O';
type Board = (PlayerSymbol | null)[];
type GamePhase = 'waiting_sync' | 'playing' | 'result';

export function ArcadeTicTacToe({ roomId, playerId, onClose }: ArcadeTicTacToeProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const isBotMatch = roomId.startsWith('bot_');

    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [mySymbol, setMySymbol] = useState<PlayerSymbol | null>(null);
    const [currentTurnStr, setCurrentTurnStr] = useState<string | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(3);

    const channelRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout>(null);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`tictactoe-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, ({ payload }) => {
                // If remote is ready, and we need to assign symbols
                setRemotePlayerReady(true);
                // Host assigns symbols if we are first
                if (!mySymbol && payload.playerId !== effectivePlayerId) {
                    // Decide randomly who is what
                    const iAmX = Math.random() > 0.5;
                    const hostSymbol = iAmX ? 'X' : 'O';
                    const guestSymbol = iAmX ? 'O' : 'X';

                    setMySymbol(hostSymbol);

                    channel.send({
                        type: 'broadcast',
                        event: 'start_game',
                        payload: {
                            starterId: iAmX ? effectivePlayerId : payload.playerId,
                            xPlayerId: iAmX ? effectivePlayerId : payload.playerId,
                            oPlayerId: iAmX ? payload.playerId : effectivePlayerId
                        }
                    });

                    startGame(
                        iAmX ? effectivePlayerId : payload.playerId,
                        hostSymbol
                    );
                }
            })
            .on('broadcast', { event: 'start_game' }, ({ payload }) => {
                if (!mySymbol) { // Guest receives assignments
                    const sym = payload.xPlayerId === effectivePlayerId ? 'X' : 'O';
                    setMySymbol(sym);
                    startGame(payload.starterId, sym);
                }
            })
            .on('broadcast', { event: 'make_move' }, ({ payload }) => {
                handleRemoteMove(payload.index, payload.symbol, payload.nextTurnId);
            })
            .on('broadcast', { event: 'timeout_loss' }, ({ payload }) => {
                setWinner(payload.winnerId);
                setPhase('result');
                clearTimeout(timerRef.current!);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    if (isBotMatch) {
                        // Bot logic
                        setTimeout(() => {
                            setRemotePlayerReady(true);
                            setMySymbol('X');
                            startGame(effectivePlayerId, 'X');
                        }, 1000);
                    } else {
                        channel.send({
                            type: 'broadcast',
                            event: 'ready',
                            payload: { playerId: effectivePlayerId }
                        });
                    }
                }
            });

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (!isBotMatch) supabase.removeChannel(channel);
        };
    }, [roomId, effectivePlayerId, mySymbol, isBotMatch]);

    const startGame = (starterId: string, assignedSymbol: PlayerSymbol) => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setPhase('playing');
        setCurrentTurnStr(starterId);
        resetTurnTimer(starterId, assignedSymbol);
    };

    const resetTurnTimer = (whoId: string, _mySym: string) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeLeft(3);

        if (whoId === effectivePlayerId) {
            let tl = 3;
            timerRef.current = setInterval(() => {
                tl--;
                setTimeLeft(tl);
                if (tl <= 0) {
                    clearInterval(timerRef.current!);
                    // I lost due to timeout
                    setWinner('remote');
                    setPhase('result');
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'timeout_loss',
                        payload: { winnerId: 'remote' }
                    });
                    toast.error("¡Se acabó el tiempo!");
                }
            }, 1000);
        } else {
            // Let remote handle its own timeout, we just wait.
            // We could add a failsafe if remote disconnects, but for 1v1 MVP it's fine.
        }
    };

    const handleRemoteMove = (index: number, sym: string, nextId: string) => {
        setBoard(prev => {
            const newBoard = [...prev];
            newBoard[index] = sym as PlayerSymbol;
            checkPostMove(newBoard, nextId, false);
            return newBoard;
        });
    };

    // Bot move simulation
    useEffect(() => {
        if (isBotMatch && phase === 'playing' && currentTurnStr !== effectivePlayerId && !winner) {
            const timer = setTimeout(() => {
                const emptyCells = board.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
                if (emptyCells.length > 0) {
                    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    handleRemoteMove(randomCell, mySymbol === 'X' ? 'O' : 'X', effectivePlayerId);
                }
            }, 1000 + Math.random() * 1000); // 1-2s bot delay
            return () => clearTimeout(timer);
        }
    }, [isBotMatch, phase, currentTurnStr, board, winner, effectivePlayerId, mySymbol]);

    const handleCellClick = (index: number) => {
        if (phase !== 'playing') return;
        if (currentTurnStr !== effectivePlayerId) return;
        if (board[index] !== null) return;

        if (timerRef.current) clearInterval(timerRef.current);

        const nextTurnId = 'remote'; // We don't know remote ID easily without context, we use a placeholder 'remote' for the turn logic check. 
        // Actually, since we sync the move, the remote will see the broadcast and set their turn to effectivePlayerId.
        // Wait, we need the actual remote ID. We can just say "not me".

        setBoard(prev => {
            const newBoard = [...prev];
            newBoard[index] = mySymbol;

            // Broadcast the move before checking locally (so remote gets it instantly)
            if (!isBotMatch) {
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'make_move',
                    payload: { index, symbol: mySymbol, nextTurnId: effectivePlayerId }
                });
            }

            checkPostMove(newBoard, 'remote', true);
            return newBoard;
        });
    };

    const checkPostMove = (newBoard: Board, nextIdStr: string, isMyMove: boolean) => {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]           // diagonals
        ];

        let foundWinner = null;
        for (let line of winningLines) {
            const [a, b, c] = line;
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                foundWinner = newBoard[a];
                break;
            }
        }

        if (foundWinner) {
            setPhase('result');
            if (foundWinner === mySymbol) {
                setWinner(effectivePlayerId);
                if (isMyMove) {
                    toast.success("¡Victoria magistral!");
                    upsertLocalRanking({ playerName: localPlayer.name, scoreToAdd: 50, won: true, gameMode: 'arcade' });
                }
            } else {
                setWinner('remote');
                if (!isMyMove) toast.error("Te han aplastado...");
            }
        } else if (!newBoard.includes(null)) {
            setPhase('result');
            setWinner('tie');
            toast("¡Empate brutal!");
        } else {
            setCurrentTurnStr(isMyMove ? 'remote' : effectivePlayerId!);
            resetTurnTimer(isMyMove ? 'remote' : effectivePlayerId!, mySymbol!);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-[hsl(var(--neon-blue))] uppercase">TRES EN RAYA TURBO</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-4 text-white">Espera al rival para empezar...</h2>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center relative p-4">

                    {phase === 'playing' && (
                        <div className="absolute top-10 flex flex-col items-center gap-2">
                            <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md">
                                <span className="text-sm font-bold uppercase tracking-widest text-white/70">
                                    Turno: <span className={currentTurnStr === effectivePlayerId ? 'text-green-400' : 'text-red-400'}>
                                        {currentTurnStr === effectivePlayerId ? 'TU TURNO' : 'RIVAL'}
                                    </span>
                                </span>
                            </div>

                            <div className={`text-5xl font-black ${timeLeft <= 1 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                00:0{timeLeft}
                            </div>
                        </div>
                    )}

                    {/* Board Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 rounded-2xl w-full max-w-sm aspect-square shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {board.map((cell, idx) => (
                            <button
                                key={idx}
                                disabled={phase !== 'playing' || cell !== null || currentTurnStr !== effectivePlayerId}
                                onClick={() => handleCellClick(idx)}
                                className={`rounded-xl bg-slate-800 flex items-center justify-center text-7xl font-black transition-all
                                    ${cell === 'X' ? 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]' : ''}
                                    ${cell === 'O' ? 'text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]' : ''}
                                    ${!cell && currentTurnStr === effectivePlayerId && phase === 'playing' ? 'hover:bg-slate-700 cursor-pointer active:scale-95' : ''}
                                `}
                            >
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: cell ? 1 : 0, opacity: cell ? 1 : 0 }}
                                    transition={{ type: 'spring', bounce: 0.6 }}
                                >
                                    {cell}
                                </motion.div>
                            </button>
                        ))}
                    </div>

                    {/* Overlay Result */}
                    {phase === 'result' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute z-20 bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl"
                        >
                            <h2 className="text-4xl font-black text-white mb-2">
                                {winner === effectivePlayerId ? '🏆 ¡VICTORIA! 🏆' : winner === 'tie' ? '🤝 EMPATE 🤝' : '💀 DERROTA 💀'}
                            </h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                {winner === localPlayerId ? 'No hay rival para ti en 3 en Raya.' : winner === 'tie' ? 'Defensas perfectas.' : 'Fuiste más lento o te engañaron...'}
                            </p>

                            <Button size="lg" className="w-full h-16 text-xl" onClick={() => setPhase('waiting_sync')}> {/* Actually we should recreate room to rematch but for MVP just exit */}
                                Finalizado (Cerrar Arriba)
                            </Button>
                        </motion.div>
                    )}

                </div>
            )}
        </div>
    );
}
