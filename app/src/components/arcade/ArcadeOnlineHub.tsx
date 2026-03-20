import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Target, Info, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/contexts/GameContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArcadeQuickDraw } from './ArcadeQuickDraw';
import { ArcadeTapRace } from './ArcadeTapRace';
import { ArcadeRPS } from './ArcadeRPS';
import { ArcadeTicTacToe } from './ArcadeTicTacToe';
import { ArcadeMathMatch } from './ArcadeMathMatch';
import { ArcadeHighLow } from './ArcadeHighLow';
import { ArcadeCoinFlip } from './ArcadeCoinFlip';
import { ArcadeRussianRoulette } from './ArcadeRussianRoulette';
import { ArcadeSimonPvP } from './ArcadeSimonPvP';
import { ArcadeMinesweeper } from './ArcadeMinesweeper';

interface ArcadeOnlineHubProps {
    onReturn: () => void;
}

// 10 Minigames requested
const ONLINE_GAMES = [
    { id: 'quick_draw', name: 'Reflejos (Quick Draw)', icon: '⚡', desc: 'El primero en tocar cuando salga el verde, gana.' },
    { id: 'tap_race', name: 'Carrera de Clics', icon: '🏃', desc: 'Macha-botones de 10 segundos.' },
    { id: 'rps', name: 'Piedra, Papel, Tijera', icon: '✂️', desc: 'Duelo mental 1v1 clásico.' },
    { id: 'tictactoe_speed', name: '3 en Raya (Turbo)', icon: '❌', desc: '3 segundos por turno máximo.' },
    { id: 'math_match', name: 'Duelo Matemático', icon: '🧮', desc: 'Resuelve 5 operaciones antes que tu rival.' },
    { id: 'high_low', name: 'Mayor o Menor', icon: '🃏', desc: 'Adivina la siguiente carta para ganar.' },
    { id: 'coin_flip', name: 'Cara o Cruz', icon: '🪙', desc: 'Aguanta la racha más larga sin fallar.' },
    { id: 'russian_roulette', name: 'Ruleta Rusa', icon: '🔫', desc: 'Turnos tensos, 1 bala, 6 recámaras.' },
    { id: 'simon_pvp', name: 'Simón Competitivo', icon: '🚦', desc: 'Falla la secuencia y pierdes al instante.' },
    { id: 'minesweeper', name: 'Campo de Minas', icon: '💣', desc: 'Turnos alternos. Si tocas una bomba, mueres.' }
];

