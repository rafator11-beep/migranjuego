import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import reverso from '@/assets/reverso.jpg';

interface ArcadeHighLowProps {
    roomId: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';

const SUITS = ['H', 'D', 'C', 'S'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const getRank = (value: string) => VALUES.indexOf(value);
const getRandomCard = () => {
    const s = SUITS[Math.floor(Math.random() * SUITS.length)];
    const v = VALUES[Math.floor(Math.random() * VALUES.length)];
    return `${v}${s}`;
};

const WIN_STREAK_TARGET = 7;

export function ArcadeHighLow({ roomId, playerId, onClose }: ArcadeHighLowProps & { playerId?: string }) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);
    const isBotMatch = roomId.startsWith('bot_');

    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const [currentCard, setCurrentCard] = useState<string>('7H');
    const [nextCard, setNextCard] = useState<string | null>(null);
    const [waitingForNext, setWaitingForNext] = useState(false);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

        const channel = supabase.channel(`highlow-${roomId}`);
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
            .on('broadcast', { event: 'start_game' }, ({ payload }) => {
                if (payload.startingCard) {
                    setCurrentCard(payload.startingCard);
                }
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
        const initial = getRandomCard();
        if (!isBotMatch) {
            channelRef.current?.send({
                type: 'broadcast',
                event: 'start_game',
                payload: { startingCard: initial }
            });
        }
        setCurrentCard(initial);
        startCountdown();
    };

    const startCountdown = () => {
        setMyScore(0);
        setRemoteScore(0);
        setWinner(null);
        setPhase('countdown');
        setNextCard(null);

        setTimeout(() => {
            setPhase('playing');
        }, 3000);
    };

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (waitingForNext || phase !== 'playing') return;

        setWaitingForNext(true);
        let nCard = getRandomCard();
        while (getRank(nCard[0]) === getRank(currentCard[0])) {
            nCard = getRandomCard(); // prevent ties for simplicity
        }

        setNextCard(nCard);

        const isHigher = getRank(nCard[0]) > getRank(currentCard[0]);
        const correct = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);

        setTimeout(() => {
            let nextScore = myScore;

            if (correct) {
                nextScore += 1;
                setMyScore(nextScore);

                if (!isBotMatch) {
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'score_update',
                        payload: { playerId: effectivePlayerId, score: nextScore }
                    });
                }

                if (nextScore >= WIN_STREAK_TARGET) {
                    setWinner(effectivePlayerId);
                    setPhase('result');
                }
            } else {
                nextScore = 0;
                setMyScore(0);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                if (!isBotMatch) {
                    channelRef.current?.send({
                        type: 'broadcast',
                        event: 'score_update',
                        payload: { playerId: effectivePlayerId, score: 0 }
                    });
                }
            }

