import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeRussianRouletteProps {
    roomId: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'playing' | 'result';

export function ArcadeRussianRoulette({ roomId, onClose }: ArcadeRussianRouletteProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [winner, setWinner] = useState<string | null>(null);

    const [currentTurnId, setCurrentTurnId] = useState<string | null>(null);
    const [chamber, setChamber] = useState(0); // 0-5
    const [bulletIndex, setBulletIndex] = useState(0); // 0-5
    const [isShooting, setIsShooting] = useState(false);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!localPlayerId) return;

        const channel = supabase.channel(`roulette-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, ({ payload }) => {
                setRemotePlayerReady(true);
                // Host initializes game if first
                if (!currentTurnId && payload.playerId !== localPlayerId) {
                    const starter = Math.random() > 0.5 ? localPlayerId : payload.playerId;
                    const bullet = Math.floor(Math.random() * 6);
                    channel.send({
                        type: 'broadcast',
                        event: 'start_game',
                        payload: { starterId: starter, bullet }
                    });
                    startGame(starter, bullet);
                }
            })
            .on('broadcast', { event: 'start_game' }, ({ payload }) => {
                if (!currentTurnId) {
                    startGame(payload.starterId, payload.bullet);
                }
            })
            .on('broadcast', { event: 'shoot' }, ({ payload }) => {
                handleRemoteShoot(payload.nextTurnId, payload.died);
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
    }, [roomId, localPlayerId, currentTurnId]);

    const startGame = (starterId: string, bullet: number) => {
        setWinner(null);
        setPhase('countdown');
        setCurrentTurnId(starterId);
        setBulletIndex(bullet);
        setChamber(0);

        setTimeout(() => {
            setPhase('playing');
        }, 3000);
    };

    const handleRemoteShoot = (nextTurnId: string, died: boolean) => {
        setIsShooting(true);
        setTimeout(() => {
            if (died) {
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
                setWinner(localPlayerId!); // Remote died, I win
                setPhase('result');
            } else {
                if (navigator.vibrate) navigator.vibrate(50);
                setChamber(prev => prev + 1);
                setCurrentTurnId(nextTurnId);
            }
            setIsShooting(false);
        }, 1000);
    };

    const handleShoot = () => {
        if (isShooting || phase !== 'playing' || currentTurnId !== localPlayerId) return;

        setIsShooting(true);

        const died = chamber === bulletIndex;

        channelRef.current?.send({
            type: 'broadcast',
            event: 'shoot',
            payload: { nextTurnId: 'remote', died } // 'remote' next logic
        });

        setTimeout(() => {
            if (died) {
                if (navigator.vibrate) navigator.vibrate(1000);
                setWinner('remote'); // I died, remote wins
                setPhase('result');
            } else {
                if (navigator.vibrate) navigator.vibrate(50);
                setChamber(prev => prev + 1);
                setCurrentTurnId('remote');
            }
            setIsShooting(false);
        }, 1000);
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none overflow-hidden">
            {/* Dark vignette effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-0"></div>

            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-red-900/50">
                <Button variant="ghost" className="text-white/50 hover:text-red-400" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-red-600 uppercase">Ruleta Rusa</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4 text-red-400">Esperando víctima...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-red-600">Alguien se ha sentado a la mesa.</h2>
                            <p className="text-muted-foreground mb-8">El primero en entrar gira el tambor (Host).</p>
                        </div>
                    )}
                </div>
            )}

            {phase === 'countdown' && (
                <div className="flex-1 flex items-center justify-center relative z-10 text-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, times: [0, 0.5, 1] }}
                        className="text-6xl font-black text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)] uppercase"
                    >
                        GIRANDO EL<br />TAMBOR...
                    </motion.div>
                </div>
            )}

            {phase === 'playing' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 py-8 w-full max-w-2xl mx-auto relative z-10">

                    {/* Turn Indicator */}
                    <div className="absolute top-10 flex flex-col items-center gap-2">
                        <div className={`px-8 py-3 rounded-full border-2 backdrop-blur-md transition-colors ${currentTurnId === localPlayerId ? 'bg-red-900/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-black/50 border-white/20'}`}>
                            <span className={`text-lg font-black uppercase tracking-widest ${currentTurnId === localPlayerId ? 'text-white' : 'text-white/50'}`}>
                                {currentTurnId === localPlayerId ? 'TU TURNO. DISPARA.' : 'TURNO DEL RIVAL...'}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-red-500/50 uppercase tracking-widest mt-2 bg-black/40 px-3 py-1 rounded-full">Recámara {chamber + 1} de 6</span>
                    </div>

                    {/* Revolver Animation Area */}
                    <div className="flex-1 flex items-center justify-center w-full my-8">
                        <motion.div
                            animate={{
                                scale: isShooting ? [1, 0.95, 1] : 1,
                                rotate: isShooting ? [0, -5, 5, 0] : 0
                            }}
                            transition={{ duration: 0.2 }}
                            className="relative flex items-center justify-center"
                        >
                            <div className="w-64 h-64 rounded-full border-4 border-slate-800 bg-slate-900 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative">
                                {/* Cylinder chambers */}
                                {Array.from({ length: 6 }).map((_, i) => {
                                    const angle = (i * 60) * (Math.PI / 180);
                                    const radius = 80;
                                    const top = 128 - 24 + radius * Math.sin(angle);
                                    const left = 128 - 24 + radius * Math.cos(angle);

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute w-12 h-12 rounded-full border-2 border-black bg-black ${i === chamber ? 'shadow-[inset_0_0_20px_rgba(255,0,0,0.2)]' : 'shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'}`}
                                            style={{ top: `${top}px`, left: `${left}px` }}
                                        />
                                    );
                                })}

                                {/* Center pin */}
                                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center shadow-lg">
                                    <div className="w-8 h-8 rounded-full bg-black"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action */}
                    <motion.div
                        className="w-full px-4 mb-4 mt-auto"
                        animate={{ opacity: currentTurnId === localPlayerId && !isShooting ? 1 : 0.5 }}
                    >
                        <Button
                            size="lg"
                            disabled={isShooting || currentTurnId !== localPlayerId}
                            onClick={handleShoot}
                            className="w-full h-24 rounded-3xl bg-red-700 hover:bg-red-600 text-white font-black text-3xl border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                        >
                            {isShooting ? '...' : 'APRETAR GATILLO'}
                        </Button>
                    </motion.div>
                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                    {/* Flashbang effect if I died */}
                    {winner === 'remote' && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 2 }}
                            className="absolute inset-0 bg-red-600 z-50 pointer-events-none mix-blend-color-burn"
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-red-900 w-full max-w-md mx-auto text-center shadow-[0_0_50px_rgba(220,38,38,0.3)] z-40"
                    >
                        <h2 className={`text-5xl font-black mb-2 drop-shadow-md ${winner === localPlayerId ? 'text-emerald-500' : 'text-red-600'}`}>
                            {winner === localPlayerId ? 'SOBREVIVISTE' : '💀 BANG 💀'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === localPlayerId ? 'El rival encontró la bala en la recámara ' + (chamber + 1) + '.' : 'Era la recámara ' + (chamber + 1) + '... Fin del juego.'}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-white text-black hover:bg-gray-200 transition-all" onClick={() => setPhase('waiting_sync')}>
                            Huir
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
