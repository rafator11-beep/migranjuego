import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArcadeSimonPvPProps {
    roomId: string;
    playerId?: string;
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

export function ArcadeSimonPvP({ roomId, playerId, onClose }: ArcadeSimonPvPProps) {
    const { localPlayerId: contextPlayerId, players } = useGameContext();
    const effectivePlayerId = playerId || contextPlayerId || 'guest';
    const localPlayer = players.find(p => p.id === effectivePlayerId) || players[0];

    const [phase, setPhase] = useState<GamePhase>('waiting_sync');
    const [remotePlayerReady, setRemotePlayerReady] = useState(false);

    const [winner, setWinner] = useState<string | null>(null);

    const [sequence, setSequence] = useState<ColorCode[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [activeColor, setActiveColor] = useState<ColorCode | null>(null);

    const channelRef = useRef<any>(null);

    // Sync network
    useEffect(() => {
        if (!effectivePlayerId) return;

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
                setWinner(effectivePlayerId);
                setPhase('result');
            })
            .on('broadcast', { event: 'round_cleared' }, ({ payload }) => {
                setSequence(payload.newSequence);
                playSequence(payload.newSequence);
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
            supabase.removeChannel(channel);
        };
    }, [roomId, effectivePlayerId]);

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

    const playSequence = async (seq: ColorCode[]) => {
        setPhase('observing');
        setPlayerIndex(0);

        for (const colorId of seq) {
            setActiveColor(colorId);
            await new Promise(r => setTimeout(r, 600));
            setActiveColor(null);
            await new Promise(r => setTimeout(r, 200));
        }

        setPhase('playing');
    };

    const handleColorClick = (colorId: ColorCode) => {
        if (phase !== 'playing') return;

        setActiveColor(colorId);
        setTimeout(() => setActiveColor(null), 300);

        if (colorId === sequence[playerIndex]) {
            const nextIdx = playerIndex + 1;
            if (nextIdx === sequence.length) {
                // Round cleared!
                const nextColor = Math.floor(Math.random() * 4) as ColorCode;
                const newSeq = [...sequence, nextColor];
                setSequence(newSeq);
                
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'round_cleared',
                    payload: { newSequence: newSeq }
                });
                
                playSequence(newSeq);
            } else {
                setPlayerIndex(nextIdx);
            }
        } else {
            // Failure
            setWinner('remote');
            setPhase('result');
            channelRef.current?.send({
                type: 'broadcast',
                event: 'died',
                payload: { playerId: effectivePlayerId }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {phase === 'waiting_sync' && (
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">SIMÓN PVP 🚦</h1>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${remotePlayerReady ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                            <span className="text-white/80 font-medium">
                                {remotePlayerReady ? 'Rival Conectado' : 'Esperando rival...'}
                            </span>
                        </div>
                        <Button size="lg" className="w-64 h-16 text-xl rounded-2xl font-bold bg-emerald-500 text-white hover:bg-emerald-400" onClick={handleStartSync} disabled={!remotePlayerReady}>
                            EMPEZAR DUELO
                        </Button>
                        <Button variant="ghost" className="text-white/40" onClick={onClose}>Cancelar</Button>
                    </div>
                </div>
            )}

            {(phase === 'playing' || phase === 'observing' || phase === 'countdown') && (
                <div className="w-full max-w-md flex flex-col items-center">
                    <div className="mb-12 text-center">
                        <h2 className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                            {phase === 'countdown' ? 'Prepárate' : phase === 'observing' ? 'Observa la secuencia' : 'Tu turno - ¡Repite!'}
                        </h2>
                        <div className="text-5xl font-black text-white">
                            RONDA {sequence.length}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full aspect-square">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                disabled={phase !== 'playing'}
                                onClick={() => handleColorClick(color.id as ColorCode)}
                                className={`
                                    w-full h-full rounded-[40px] transition-all duration-200 
                                    ${activeColor === color.id ? color.activeClass : color.twClass}
                                    ${phase === 'playing' ? 'hover:scale-[1.02] cursor-pointer active:scale-95' : 'cursor-default'}
                                    shadow-2xl border-4 border-white/5
                                `}
                            />
                        ))}
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/90 p-8 rounded-[40px] backdrop-blur-xl border border-white/10 w-full max-w-md mx-auto text-center shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            {winner === effectivePlayerId ? '🧠 ¡MENTE BRILLANTE! 🧠' : '💥 CORTOCIRCUITO 💥'}
                        </h2>
                        <p className="text-white/80 mb-8 text-lg font-medium">
                            {winner === effectivePlayerId ? `Sobreviviste hasta la ronda ${sequence.length}. ¡El rival se equivocó primero!` : `Te equivocaste en la secuencia... Puntuación: ${sequence.length - 1}`}
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