            // advance card
            if (nextScore < WIN_STREAK_TARGET) {
                setCurrentCard(nCard);
                setNextCard(null);
                setWaitingForNext(false);
            }
        }, 1000);
    };


    useEffect(() => {
        if (!isBotMatch || phase !== 'playing' || winner) return;

        const botTurn = setTimeout(() => {
            const willScore = Math.random() > 0.35;
            setRemoteScore((prev) => {
                const next = willScore ? prev + 1 : 0;
                if (next >= WIN_STREAK_TARGET) {
                    setWinner('remote');
                    setPhase('result');
                }
                return next;
            });
        }, 900 + Math.random() * 900);

        return () => clearTimeout(botTurn);
    }, [isBotMatch, phase, remoteScore, winner, currentCard]);

    const renderCard = (cardString: string, hidden: boolean = false) => {
        if (hidden) {
            return (
                <div
                    className="w-32 h-48 md:w-48 md:h-64 rounded-2xl bg-slate-800 border-4 border-slate-700 shadow-2xl flex items-center justify-center bg-cover bg-center"
                    style={{ backgroundImage: `url('${reverso}')` }}
                />
            );
        }

        const rank = cardString.slice(0, -1);
        const suit = cardString.slice(-1);
        const suitSymbols: Record<string, { symbol: string, color: string }> = {
            'H': { symbol: '♥', color: 'text-red-500' },
            'D': { symbol: '♦', color: 'text-red-500' },
            'S': { symbol: '♠', color: 'text-slate-900' },
            'C': { symbol: '♣', color: 'text-slate-900' }
        };

        const { symbol, color } = suitSymbols[suit] || { symbol: '?', color: 'text-black' };

        return (
            <div className="w-32 h-48 md:w-48 md:h-64 bg-white rounded-2xl border-4 border-slate-200 flex flex-col items-center justify-between p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <span className={`text-4xl md:text-5xl font-black self-start ${color}`}>{rank}</span>
                <span className={`text-6xl md:text-8xl ${color}`}>{symbol}</span>
                <span className={`text-4xl md:text-5xl font-black self-end rotate-180 ${color}`}>{rank}</span>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-yellow-400 uppercase">Mayor o Menor</div>
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
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.5, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, times: [0, 0.2, 1] }}
                        className="text-7xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] uppercase text-center"
                    >
                        ¡HAZ LA<br />RACHA DE 7!
                    </motion.div>
                </div>
            )}

            {phase === 'playing' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 w-full max-w-4xl mx-auto">

                    {/* Streaks Header */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="bg-black/40 rounded-3xl p-4 flex flex-col items-center border border-[hsl(var(--neon-blue))]/30 shadow-[0_0_20px_hsla(var(--neon-blue),0.2)]">
                            <span className="text-xs uppercase tracking-widest font-bold text-[hsl(var(--neon-blue))]">Tu Racha</span>
                            <span className="text-4xl font-black text-white px-4">{myScore} / 7</span>
                        </div>
                        <div className="bg-black/40 rounded-3xl p-4 flex flex-col items-center border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <span className="text-xs uppercase tracking-widest font-bold text-red-500">Racha Rival</span>
                            <span className="text-4xl font-black text-white px-4">{remoteScore} / 7</span>
                        </div>
                    </div>

                    {/* Cards Area */}
                    <div className="flex justify-center items-center gap-4 md:gap-12 relative my-12 w-full">
                        <motion.div
                            key={currentCard}
                            initial={{ x: -100, rotate: -20, opacity: 0 }}
                            animate={{ x: 0, rotate: -5, opacity: 1 }}
                            className="z-10 relative"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-white/50 whitespace-nowrap">
                                CARTA ACTUAL
                            </div>
                            {renderCard(currentCard)}
                        </motion.div>

                        <div className="text-4xl font-black text-white/20 italic absolute left-1/2 -translate-x-1/2 z-0 hidden md:block">VS</div>

                        <motion.div
                            key={nextCard || 'hidden'}
                            className="z-10 relative"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-white/50 whitespace-nowrap">
                                SIGUIENTE CARTA
                            </div>

                            <AnimatePresence mode="popLayout">
                                {nextCard ? (
                                    <motion.div
                                        key={nextCard}
                                        initial={{ scale: 0.8, rotateY: 90 }}
                                        animate={{ scale: 1, rotateY: 0, rotate: 5 }}
                                    >
                                        {renderCard(nextCard)}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="hidden"
                                        animate={{ rotate: 5 }}
                                    >
                                        {renderCard('', true)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex gap-4 w-full px-4 mb-4">
                        <Button
                            size="lg"
                            disabled={waitingForNext}
                            onClick={() => handleGuess('higher')}
                            className="flex-1 h-24 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-2xl border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2 transition-all flex flex-col gap-1 shadow-xl"
                        >
                            <ArrowUp size={36} strokeWidth={3} className="drop-shadow-md" />
                            MAYOR
                        </Button>

                        <Button
                            size="lg"
                            disabled={waitingForNext}
                            onClick={() => handleGuess('lower')}
                            className="flex-1 h-24 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl border-b-8 border-rose-900 active:border-b-0 active:translate-y-2 transition-all flex flex-col gap-1 shadow-xl"
                        >
                            <ArrowDown size={36} strokeWidth={3} className="drop-shadow-md" />
                            MENOR
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
                            {winner === effectivePlayerId ? '✨ ¡EN RACHA! ✨' : '🛑 FIN DE RACHA 🛑'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === effectivePlayerId ? `Adivinaste ${WIN_STREAK_TARGET} cartas seguidas antes que tu rival. ¡Qué visión!` : 'Tu rival llegó a las 7 adivinaciones primero.'}
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
