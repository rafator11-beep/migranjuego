import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeCoinFlipProps {
    roomId: string;
    playerId?: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';
type CoinSide = 'heads' | 'tails';

const WIN_STREAK_TARGET = 5;

export function ArcadeCoinFlip({ roomId, playerId, onClose }: ArcadeCoinFlipProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const isBotMatch = roomId.startsWith('bot_');

    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const [isFlipping, setIsFlipping] = useState(false);
    const [currentSide, setCurrentSide] = useState<CoinSide>('heads');

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`coinflip-${roomId}`);
        channelRef.current = channel;

        if (isBotMatch) {
            const botReadyTimer = setTimeout(() => setRemotePlayerReady(true), 700);
            return () => clearTimeout(botReadyTimer);
        }

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'score_update' }, ({ payload }) => {
                if (payload.playerId !== effectivePlayerId) {
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
                        payload: { playerId: effectivePlayerId }
                    });
                }
            });

        return () => {
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

            if (guess === result) {
                const newScore = myScore + 1;
                setMyScore(newScore);
                if (!isBotMatch) {
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'score_update',
                        payload: { playerId: effectivePlayerId, score: newScore }
                    });
                }

                if (newScore >= WIN_STREAK_TARGET) {
                    setWinner(effectivePlayerId);
                    setPhase('result');
                }
            } else {
                setMyScore(0);
                if (!isBotMatch) {
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'score_update',
                        payload: { playerId: effectivePlayerId, score: 0 }
                    });
                }
            }
        }, 1000);
    };


    useEffect(() => {
        if (!isBotMatch || phase !== 'playing' || isFlipping || winner) return;

        const botTurn = setTimeout(() => {
            const success = Math.random() > 0.45;
            setRemoteScore((prev) => {
                const next = success ? prev + 1 : 0;
                if (next >= WIN_STREAK_TARGET) {
                    setWinner('remote');
                    setPhase('result');
                }
                return next;
            });
        }, 950 + Math.random() * 900);

        return () => clearTimeout(botTurn);
    }, [isBotMatch, phase, remoteScore, isFlipping, winner, myScore]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {phase === 'waiting_sync' && (
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">CARA O CRUZ 1v1</h1>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${remotePlayerReady ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                            <span className="text-white/80 font-medium">
                                {remotePlayerReady ? 'Rival Conectado' : 'Esperando rival...'}
                            </span>
                        </div>
                        <Button size="lg" className="w-64 h-16 text-xl rounded-2xl font-bold bg-amber-500 text-black hover:bg-amber-400" onClick={handleStartSync} disabled={!remotePlayerReady}>
                            ENTRAR AL DUELO
                        </Button>
                        <Button variant="ghost" className="text-white/40" onClick={onClose}>Cancelar</Button>
                    </div>
                </div>
            )}

            {(phase === 'playing' || phase === 'countdown') && (
                <div className="w-full max-w-lg flex flex-col items-center">
                    <div className="w-full flex justify-between mb-12 px-4">
                        <div className="text-center">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Tú</p>
                            <p className="text-3xl font-black text-amber-500">{myScore}/{WIN_STREAK_TARGET}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Rival</p>
                            <p className="text-3xl font-black text-white/20">{remoteScore}/{WIN_STREAK_TARGET}</p>
                        </div>
                    </div>

                    <div className="relative w-40 h-40 mb-12">
                        <motion.div
                            animate={isFlipping ? { rotateY: 720, y: [0, -150, 0] } : {}}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center border-4 border-amber-200/50"
                        >
                            <span className="text-6xl">{currentSide === 'heads' ? '�' : '👑'}</span>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full px-8">
                        <Button
                            size="lg"
                            className="h-20 rounded-2xl text-xl font-bold bg-white text-black hover:bg-gray-100"
                            onClick={() => handleGuess('heads')}
                            disabled={isFlipping || phase === 'countdown'}
                        >
                            CARA
                        </Button>
                        <Button
                            size="lg"
                            className="h-20 rounded-2xl text-xl font-bold bg-amber-600 text-white hover:bg-amber-500"
                            onClick={() => handleGuess('tails')}
                            disabled={isFlipping || phase === 'countdown'}
                        >
                            CRUZ
                        </Button>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-amber-500/50 w-full max-w-md mx-auto text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-amber-500 mb-2 drop-shadow-md">
                            {winner === effectivePlayerId ? '✨ ¡IMBATIBLE! ✨' : '🛑 RACHA ROTA 🛑'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === effectivePlayerId ? `Conseguiste ${WIN_STREAK_TARGET} aciertos seguidos. ¡Tienes el toque de Midas!` : 'Tu rival fue más rápido o tuvo más suerte esta vez.'}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-amber-500 text-black hover:bg-amber-400 hover:scale-105 transition-all" onClick={() => setPhase('waiting_sync')}>
                            Volver al Lobby
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
