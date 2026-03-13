import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeRPSProps {
    roomId: string;
    onClose: () => void;
}

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GamePhase = 'waiting_sync' | 'choosing' | 'reveal' | 'result';

const CHOICES = [
    { id: 'rock', name: 'PIEDRA', emoji: '🪨', color: 'bg-stone-500' },
    { id: 'paper', name: 'PAPEL', emoji: '📄', color: 'bg-blue-400' },
    { id: 'scissors', name: 'TIJERA', emoji: '✂️', color: 'bg-red-500' }
];

export function ArcadeRPS({ roomId, onClose }: ArcadeRPSProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [myChoice, setMyChoice] = useState<Choice>(null);
    const [remoteChoice, setRemoteChoice] = useState<Choice>(null);
    const [winner, setWinner] = useState<string | null>(null);

    const channelRef = useRef<any>(null);

    useEffect(() => {
        if (!localPlayerId) return;

        const channel = supabase.channel(`rps-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'choice_locked' }, ({ payload }) => {
                if (payload.playerId !== localPlayerId) {
                    setRemoteChoice(payload.choice);
                }
            })
            .on('broadcast', { event: 'start_round' }, () => {
                startRound();
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
        channelRef.current?.send({ type: 'broadcast', event: 'start_round' });
        startRound();
    };

    const startRound = () => {
        setMyChoice(null);
        setRemoteChoice(null);
        setWinner(null);
        setPhase('choosing');
    };

    const handleSelect = (choice: Choice) => {
        if (myChoice) return; // Already locked in

        setMyChoice(choice);
        channelRef.current?.send({
            type: 'broadcast',
            event: 'choice_locked',
            payload: { playerId: localPlayerId, choice }
        });
    };

    // Calculate winner when both choices are in
    useEffect(() => {
        if (myChoice && remoteChoice && phase === 'choosing') {
            setPhase('reveal');
            setTimeout(() => {
                setPhase('result');
                calculateWinner(myChoice, remoteChoice);
            }, 2000);
        }
    }, [myChoice, remoteChoice, phase]);

    const calculateWinner = (p1: string, p2: string) => {
        if (p1 === p2) {
            setWinner('tie');
        } else if (
            (p1 === 'rock' && p2 === 'scissors') ||
            (p1 === 'paper' && p2 === 'rock') ||
            (p1 === 'scissors' && p2 === 'paper')
        ) {
            setWinner(localPlayerId!);
        } else {
            setWinner('remote');
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-[hsl(var(--neon-purple))] uppercase">Piedra Papel Tijera</div>
                <div className="w-20"></div>
            </div>

            {/* Waiting Phase */}
            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4">Esperando rival...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-emerald-400">Rival Listo</h2>
                            <Button size="lg" className="h-16 px-12 text-2xl animate-bounce bg-purple-600 hover:bg-purple-500" onClick={handleStartSync}>
                                EMPEZAR DUELO
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Playing Area */}
            {phase !== 'waiting_sync' && (
                <div className="flex-1 flex flex-col relative">

                    {/* Top Half: Remote Player */}
                    <div className="flex-1 border-b border-white/10 bg-gradient-to-b from-black/50 to-transparent flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-4 left-4 bg-black/40 px-3 py-1 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest border border-red-500/20">
                            Rival
                        </div>

                        <AnimatePresence mode="wait">
                            {phase === 'choosing' && !remoteChoice && (
                                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/20 text-6xl animate-pulse">
                                    💭
                                </motion.div>
                            )}
                            {phase === 'choosing' && remoteChoice && (
                                <motion.div key="ready" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-6xl">
                                    ✅
                                </motion.div>
                            )}
                            {(phase === 'reveal' || phase === 'result') && remoteChoice && (
                                <motion.div
                                    key="reveal"
                                    initial={{ y: -50, opacity: 0, rotateX: 180 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    className="text-8xl md:text-[150px] drop-shadow-2xl"
                                >
                                    {CHOICES.find(c => c.id === remoteChoice)?.emoji}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Middle Division / vs */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <span className="text-xl font-black italic text-white/50">VS</span>
                        </div>
                    </div>

                    {/* Bottom Half: Local Player */}
                    <div className="flex-1 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-center justify-center relative overflow-hidden pt-8 pb-4">
                        <div className="absolute bottom-4 right-4 bg-black/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                            Tú
                        </div>

                        {phase === 'choosing' ? (
                            <div className="w-full max-w-md px-4 grid grid-cols-3 gap-4">
                                {CHOICES.map(c => (
                                    <motion.button
                                        key={c.id}
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => handleSelect(c.id as Choice)}
                                        disabled={!!myChoice}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-3xl transition-all ${myChoice === c.id ? `ring-4 ring-emerald-400 bg-white/20 scale-110` : myChoice ? 'opacity-20 blur-sm' : `${c.color} bg-opacity-20 hover:bg-opacity-40 border border-white/10 shadow-xl`}`}
                                    >
                                        <span className="text-5xl md:text-6xl drop-shadow-lg">{c.emoji}</span>
                                        <span className="font-bold text-xs uppercase tracking-widest">{c.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence>
                                {myChoice && (
                                    <motion.div
                                        initial={{ y: 50, opacity: 0, rotateX: -180 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        transition={{ type: 'spring', bounce: 0.5 }}
                                        className="text-8xl md:text-[150px] drop-shadow-2xl"
                                    >
                                        {CHOICES.find(c => c.id === myChoice)?.emoji}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            )}

            {/* Result Overlay */}
            {phase === 'result' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
                >
                    <div className="bg-slate-900 border border-white/20 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full mx-4">
                        <div className="text-6xl mb-4">
                            {winner === localPlayerId ? '🎉' : winner === 'tie' ? '😐' : '💀'}
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                            {winner === localPlayerId ? '¡HAS GANADO!' : winner === 'tie' ? 'EMPATE' : 'HAS PERDIDO'}
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            {CHOICES.find(c => c.id === myChoice)?.name} {winner === localPlayerId ? 'vence a' : winner === 'tie' ? 'iguala a' : 'cae ante'} {CHOICES.find(c => c.id === remoteChoice)?.name}
                        </p>
                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-white text-black hover:bg-gray-200" onClick={handleStartSync}>
                            Revancha
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
