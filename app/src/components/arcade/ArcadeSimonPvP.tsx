import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeSimonPvPProps {
    roomId: string;
    onClose: () => void;
}

type GamePhase = 'waiting_sync' | 'countdown' | 'observing' | 'playing' | 'result';
type ColorCode = 0 | 1 | 2 | 3; // Red, Blue, Green, Yellow

const COLORS = [
    { id: 0, twClass: 'bg-red-500', activeClass: 'bg-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,1)]' },
    { id: 1, twClass: 'bg-blue-500', activeClass: 'bg-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,1)]' },
    { id: 2, twClass: 'bg-green-500', activeClass: 'bg-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,1)]' },
    { id: 3, twClass: 'bg-yellow-500', activeClass: 'bg-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,1)]' }
];

export function ArcadeSimonPvP({ roomId, onClose }: ArcadeSimonPvPProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [winner, setWinner] = useState<string | null>(null);

    const [sequence, setSequence] = useState<ColorCode[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [activeColor, setActiveColor] = useState<ColorCode | null>(null);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!localPlayerId) return;

        const channel = supabase.channel(`simon-${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ready' }, () => {
                setRemotePlayerReady(true);
            })
            .on('broadcast', { event: 'start_game' }, ({ payload }) => {
                setSequence(payload.initialSequence);
                startCountdown();
            })
            .on('broadcast', { event: 'died' }, () => {
                setWinner(localPlayerId);
                setPhase('result');
            })
            .on('broadcast', { event: 'round_cleared' }, ({ payload }) => {
                // Remote cleared their turn, and added a new color for the next round
                // Wait, in PvP Simon Says, typically they take turns doing the *same* sequence which gets longer.
                // Or both do it simultaneously. Simultaneus is easier and faster for arcade.
                // Let's do simultaneous: Both see the sequence, both input it. If you fail, you broadcast 'died'.
                // If both finish, the host broadcasts 'new_round' with the added color.
                setSequence(payload.newSequence);
                playSequence(payload.newSequence);
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
        const initialItem = Math.floor(Math.random() * 4) as ColorCode;
        channelRef.current?.send({
            type: 'broadcast',
            event: 'start_game',
            payload: { initialSequence: [initialItem] }
        });
        setSequence([initialItem]);
        startCountdown();
    };

    const startCountdown = () => {
        setWinner(null);
        setPhase('countdown');

        setTimeout(() => {
            playSequence(sequence.length ? sequence : [Math.floor(Math.random() * 4) as ColorCode]);
        }, 3000);
    };

    const playSequence = (seq: ColorCode[]) => {
        setPhase('observing');
        let index = 0;
        setActiveColor(null);

        const interval = setInterval(() => {
            if (index < seq.length) {
                // light up
                setActiveColor(seq[index]);
                if (navigator.vibrate) navigator.vibrate(50);
                setTimeout(() => {
                    setActiveColor(null);
                }, 400); // 400ms on, 200ms off between
                index++;
            } else {
                clearInterval(interval);
                setPhase('playing');
                setPlayerIndex(0);
            }
        }, 600);
    };

    const handleColorClick = (colorId: ColorCode) => {
        if (phase !== 'playing') return;

        // Light up briefly for feedback
        setActiveColor(colorId);
        setTimeout(() => setActiveColor(null), 150);
        if (navigator.vibrate) navigator.vibrate(30);

        if (colorId === sequence[playerIndex]) {
            // Correct
            const nextIndex = playerIndex + 1;
            setPlayerIndex(nextIndex);

            if (nextIndex === sequence.length) {
                // Round cleared locally
                // In a perfect 1v1, we would wait for the other player.
                // For MVP simplicity: the first person to clear the round adds the next color and broadcasts it.
                // This means the faster player dictates the pace, which is fun!
                const newSeq = [...sequence, Math.floor(Math.random() * 4) as ColorCode];
                setSequence(newSeq);

                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'round_cleared',
                    payload: { newSequence: newSeq }
                });

                playSequence(newSeq);
            }
        } else {
            // Failed
            if (navigator.vibrate) navigator.vibrate([100, 50, 200, 50, 300]);
            setWinner('remote');
            setPhase('result');
            channelRef.current?.send({
                type: 'broadcast',
                event: 'died',
                payload: { playerId: localPlayerId }
            });
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col text-white user-select-none">
            {/* Header */}
            <div className="p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/10">
                <Button variant="ghost" className="text-white/50" onClick={onClose}>Abandonar</Button>
                <div className="font-black tracking-widest text-xl text-[hsl(var(--neon-green))] uppercase">Simón PvP</div>
                <div className="w-20"></div>
            </div>

            {phase === 'waiting_sync' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    {!remotePlayerReady ? (
                        <div className="text-center animate-pulse">
                            <h2 className="text-2xl font-bold mb-4">Esperando memoria rival...</h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black mb-8 text-emerald-400">Rival Listo</h2>
                            <Button size="lg" className="h-16 px-12 text-2xl animate-bounce bg-emerald-600 hover:bg-emerald-500" onClick={handleStartSync}>
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
                        className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.8)] uppercase text-center"
                    >
                        PRESTA<br />ATENCIÓN
                    </motion.div>
                </div>
            )}

            {(phase === 'observing' || phase === 'playing') && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 py-8 w-full max-w-lg mx-auto">

                    <div className="mb-12 text-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-white/50 bg-white/10 px-4 py-1 rounded-full">
                            Ronda {sequence.length}
                        </span>
                        <h2 className={`mt-6 text-3xl font-black uppercase tracking-widest transition-colors ${phase === 'observing' ? 'text-yellow-400 animate-pulse' : 'text-emerald-400'}`}>
                            {phase === 'observing' ? 'OBSERVA...' : '¡TU TURNO! (RÁPIDO)'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full aspect-square p-4 bg-slate-900 rounded-[3rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-8 border-slate-800">
                        {COLORS.map((color) => {
                            const isActive = activeColor === color.id;
                            return (
                                <button
                                    key={color.id}
                                    disabled={phase !== 'playing'}
                                    onClick={() => handleColorClick(color.id as ColorCode)}
                                    className={`rounded-2xl w-full h-full transition-all duration-150 relative overflow-hidden group border-4 border-black/20
                                        ${isActive ? color.activeClass + ' scale-95' : color.twClass + ' opacity-50 shadow-inner'}
                                        ${phase === 'playing' ? 'hover:scale-[1.02] hover:opacity-100 active:scale-95' : 'cursor-default'}
                                    `}
                                >
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-white/10 w-full max-w-md mx-auto text-center shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            {winner === localPlayerId ? '🧠 ¡MENTE BRILLANTE! 🧠' : '💥 CORTOCIRCUITO 💥'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === localPlayerId ? `Sobreviviste hasta la ronda ${sequence.length}. ¡El rival se equivocó primero!` : `Te equivocaste en la secuencia... Puntuación: ${sequence.length - 1}`}
                        </p>

                        <Button size="lg" className="w-full h-16 text-xl rounded-2xl font-bold bg-emerald-500 text-white hover:bg-emerald-400" onClick={() => setPhase('waiting_sync')}>
                            Volver al Lobby
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
