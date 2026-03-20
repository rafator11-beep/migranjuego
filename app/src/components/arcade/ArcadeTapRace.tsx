import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeTapRaceProps {
    roomId: string;
    playerId?: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';

export function ArcadeTapRace({ roomId, playerId, onClose }: ArcadeTapRaceProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const isBotMatch = roomId.startsWith('bot_');
    const [timeLeft, setTimeLeft] = useState(10);

    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const channelRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout>(null);
    const scoreRef = useRef(0);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`taprace-${roomId}`);
        channelRef.current = channel;

        if (isBotMatch) {
            const botReadyTimer = setTimeout(() => setRemotePlayerReady(true), 700);
            return () => {
                clearTimeout(botReadyTimer);
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'score_update' }, ({ payload }) => {
                if (payload.playerId !== effectivePlayerId) {
                    setRemoteScore(payload.score);
                }
            })
            .on('broadcast', { event: 'start_game' }, () => {
                startCountdown();
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
            if (timerRef.current) clearInterval(timerRef.current);
            if (!isBotMatch) supabase.removeChannel(channel);
        };
    }, [roomId, effectivePlayerId, isBotMatch]);

    const handleStartSync = () => {
        if (!isBotMatch) {
            channelRef.current?.send({ type: 'broadcast', event: 'start_game' });
        }
        startCountdown();
    };

    const startCountdown = () => {
        setMyScore(0);
        setRemoteScore(0);
        scoreRef.current = 0;
        setWinner(null);
        setTimeLeft(3); // 3 seconds countdown
        setPhase('countdown');

        let cd = 3;
        const interval = setInterval(() => {
            cd--;
            if (cd > 0) {
                setTimeLeft(cd);
            } else {
                clearInterval(interval);
                startGameplay();
            }
        }, 1000);
    };

    const startGameplay = () => {
        setPhase('playing');
        setTimeLeft(10);

        let tl = 10;
        timerRef.current = setInterval(() => {
            tl--;
            setTimeLeft(tl);
            if (tl <= 0) {
                endGame();
            }
        }, 1000);
    };

    const endGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('result');

        // Broadcast final score just in case
        channelRef.current?.send({
            type: 'broadcast',
            event: 'score_update',
            payload: { playerId: effectivePlayerId, score: scoreRef.current }
        });

        // Determine winner
        setTimeout(() => {
            setRemoteScore(prevRemote => { // ensure latest remote score is used mentally
                const finalRemote = prevRemote;
                const finalMy = scoreRef.current;
                if (finalMy > finalRemote) setWinner(effectivePlayerId);
                else if (finalRemote > finalMy) setWinner('remote');
                else setWinner('tie');
                return finalRemote;
            });
        }, 500); // give it a sec to receive last packets
    };

    const handleTap = () => {
        if (phase !== 'playing') return;

        const newScore = scoreRef.current + 1;
        scoreRef.current = newScore;
        setMyScore(newScore);

        // Broadcast every tap (Supabase realtime limit is usually ~10/sec per client. Could throttle, but 10 clicks/s is roughly human max)
        channelRef.current?.send({
            type: 'broadcast',
            event: 'score_update',
            payload: { playerId: effectivePlayerId, score: newScore }
        });

        // Vibrate if on mobile
        if (navigator.vibrate) navigator.vibrate(10);
    };


    useEffect(() => {
        if (!isBotMatch || phase !== 'playing') return;

        const botTimer = setInterval(() => {
            setRemoteScore((prev) => prev + 1);
        }, 120 + Math.floor(Math.random() * 80));

        return () => clearInterval(botTimer);
    }, [isBotMatch, phase]);

    // Derived UI values
    const myProgress = Math.min((myScore / 100) * 100, 100);
    const remoteProgress = Math.min((remoteScore / 100) * 100, 100);

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none touch-manipulation">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-[hsl(var(--neon-pink))] uppercase">CARRERA DE CLICS</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4">Esperando rival...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-emerald-400">Rival Listo</h2>
                            <Button size="lg" className="h-16 px-12 text-2xl animate-bounce bg-emerald-600 hover:bg-emerald-500" onClick={handleStartSync}>
                                EMPEZAR
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {phase === 'countdown' && (
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        key={timeLeft}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 3, opacity: 0 }}
                        className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                    >
                        {timeLeft}
                    </motion.div>
                </div>
            )}

            {phase === 'playing' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 max-w-2xl mx-auto w-full">
                    {/* Top Progress Bars */}
                    <div className="w-full space-y-6 bg-black/40 p-6 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="font-bold text-red-400 uppercase tracking-widest text-sm">Rival</span>
                                <span className="font-black text-2xl text-red-400">{remoteScore}</span>
                            </div>
                            <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden border border-red-500/20">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${remoteProgress}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="font-bold text-[hsl(var(--neon-blue))] uppercase tracking-widest text-sm">Tú</span>
                                <span className="font-black text-2xl text-[hsl(var(--neon-blue))]">{myScore}</span>
                            </div>
                            <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden border border-[hsl(var(--neon-blue))]/20">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-600 to-[hsl(var(--neon-blue))]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${myProgress}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="text-center my-8">
                        <span className="text-xl text-white/50 uppercase tracking-widest font-bold">Tiempo Restante</span>
                        <div className={`text-6xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Massive Button */}
                    <motion.button
                        whileTap={{ scale: 0.9, y: 10 }}
                        onClick={handleTap}
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-[0_20px_0_rgb(107,33,168),0_0_50px_rgba(236,72,153,0.5)] active:shadow-[0_0px_0_rgb(107,33,168),0_0_50px_rgba(236,72,153,0.5)] border-4 border-pink-300 flex items-center justify-center transform active:translate-y-[20px] outline-none"
                    >
                        <span className="text-4xl md:text-5xl font-black text-white drop-shadow-md">¡PULSA!</span>
                    </motion.button>
                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="bg-black/80 p-8 rounded-[40px] backdrop-blur-xl border border-white/10 w-full max-w-md mx-auto text-center shadow-2xl transform scale-105">
                        <h2 className="text-4xl font-black text-white mb-2">
                            {winner === effectivePlayerId ? '🏆 ¡VICTORIA! 🏆' : winner === 'tie' ? '🤝 EMPATE 🤝' : '💀 DERROTA 💀'}
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            {winner === effectivePlayerId ? 'Tienes unos dedos relámpago.' : winner === 'tie' ? 'Igualdad máxima.' : 'Te han aplastado...'}
                        </p>

                        <div className="flex justify-around items-center bg-white/5 p-6 rounded-3xl mb-8">
                            <div className="flex flex-col items-center">
                                <span className="text-white/50 text-sm uppercase tracking-widest mb-2 font-bold">Tú</span>
                                <span className={`text-5xl font-black ${winner === effectivePlayerId ? 'text-green-400' : 'text-white'}`}>{myScore}</span>
                            </div>
                            <span className="text-3xl text-white/20 font-light">VS</span>
                            <div className="flex flex-col items-center">
                                <span className="text-white/50 text-sm uppercase tracking-widest mb-2 font-bold">Rival</span>
                                <span className={`text-5xl font-black ${winner === 'remote' ? 'text-red-400' : 'text-white'}`}>{remoteScore}</span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-white text-black hover:bg-gray-200" onClick={handleStartSync}>
                            Jugar de nuevo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
