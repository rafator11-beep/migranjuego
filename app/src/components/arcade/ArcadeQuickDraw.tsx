import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeQuickDrawProps {
    roomId: string;
    playerId?: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'ready' | 'steady' | 'draw' | 'result';

export function ArcadeQuickDraw({ roomId, playerId, onClose }: ArcadeQuickDrawProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const [myReactionTime, setMyReactionTime] = useState<number | null>(null);
    const [remoteReactionTime, setRemoteReactionTime] = useState<number | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [earlyDraw, setEarlyDraw] = useState(false);

    const channelRef = useRef<any>(null);
    const drawStartTimeRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`quickdraw-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'draw_time' }, ({ payload }) => {
                if (payload.playerId !== effectivePlayerId) {
                    setRemoteReactionTime(payload.time);
                    if (payload.early) {
                        setWinner(effectivePlayerId); // They drew early, I win
                        setPhase('result');
                    }
                }
            })
            .on('broadcast', { event: 'start_sequence' }, () => {
                startSequence();
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // Tell others I am ready
                    channel.send({
                        type: 'broadcast',
                        event: 'ready',
                        payload: { playerId: effectivePlayerId }
                    });
                }
            });

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            supabase.removeChannel(channel);
        };
    }, [roomId, effectivePlayerId]);

    useEffect(() => {
        // If both are ready (my component mounted AND remote is ready), the "host" starts it.
        // For simplicity, we just use the first player in context list or whoever triggers it.
        // Better: just have a "START GAME" button.
    }, [remotePlayerReady]);

    const handleStartSync = () => {
        channelRef.current?.send({ type: 'broadcast', event: 'start_sequence' });
        startSequence();
    };

    const startSequence = () => {
        setPhase('steady');
        setMyReactionTime(null);
        setRemoteReactionTime(null);
        setWinner(null);
        setEarlyDraw(false);

        const randomDelay = Math.floor(Math.random() * 4000) + 2000; // 2 to 6 seconds

        timeoutRef.current = setTimeout(() => {
            setPhase('draw');
            drawStartTimeRef.current = Date.now();
        }, randomDelay);
    };

    const handleTap = () => {
        if (phase === 'steady') {
            // Early draw! Lose instantly.
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setEarlyDraw(true);
            setPhase('result');
            setWinner('remote'); // Remote wins

            channelRef.current?.send({
                type: 'broadcast',
                event: 'draw_time',
                payload: { playerId: effectivePlayerId, time: 0, early: true }
            });
            toast.error("¡Te has precipitado!");
            return;
        }

        if (phase === 'draw' && myReactionTime === null) {
            const rt = Date.now() - drawStartTimeRef.current;
            setMyReactionTime(rt);

            channelRef.current?.send({
                type: 'broadcast',
                event: 'draw_time',
                payload: { playerId: effectivePlayerId, time: rt, early: false }
            });
        }
    };

    // Calculate winner
    useEffect(() => {
        if (myReactionTime !== null && remoteReactionTime !== null && phase !== 'result') {
            setPhase('result');
            if (myReactionTime < remoteReactionTime) {
                setWinner(effectivePlayerId);
                toast.success("¡Eres el jugador más rápido del Oeste! 🤠");
            } else if (remoteReactionTime < myReactionTime) {
                setWinner('remote');
                toast.error("Tu oponente desenfundó más rápido... 💀");
            } else {
                setWinner('tie');
                toast("¡Empate exacto! Matemáticamente improbable...");
            }
        }
    }, [myReactionTime, remoteReactionTime, phase, effectivePlayerId]);

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col user-select-none">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="text-white font-black tracking-widest text-xl">REFLEJOS</div>
                <div className="w-20"></div>
            </div>

            {/* Main Interactive Area */}
            <div
                className={`flex-1 flex items-center justify-center transition-colors duration-100 ${phase === 'waiting_sync' || phase === 'ready' ? 'bg-slate-900' :
                        phase === 'steady' ? 'bg-red-600' :
                            phase === 'draw' ? 'bg-green-500' :
                                phase === 'result' ? 'bg-slate-900' : 'bg-black'
                    }`}
                onPointerDown={handleTap}
            >
                {phase === 'waiting_sync' && (
                    <div className="text-center text-white animate-pulse">
                        <h2 className="text-2xl font-bold mb-4">Esperando oponente...</h2>
                    </div>
                )}

                {phase === 'ready' && (
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-white mb-8">Todos listos</h2>
                        <Button size="lg" className="w-64 h-20 text-2xl" onClick={handleStartSync}>INICIAR DUELO</Button>
                    </div>
                )}

                {phase === 'steady' && (
                    <div className="text-center">
                        <h2 className="text-5xl md:text-8xl font-black text-white drop-shadow-2xl">¡PREPARADOS!</h2>
                        <p className="mt-4 text-white/80 uppercase tracking-widest">Espera al verde...</p>
                    </div>
                )}

                {phase === 'draw' && (
                    <div className="text-center">
                        <h2 className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] scale-110">¡DISPARA!</h2>
                    </div>
                )}

                {phase === 'result' && (
                    <div className="text-center bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-white/10 w-full max-w-md mx-4">
                            <h2 className="text-4xl font-black text-white mb-8">
                                {winner === effectivePlayerId ? '✨ ¡GANASTE! ✨' : winner === 'tie' ? 'EMPATE' : '❌ PERDISTE ❌'}
                            </h2>

                        <div className="space-y-4 mb-8 text-left">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                <span className="text-white/80">Tu tiempo:</span>
                                <span className={`text-xl font-bold ${winner === effectivePlayerId ? 'text-green-400' : 'text-white'}`}>
                                    {earlyDraw ? 'Falso inicio' : myReactionTime ? `${myReactionTime}ms` : '---'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                <span className="text-white/80">Rival:</span>
                                <span className={`text-xl font-bold ${winner === 'remote' ? 'text-green-400' : 'text-white'}`}>
                                    {remoteReactionTime ? `${remoteReactionTime}ms` : (winner === effectivePlayerId ? 'Falso inicio' : '---')}
                                </span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full h-16 text-xl" onClick={handleStartSync}>
                            Revancha
                        </Button>
                    </div>
                )}
            </div>

            {phase === 'waiting_sync' && remotePlayerReady && (
                <div className="absolute bottom-10 inset-x-0 flex justify-center">
                    <Button size="lg" className="h-16 px-8 text-xl animate-bounce" onClick={() => setPhase('ready')}>¡Rival encontrado! (Empezar)</Button>
                </div>
            )}
        </div>
    );
}
