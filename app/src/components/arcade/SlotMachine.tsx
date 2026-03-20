import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SlotMachineProps {
    currentCoins: number;
    onAddGems: (amt: number) => void;
    onSpendCoins: (amt: number) => void;
}

const SYMBOLS = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '7️⃣'];
const COST = 100;

export function SlotMachine({ currentCoins, onAddGems, onSpendCoins }: SlotMachineProps) {
    const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
    const [spinning, setSpinning] = useState(false);

    const spin = () => {
        if (currentCoins < COST) {
            toast.error('No tienes suficientes monedas. Juega partidas para ganar más.');
            return;
        }

        // Deduct coins
        onSpendCoins(COST);
        setSpinning(true);

        // Initial shuffling effect
        let spins = 0;
        const interval = setInterval(() => {
            setReels([
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            ]);
            spins++;
            if (spins > 15) {
                clearInterval(interval);
                finishSpin();
            }
        }, 100);
    };

    const finishSpin = () => {
        // Determine outcome with weighted probabilities
        const rand = Math.random();
        let r1, r2, r3;

        if (rand > 0.98) {
            // 2% chance for Jackpot
            r1 = '💎'; r2 = '💎'; r3 = '💎';
        } else if (rand > 0.85) {
            // 13% chance for 3 of a kind
            const sym = SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1))]; // Exclude diamonds
            r1 = sym; r2 = sym; r3 = sym;
        } else if (rand > 0.50) {
            // 35% chance for 2 of a kind
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const diff = SYMBOLS.filter(s => s !== sym)[Math.floor(Math.random() * (SYMBOLS.length - 1))];
            // Randomize position of the odd one out
            const pos = Math.floor(Math.random() * 3);
            r1 = pos === 0 ? diff : sym;
            r2 = pos === 1 ? diff : sym;
            r3 = pos === 2 ? diff : sym;
        } else {
            // 50% chance for total loss
            r1 = SYMBOLS[0];
            r2 = SYMBOLS[1];
            r3 = SYMBOLS[2];
            // Just shuffle 3 different
            const shuffled = [...SYMBOLS].sort(() => Math.random() - 0.5);
            r1 = shuffled[0];
            r2 = shuffled[1];
            r3 = shuffled[2];
        }

        setReels([r1, r2, r3]);
        setSpinning(false);
        evaluatePrize(r1, r2, r3);
    };

    const evaluatePrize = (r1: string, r2: string, r3: string) => {
        if (r1 === r2 && r2 === r3) {
            if (r1 === '💎') {
                onAddGems(500);
                toast.success('¡JACKPOT! 💎💎💎 ¡Has ganado 500 Gemas!', { duration: 5000 });
            } else {
                onAddGems(50);
                toast.success(`¡TRIPLE! ${r1}${r2}${r3} ¡Has ganado 50 Gemas!`);
            }
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            onAddGems(10);
            toast.success('¡PAREJA! ¡Has ganado 10 Gemas!');
        } else {
            toast.info('¡Lástima! Sigue intentándolo.');
        }
    };

    return (
        <div className="max-w-md mx-auto relative z-10 text-center flex flex-col items-center pt-8">
            <h2 className="text-3xl font-black mb-2 text-white drop-shadow-md">Tragaperras</h2>
            <p className="text-white/80 mb-8">Tira de la palanca por 100 🪙</p>

            <div className="bg-yellow-600 p-4 rounded-3xl border-8 border-yellow-800 shadow-2xl mb-8 relative">
                <div className="absolute -right-8 top-12 w-6 h-24 bg-gray-400 rounded-r-lg border-2 border-l-0 border-gray-600" />
                <motion.div
                    className="absolute -right-12 top-10 w-8 h-8 rounded-full bg-red-500 shadow-lg border-2 border-red-700 cursor-pointer"
                    whileTap={{ y: 40 }}
                    onClick={!spinning ? spin : undefined}
                />

                <div className="flex gap-2 bg-black p-4 rounded-xl inner-shadow">
                    {reels.map((symbol, i) => (
                        <div key={i} className="w-20 h-24 bg-white rounded-lg flex items-center justify-center text-5xl shadow-inner border border-gray-300">
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={symbol + (spinning ? Math.random() : '')}
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    {symbol}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-black/30 backdrop-blur rounded-xl p-3 border border-white/10 text-left">
                    <p className="text-xs text-white/60 mb-1">Premios</p>
                    <p className="text-sm font-bold text-white">💎💎💎 = 500 Gemas</p>
                    <p className="text-sm font-bold text-white">🍒🍒🍒 = 50 Gemas</p>
                    <p className="text-sm font-bold text-white">🍒🍒❌ = 10 Gemas</p>
                </div>
            </div>

            <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full font-bold shadow-lg w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={spinning || currentCoins < COST}
                onClick={spin}
            >
                {spinning ? 'GIRANDO...' : `JUGAR (100 🪙)`}
            </Button>
        </div>
    );
}
