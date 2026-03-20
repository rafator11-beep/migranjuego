import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeMinesweeperProps {
    roomId: string;
    playerId?: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'playing' | 'result';
type CellState = 'hidden' | 'safe' | 'bomb';

const GRID_SIZE = 25; // 5x5
const NUM_BOMBS = 5;

// Generate fixed bomb indices for a match
const generateBombs = () => {
    let bombs = new Set<number>();
    while (bombs.size < NUM_BOMBS) {
        bombs.add(Math.floor(Math.random() * GRID_SIZE));
    }
    return Array.from(bombs);
};

export function ArcadeMinesweeper({ roomId, playerId, onClose }: ArcadeMinesweeperProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const isBotMatch = roomId.startsWith('bot_');

    const [winner, setWinner] = useState<string | null>(null);

    const [currentTurnId, setCurrentTurnId] = useState<string | null>(null);
    const [bombIndices, setBombIndices] = useState<number[]>([]);
    const [revealedCells, setRevealedCells] = useState<Record<number, CellState>>({});

    // Points (safe cells clicked) if needed for tiebreaker, but here it's sudden death
    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`minesweeper-${roomId}`);
        channelRef.current = channel;

        if (isBotMatch) {
            const botReadyTimer = setTimeout(() => {
                setRemotePlayerReady(true);
                const starter = Math.random() > 0.5 ? effectivePlayerId : 'remote';
                startGame(starter, generateBombs());
            }, 700);
            return () => clearTimeout(botReadyTimer);
        }

        channel
            .on('broadcast', { event: 'ready' }, ({ payload }) => {
                setRemotePlayerReady(true);
                // Host initializes game if first
                if (!currentTurnId && payload.playerId !== effectivePlayerId) {
                    const starter = Math.random() > 0.5 ? effectivePlayerId : payload.playerId;
                    const bombs = generateBombs();
                    channel.send({
                        type: 'broadcast',
                        event: 'start_game',
                        payload: { starterId: starter, bombs }
                    });
                    startGame(starter, bombs);
                }
            })
            .on('broadcast', { event: 'start_game' }, ({ payload }) => {
                if (!currentTurnId) {
                    startGame(payload.starterId, payload.bombs);
                }
            })
            .on('broadcast', { event: 'click_cell' }, ({ payload }) => {
                handleRemoteClick(payload.index, payload.playerId);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'ready',
                        payload: { playerId: effectivePlayerId }
                    });
                }
            });

        return () => {
            if (!isBotMatch) supabase.removeChannel(channel);
        };
    }, [roomId, effectivePlayerId, currentTurnId, isBotMatch]);

    const startGame = (starterId: string, bombs: number[]) => {
        setWinner(null);
        setPhase('playing');
        setCurrentTurnId(starterId);
        setBombIndices(bombs);
        setRevealedCells({});
        setMyScore(0);
        setRemoteScore(0);
    };

    const handleRemoteClick = (index: number, pid: string) => {
        const isBomb = bombIndices.includes(index);
        if (isBomb) {
            setRevealedCells(prev => ({ ...prev, [index]: 'bomb' }));
            setWinner(effectivePlayerId);
            setPhase('result');
        } else {
            setRevealedCells(prev => ({ ...prev, [index]: 'safe' }));
            setRemoteScore(prev => prev + 1);
            setCurrentTurnId(effectivePlayerId);
        }
    };

    const handleCellClick = (index: number) => {
        if (phase !== 'playing' || currentTurnId !== effectivePlayerId || revealedCells[index]) return;

        const isBomb = bombIndices.includes(index);

        if (!isBotMatch) {
            channelRef.current?.send({
                type: 'broadcast',
                event: 'click_cell',
                payload: { index, playerId: effectivePlayerId }
            });
        }

        if (isBomb) {
            setRevealedCells(prev => ({ ...prev, [index]: 'bomb' }));
            setWinner('remote');
            setPhase('result');
        } else {
            setRevealedCells(prev => ({ ...prev, [index]: 'safe' }));
            setMyScore(prev => prev + 1);
            setCurrentTurnId('remote');
        }
    };


    useEffect(() => {
        if (!isBotMatch || phase !== 'playing' || currentTurnId === effectivePlayerId || winner) return;

        const botMove = setTimeout(() => {
            const hidden = Array.from({ length: GRID_SIZE }, (_, i) => i).filter((i) => !revealedCells[i]);
            if (!hidden.length) return;
            const safe = hidden.filter((i) => !bombIndices.includes(i));
            const chosen = safe.length && Math.random() > 0.22
                ? safe[Math.floor(Math.random() * safe.length)]
                : hidden[Math.floor(Math.random() * hidden.length)];
            handleRemoteClick(chosen, 'remote');
        }, 900 + Math.random() * 700);

        return () => clearTimeout(botMove);
    }, [isBotMatch, phase, currentTurnId, winner, revealedCells, bombIndices, effectivePlayerId]);

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-orange-900/50">
                <Button variant="ghost" className="text-white/50 hover:text-orange-400" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-orange-500 uppercase">Campo de Minas</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4 text-orange-400">Esperando artificiero...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-orange-500">Buscando minas...</h2>
                        </div>
                    )}
                </div>
            )}

            {phase === 'playing' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 w-full max-w-lg mx-auto">

                    {/* Scores & Turn Indicator */}
                    <div className="w-full flex justify-between items-center mb-8 bg-black/50 p-4 rounded-3xl border border-white/5">
                        <div className="text-center w-1/3">
                            <span className="text-xs uppercase tracking-widest text-[hsl(var(--neon-blue))]">Despejadas</span>
                            <div className="text-3xl font-black text-[hsl(var(--neon-blue))]">{myScore}</div>
                        </div>

                        <div className="text-center w-1/3 flex flex-col items-center gap-1">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${currentTurnId === effectivePlayerId ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'bg-white/10 text-white/50'}`}>
                                {currentTurnId === effectivePlayerId ? 'TU TURNO' : 'RIVAL'}
                            </span>
                            <span className="text-[10px] text-orange-500/50 uppercase">Toca una casilla</span>
                        </div>

                        <div className="text-center w-1/3">
                            <span className="text-xs uppercase tracking-widest text-[hsl(var(--neon-pink))]">Rival</span>
                            <div className="text-3xl font-black text-[hsl(var(--neon-pink))]">{remoteScore}</div>
                        </div>
                    </div>

                    {/* Mine Grid (5x5) */}
                    <div className="grid grid-cols-5 gap-2 w-full aspect-square p-3 bg-slate-900 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-white/5">
                        {Array.from({ length: GRID_SIZE }).map((_, i) => {
                            const state = revealedCells[i] || 'hidden';

                            return (
                                <button
                                    key={i}
                                    disabled={currentTurnId !== effectivePlayerId || state !== 'hidden'}
                                    onClick={() => handleCellClick(i)}
                                    className={`rounded-lg relative overflow-hidden transition-all duration-300
                                        ${state === 'hidden' ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600 border-b-4 active:border-b active:translate-y-1 cursor-pointer' : ''}
                                        ${state === 'safe' ? 'bg-slate-800 border border-slate-900 opacity-80 cursor-default' : ''}
                                        ${state === 'bomb' ? 'bg-red-600 border border-red-800 animate-shake cursor-default' : ''}
                                    `}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                                        {state === 'safe' && <span className="text-emerald-500/50">💎</span>}
                                        {state === 'bomb' && <span className="drop-shadow-lg text-4xl">💣</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 text-center text-white/50 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2">
                        <span className="text-orange-500">💣</span> ¡PELIGRO: 5 MINAS OCULTAS! <span className="text-orange-500">💣</span>
                    </div>

                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex items-center justify-center p-4 relative">
                    {winner === 'remote' && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0 bg-red-600 z-0 pointer-events-none mix-blend-color-burn"
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-orange-900 w-full max-w-md mx-auto text-center shadow-[0_0_50px_rgba(249,115,22,0.3)] z-10"
                    >
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 drop-shadow-md ${winner === effectivePlayerId ? 'text-emerald-500' : 'text-red-600'}`}>
                            {winner === effectivePlayerId ? '¡SOBREVIVISTE!' : '💥 BOOM 💥'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === effectivePlayerId ? 'Tu rival pisó una mina. Eres un experto.' : 'Has volado por los aires... ¡Ten más cuidado!'}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-white text-black hover:bg-gray-200 transition-all" onClick={() => setPhase('waiting_sync')}>
                            Volver al Lobby
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
