import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeCoinFlipProps {
    roomId: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';
type CoinSide = 'heads' | 'tails';

const WIN_STREAK_TARGET = 5;

export function ArcadeCoinFlip({ roomId, onClose }: ArcadeCoinFlipProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const [isFlipping, setIsFlipping] = useState(false);
    const [currentSide, setCurrentSide] = useState<CoinSide>('heads');

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!localPlayerId) return;

        const channel = supabase.channel(`coinflip-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'score_update' }, ({ payload }) => {
                if (payload.playerId !== localPlayerId) {
                    setRemoteScore(payload.score);
                    if (payload.score >= WIN_STREAK_TARGET) {
                        setWinner('remote');
                        setPhase('result');
                    }
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
                        payload: { playerId: localPlayerId }
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, localPlayerId]);

    const handleStartSync = () => {
        channelRef.current?.send({ type: 'broadcast', event: 'start_game' });
        startCountdown();
    };

    const startCountdown = () => {
        setMyScore(0);
        setRemoteScore(0);
        setWinner(null);
        setPhase('countdown');

        setTimeout(() => {
            setPhase('playing');
        }, 3000);
    };

    const handleGuess = (guess: CoinSide) => {
        if (isFlipping || phase !== 'playing') return;

        setIsFlipping(true);

        // Locally compute result
        const result: CoinSide = Math.random() > 0.5 ? 'heads' : 'tails';

        // Wait for flip animation
        setTimeout(() => {
            setCurrentSide(result);
            setIsFlipping(false);

            const correct = guess === result;
            let nextScore = myScore;

            if (correct) {
                nextScore += 1;
                setMyScore(nextScore);

                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'score_update',
                    payload: { playerId: localPlayerId, score: nextScore }
                });

                if (nextScore >= WIN_STREAK_TARGET) {
                    setWinner(localPlayerId!);
                    setPhase('result');
                }
            } else {
                nextScore = 0;
                setMyScore(0);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'score_update',
                    payload: { playerId: localPlayerId, score: 0 }
                });
            }
        }, 800);
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-yellow-500 uppercase">Cara o Cruz</div>
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
                            <Button size="lg" className="h-16 px-12 text-2xl animate-bounce bg-yellow-600 hover:bg-yellow-500 text-black border-none" onClick={handleStartSync}>
                                EMPEZAR DUELO
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {phase === 'countdown' && (
                <div className="flex-1 flex items-center justify-center text-center">
                    <motion.div
                        animate={{ scale: [1, 1.5, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, times: [0, 0.2, 1] }}
                        className="text-7xl font-black text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] uppercase"
                    >
                        ¡ADIVINA<br />5 SEGUIDAS!
                    </motion.div>
                </div>
            )}

            {phase === 'playing' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 w-full max-w-2xl mx-auto">

                    {/* Streaks Header */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="bg-black/40 rounded-3xl p-4 flex flex-col items-center border border-yellow-500/30">
                            <span className="text-xs uppercase tracking-widest font-bold text-yellow-500">Tu Racha</span>
                            <span className="text-4xl font-black text-white px-4">{myScore} / 5</span>
                        </div>
                        <div className="bg-black/40 rounded-3xl p-4 flex flex-col items-center border border-red-500/30">
                            <span className="text-xs uppercase tracking-widest font-bold text-red-500">Racha Rival</span>
                            <span className="text-4xl font-black text-white px-4">{remoteScore} / 5</span>
                        </div>
                    </div>

                    {/* Coin Animation Area */}
                    <div className="flex-1 flex items-center justify-center w-full my-8">
                        <motion.div
                            animate={{
                                rotateY: isFlipping ? [0, 1080] : 0,
                                scale: isFlipping ? [1, 1.5, 1] : 1,
                                y: isFlipping ? [0, -100, 0] : 0
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="w-48 h-48 rounded-full border-8 border-yellow-600 bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center"
                        >
                            {!isFlipping && (
                                <span className="text-5xl font-black text-yellow-900 uppercase">
                                    {currentSide === 'heads' ? 'Cara🧔' : 'Cruz❌'}
                                </span>
                            )}
                        </motion.div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex gap-4 w-full px-4 mb-4">
                        <Button
                            size="lg"
                            disabled={isFlipping}
                            onClick={() => handleGuess('heads')}
                            className="flex-1 h-24 rounded-3xl bg-amber-600 hover:bg-amber-500 text-white font-black text-2xl border-b-8 border-amber-800 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                        >
                            CARA
                        </Button>

                        <Button
                            size="lg"
                            disabled={isFlipping}
                            onClick={() => handleGuess('tails')}
                            className="flex-1 h-24 rounded-3xl bg-slate-600 hover:bg-slate-500 text-white font-black text-2xl border-b-8 border-slate-800 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                        >
                            CRUZ
                        </Button>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-yellow-500/50 w-full max-w-md mx-auto text-center shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-yellow-500 mb-2 drop-shadow-md">
                            {winner === localPlayerId ? '✨ ¡EN RACHA! ✨' : '🛑 FIN DE RACHA 🛑'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === localPlayerId ? '¡5 monedas acertadas! Tienes el don.' : 'Tu rival completó la racha primero.'}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105 transition-all" onClick={() => setPhase('waiting_sync')}>
                            Volver al Lobby
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
