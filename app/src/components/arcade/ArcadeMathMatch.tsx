import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeMathMatchProps {
    roomId: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';

interface MathProblem {
    question: string;
    options: number[];
    answer: number;
}

const TOTAL_PROBLEMS = 5;

// Pure function so both clients can generate identical or different problems, doesn't matter since they play local instances and race.
const generateProblem = (): MathProblem => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, ans = 0;

    if (op === '+') {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
        ans = a + b;
    } else if (op === '-') {
        a = Math.floor(Math.random() * 50) + 20;
        b = Math.floor(Math.random() * 20) + 1;
        ans = a - b;
    } else {
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
        ans = a * b;
    }

    // Generate 3 wrong options close to answer
    let options = [ans];
    while (options.length < 4) {
        const mix = ans + (Math.floor(Math.random() * 21) - 10);
        if (!options.includes(mix) && mix > 0) {
            options.push(mix);
        }
    }

    // Shuffle
    options.sort(() => Math.random() - 0.5);

    return { question: `${a} ${op} ${b}`, options, answer: ans };
};

export function ArcadeMathMatch({ roomId, onClose }: ArcadeMathMatchProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [myScore, setMyScore] = useState(0);
    const [remoteScore, setRemoteScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(3);

    const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
    const [errorPenalty, setErrorPenalty] = useState(false);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!localPlayerId) return;

        const channel = supabase.channel(`math-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'score_update' }, ({ payload }) => {
                if (payload.playerId !== localPlayerId) {
                    setRemoteScore(payload.score);
                    if (payload.score >= TOTAL_PROBLEMS) {
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
        setTimeLeft(3); // 3 seconds countdown
        setPhase('countdown');
        setCurrentProblem(generateProblem());

        let cd = 3;
        const interval = setInterval(() => {
            cd--;
            if (cd > 0) {
                setTimeLeft(cd);
            } else {
                clearInterval(interval);
                setPhase('playing');
            }
        }, 1000);
    };

    const handleAnswer = (val: number) => {
        if (phase !== 'playing' || errorPenalty || !currentProblem) return;

        if (val === currentProblem.answer) {
            const nextScore = myScore + 1;
            setMyScore(nextScore);

            channelRef.current?.send({
                type: 'broadcast',
                event: 'score_update',
                payload: { playerId: localPlayerId, score: nextScore }
            });

            if (nextScore >= TOTAL_PROBLEMS) {
                setWinner(localPlayerId!);
                setPhase('result');
            } else {
                setCurrentProblem(generateProblem());
            }
        } else {
            // Penalty
            if (navigator.vibrate) navigator.vibrate(200);
            setErrorPenalty(true);
            setTimeout(() => {
                setErrorPenalty(false);
            }, 1000); // 1 sec penalty
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-[hsl(var(--neon-blue))] uppercase">Duelo Matemático</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4">Esperando matemático rival...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-emerald-400">Rival Listo</h2>
                            <Button size="lg" className="h-16 px-12 text-2xl animate-bounce bg-[hsl(var(--neon-blue))] hover:bg-blue-500" onClick={handleStartSync}>
                                EMPEZAR DUELO
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
                        className="text-9xl font-black text-[hsl(var(--neon-blue))] drop-shadow-[0_0_30px_rgba(0,195,255,0.8)]"
                    >
                        {timeLeft}
                    </motion.div>
                </div>
            )}

            {phase === 'playing' && currentProblem && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 max-w-2xl mx-auto w-full">

                    {/* Progress Trackers */}
                    <div className="w-full flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-white/10">
                        <div className="flex flex-col items-center w-1/3">
                            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-1">Tú</span>
                            <div className="flex gap-1">
                                {Array.from({ length: TOTAL_PROBLEMS }).map((_, i) => (
                                    <div key={i} className={`w-4 h-6 rounded-sm ${i < myScore ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white/20 italic">VS</div>
                        <div className="flex flex-col items-center w-1/3">
                            <span className="text-xs uppercase tracking-widest font-bold text-red-400 mb-1">Rival</span>
                            <div className="flex gap-1">
                                {Array.from({ length: TOTAL_PROBLEMS }).map((_, i) => (
                                    <div key={i} className={`w-4 h-6 rounded-sm ${i < remoteScore ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Problem Display */}
                    <motion.div
                        key={currentProblem.question}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-6xl md:text-8xl font-black my-12 text-center transition-colors ${errorPenalty ? 'text-red-500 animate-shake' : 'text-white'}`}
                    >
                        {errorPenalty ? '¡ERROR!' : currentProblem.question}
                    </motion.div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4 w-full px-4">
                        {currentProblem.options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAnswer(opt)}
                                disabled={errorPenalty}
                                className={`h-24 md:h-32 text-4xl font-black rounded-[2rem] border-b-8 active:border-b-0 active:translate-y-2 transition-all
                                    ${errorPenalty ? 'bg-slate-800 border-slate-900 text-slate-600' : 'bg-gradient-to-br from-indigo-500 to-blue-600 border-blue-900 shadow-[0_10px_20px_rgba(0,0,0,0.5)]'}`}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/80 p-8 rounded-[40px] backdrop-blur-xl border border-white/10 w-full max-w-md mx-auto text-center shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-white mb-2">
                            {winner === localPlayerId ? '🧠 ¡CEREBRITO! 🧠' : '📉 SUSPENSO 📉'}
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            {winner === localPlayerId ? 'Eres una calculadora humana.' : 'El rival resolvió los 5 problemas antes que tú.'}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-white text-black hover:bg-gray-200" onClick={() => setPhase('waiting_sync')}>
                            Cerrar
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