export function ArcadeOnlineHub({ onReturn }: ArcadeOnlineHubProps) {
    const { localPlayerId, players } = useGameContext();
    const localPlayer = players.find(p => p.id === localPlayerId) || players[0]; // fallback to first if test

    const [view, setView] = useState<'lobby' | 'finding_match' | 'playing'>('lobby');
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [matchRoomId, setMatchRoomId] = useState<string | null>(null);
    const [myPresenceId, setMyPresenceId] = useState<string | null>(null);
    const [screencastActive, setScreencastActive] = useState(false);

    const handleScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            setScreencastActive(true);
            toast.success('¡Arcade proyectado! Disfruta en tu TV.');
            stream.getVideoTracks()[0].onended = () => {
                setScreencastActive(false);
            };
        } catch {
            toast.error('No se pudo iniciar la proyección.');
        }
    };

    // Real-time Matchmaking with Supabase Presence
    useEffect(() => {
        if (view !== 'finding_match' || !selectedGame) return;

        // Use a consistent ID for presence: actual player ID or a persistent guest ID
        const presenceId = localPlayerId || `guest_${Math.random().toString(36).substring(7)}`;
        const myName = localPlayer?.name || 'Invitado';
        setMyPresenceId(presenceId);

        const channel = supabase.channel(`matchmaking:${selectedGame}`, {
            config: {
                presence: {
                    key: presenceId,
                },
            },
        });

        // Bot timeout logic
        const botTimer = setTimeout(() => {
            setMatchRoomId(`bot_${selectedGame}_${presenceId}`);
            setView('playing');
            toast.info(`¡Modo Bot activado! Jugando contra la CPU.`);
        }, 15000);

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const entries = Object.entries(state);
                
                // Find another player who isn't me
                const opponentEntry = entries.find(([id]) => id !== presenceId);

                if (opponentEntry) {
                    const [opponentId, opponentData] = opponentEntry;
                    // We found an opponent!
                    // Both players sort IDs to ensure they generate the SAME roomId
                    const sortedIds = [presenceId, opponentId].sort();
                    const roomId = `arcade_${selectedGame}_${sortedIds[0]}_${sortedIds[1]}`;
                    
                    clearTimeout(botTimer);
                    setMatchRoomId(roomId);
                    setView('playing');
                    toast.success(`¡Rival encontrado: ${opponentData[0]?.name || 'Oponente'}!`);
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        id: presenceId,
                        name: myName,
                        joined_at: new Date().toISOString()
                    });
                }
            });

        return () => {
            clearTimeout(botTimer);
            supabase.removeChannel(channel);
        };
    }, [view, selectedGame, localPlayerId, localPlayer?.name]);

    const handleFindMatch = (gameId: string) => {
        setSelectedGame(gameId);
        setView('finding_match');
    };

    if (view === 'playing' && selectedGame) {
        // Ensure all games receive the player ID they should use
        const playerIdToUse = myPresenceId || localPlayerId || 'unknown';

        if (selectedGame === 'quick_draw' && matchRoomId) {
            return <ArcadeQuickDraw roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'tap_race' && matchRoomId) {
            return <ArcadeTapRace roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'rps' && matchRoomId) {
            return <ArcadeRPS roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'tictactoe_speed' && matchRoomId) {
            return <ArcadeTicTacToe roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'math_match' && matchRoomId) {
            return <ArcadeMathMatch roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'high_low' && matchRoomId) {
            return <ArcadeHighLow roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'coin_flip' && matchRoomId) {
            return <ArcadeCoinFlip roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'russian_roulette' && matchRoomId) {
            return <ArcadeRussianRoulette roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'simon_pvp' && matchRoomId) {
            return <ArcadeSimonPvP roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }
        if (selectedGame === 'minesweeper' && matchRoomId) {
            return <ArcadeMinesweeper roomId={matchRoomId} playerId={playerIdToUse} onClose={() => setView('lobby')} />;
        }

        // Will route to minigame components later
        return (
            <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col">
                <div className="p-4 flex items-center gap-4 bg-black/40 border-b border-white/10">
                    <Button variant="ghost" size="icon" onClick={() => setView('lobby')}>
                        <ArrowLeft />
                    </Button>
                    <span className="font-bold uppercase tracking-wider text-emerald-400">
                        Jugando: {ONLINE_GAMES.find(g => g.id === selectedGame)?.name}
                    </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <h1 className="text-3xl font-black mb-4">MINIJUEGO EN CONSTRUCCIÓN 🚧</h1>
                    <p className="max-w-md">La instancia del juego <b>{selectedGame}</b> con ID de sala <b>{matchRoomId}</b> se montará aquí.</p>
                </div>
            </div>
        );
    }

    if (view === 'finding_match') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-24 h-24 border-4 border-[hsl(var(--neon-blue))] border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-black text-white animate-pulse mb-2">Buscando rival...</h2>
                <p className="text-muted-foreground">Juego: {ONLINE_GAMES.find(g => g.id === selectedGame)?.name}</p>
                <Button variant="outline" className="mt-8 border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => setView('lobby')}>
                    Cancelar Búsqueda
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-2">

            <div className="max-w-4xl mx-auto mt-4 px-2">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-8 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-none">Lobby 1v1</h2>
                            <p className="text-sm text-purple-300 mt-1 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                {localPlayer?.name || "Jugador"} conectado
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleScreenShare}
                        className={`h-12 px-6 rounded-2xl border-white/10 font-black transition-all ${screencastActive ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    >
                        <Monitor className={`w-5 h-5 mr-3 ${screencastActive ? 'animate-pulse' : ''}`} />
                        {screencastActive ? 'EN TV' : 'PROYECTAR'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ONLINE_GAMES.map((game, i) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative overflow-hidden bg-slate-900/80 backdrop-blur-md rounded-[20px] p-1 border border-white/5 hover:border-[hsl(var(--neon-pink))]/50 transition-colors"
                        >
                            <div className="flex bg-black/40 h-full rounded-[16px] p-4 items-center gap-4 transition-transform group-hover:bg-black/20">
                                <div className="text-4xl bg-white/5 p-3 rounded-xl border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
                                    {game.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white group-hover:text-[hsl(var(--neon-pink))] transition-colors">{game.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-tight mt-0.5">{game.desc}</p>
                                </div>

                                <Button
                                    onClick={() => handleFindMatch(game.id)}
                                    size="icon"
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))] text-white shadow-[0_0_15px_hsla(var(--neon-blue),0.4)] group-hover:shadow-[0_0_25px_hsla(var(--neon-blue),0.6)] group-hover:scale-110 transition-all border-none"
                                >
                                    <Zap className="fill-current w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
