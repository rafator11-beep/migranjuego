import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Diamond, Target, Gamepad2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRanking } from '@/hooks/useRanking';
import { useGameContext } from '@/contexts/GameContext';
import { addGemsToPlayer, loadLocalRankings, saveLocalRankings } from '@/utils/localRanking';
import { DailySpin } from './DailySpin';
import { SlotMachine } from './SlotMachine';
import { MemoryMatch } from './MemoryMatch';
import { GemCatcher } from './GemCatcher';
import { SimonSays } from './SimonSays';
import { ArcadeOnlineHub } from './ArcadeOnlineHub';
import noise from '@/assets/noise.svg';

type ArcadeGame = 'menu' | 'spin' | 'slots' | 'memory' | 'catcher' | 'simon' | 'online';

export function ArcadeTab() {
    const [activeGame, setActiveGame] = useState<ArcadeGame>('menu');
    const { rankings, fetchRankings } = useRanking();
    const { localPlayerId } = useGameContext();

    const handleReturnToMenu = () => {
        setActiveGame('menu');
    };

    const localRank = rankings.find((r: any) => r.id === localPlayerId);
    const currentCoins = localRank?.coins || 0;
    const currentGems = localRank?.gems || 0;

    const handleAddCoins = (amount: number) => {
        if (!localPlayerId) return;
        const all = loadLocalRankings();
        const idx = all.findIndex((r: any) => r.id === localPlayerId);
        if (idx >= 0) {
            all[idx].coins = (all[idx].coins || 0) + amount;
            saveLocalRankings(all);
            fetchRankings();
        }
    };

    const handleAddGems = (amount: number) => {
        if (!localPlayerId) return;
        addGemsToPlayer(localPlayerId, amount);
        fetchRankings();
    };

    if (activeGame !== 'menu') {
        return (
            <div className="min-h-screen bg-background bg-grid-pattern pt-4 px-4 pb-24 relative overflow-hidden">
                <Button variant="outline" className="mb-4 relative z-10" onClick={handleReturnToMenu}>
                    Volver al Arcade
                </Button>
                {activeGame === 'spin' && <DailySpin onAddGems={handleAddGems} onAddCoins={handleAddCoins} />}
                {activeGame === 'slots' && <SlotMachine currentCoins={currentCoins} onAddGems={handleAddGems} onSpendCoins={(amt) => handleAddCoins(-amt)} />}
                {activeGame === 'memory' && <MemoryMatch onAddGems={handleAddGems} />}
                {activeGame === 'catcher' && <GemCatcher onAddGems={handleAddGems} />}
                {activeGame === 'simon' && <SimonSays onAddGems={handleAddGems} />}
                {activeGame === 'online' && <ArcadeOnlineHub onReturn={handleReturnToMenu} />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4 relative overflow-hidden">
            {/* Background Magic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-blue))] opacity-10 rounded-full blur-[100px]" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 relative z-10"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-4xl md:text-5xl drop-shadow-lg">🕹️</span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                            Arcade
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground/90">
                        Juega minijuegos y gana <span className="text-[hsl(var(--neon-blue))] font-bold">Gemas</span>
                    </p>
                </motion.div>

                {/* Currency Display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-3 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                        <Coins className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span className="text-xl font-bold text-yellow-500">{currentCoins}</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-3 border border-[hsl(var(--neon-blue))]/30 shadow-[0_0_15px_hsla(var(--neon-blue),0.15)]">
                        <Diamond className="w-6 h-6 text-[hsl(var(--neon-blue))] drop-shadow-[0_0_8px_hsla(var(--neon-blue),0.5)]" />
                        <span className="text-xl font-bold text-[hsl(var(--neon-blue))]">{currentGems}</span>
                    </div>
                </motion.div>

                {/* 1v1 Online Feature Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div
                        onClick={() => setActiveGame('online')}
                        className="relative group cursor-pointer overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-[0_0_40px_rgba(236,72,153,0.3)] border border-pink-500/50 flex flex-col items-center text-center"
                    >
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('${noise}')` }}></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full group-hover:bg-white/30 transition-all duration-700"></div>

                        <Target className="w-16 h-16 text-white mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-md tracking-tight uppercase">
                            Duelos 1v1 Online
                        </h2>
                        <p className="text-white/90 text-lg max-w-lg mb-6 drop-shadow-sm font-medium">
                            Conéctate y desafía a otros jugadores a minijuegos rápidos y frenéticos en tiempo real.
                        </p>

                        <Button size="lg" className="rounded-full h-14 px-8 bg-white text-purple-700 hover:bg-gray-100 font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform">
                            Entrar al Lobby
                        </Button>
                    </div>
                </motion.div>

                {/* Minigames Grid */}
                <h3 className="text-xl font-bold text-white/80 mb-4 px-2 tracking-wide uppercase">Minijuegos en Solitario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GameCard
                        title="Ruleta Diaria"
                        desc="Gira y gana premios cada 24h"
                        emoji="🎰"
                        color="from-pink-500 to-rose-600"
                        onClick={() => setActiveGame('spin')}
                    />
                    <GameCard
                        title="Tragaperras"
                        desc="Apuesta monedas y busca ganar diamantes"
                        emoji="🍒"
                        color="from-yellow-500 to-orange-600"
                        onClick={() => setActiveGame('slots')}
                    />
                    <GameCard
                        title="Memoria Extrema"
                        desc="Encuentra las parejas en un reto brutal 8x8"
                        emoji="🧠"
                        color="from-indigo-500 to-purple-600"
                        onClick={() => setActiveGame('memory')}
                    />
                    <GameCard
                        title="Caza-Gemas"
                        desc="Frenético desafío contrarreloj"
                        emoji="💎"
                        color="from-[hsl(var(--neon-blue))] to-cyan-600"
                        onClick={() => setActiveGame('catcher')}
                    />
                    <GameCard
                        title="Simón Dice"
                        desc="Repite secuencias interminables"
                        emoji="🚦"
                        color="from-emerald-500 to-teal-600"
                        onClick={() => setActiveGame('simon')}
                    />
                </div>
            </div>
        </div>
    );
}

function GameCard({ title, desc, emoji, color, onClick }: { title: string, desc: string, emoji: string, color: string, onClick: () => void }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative group cursor-pointer overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${color} shadow-lg`}
        >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />

            <div className="relative z-10">
                <span className="text-4xl block mb-3 drop-shadow-sm">{emoji}</span>
                <h3 className="text-xl font-bold text-white mb-2 shadow-black/50 drop-shadow-md">{title}</h3>
                <p className="text-white/80 text-sm leading-tight mb-4">{desc}</p>

                <div className="flex items-center gap-1 text-white/90 text-sm font-bold bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Play fill="currentColor" className="w-4 h-4" /> Jugar
                </div>
            </div>
        </motion.div>
    );
}
