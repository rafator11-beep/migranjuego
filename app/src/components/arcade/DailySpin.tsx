import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DailySpinProps {
    onAddGems: (amt: number) => void;
    onAddCoins: (amt: number) => void;
}

const ITEMS = [
    { label: '5 Monedas', type: 'coins', amount: 5, color: '#f59e0b' },
    { label: '2 Gemas', type: 'gems', amount: 2, color: '#06b6d4' },
    { label: '10 Monedas', type: 'coins', amount: 10, color: '#d97706' },
    { label: 'Nada', type: 'none', amount: 0, color: '#4b5563' },
    { label: '5 Gemas', type: 'gems', amount: 5, color: '#0ea5e9' },
    { label: '20 Monedas', type: 'coins', amount: 20, color: '#eab308' },
    { label: '10 Gemas', type: 'gems', amount: 10, color: '#3b82f6' },
    { label: 'BOTE 1000 💎', type: 'gems', amount: 1000, color: '#8b5cf6' },
];

export function DailySpin({ onAddGems, onAddCoins }: DailySpinProps) {
    const [spinning, setSpinning] = useState(false);
    const [spinDeg, setSpinDeg] = useState(0);
    const [canSpin, setCanSpin] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        checkLastSpin();
        const interval = setInterval(checkLastSpin, 60000);
        return () => clearInterval(interval);
    }, []);

    const checkLastSpin = () => {
        const last = localStorage.getItem('fiesta_last_spin');
        if (!last) {
            setCanSpin(true);
            setTimeLeft('');
            return;
        }
        const lastTime = new Date(last).getTime();
        const now = new Date().getTime();
        const diff = now - lastTime;
        const day = 24 * 60 * 60 * 1000;

        if (diff > day) {
            setCanSpin(true);
            setTimeLeft('');
        } else {
            setCanSpin(false);
            const remaining = day - diff;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}h ${mins}m`);
        }
    };

    const spin = () => {
        if (!canSpin) return;
        setSpinning(true);

        // Very low probability for jackpot
        const rand = Math.random();
        let selectedIdx = 0;
        if (rand > 0.99) {
            selectedIdx = 7; // Jackpot 1000 gems
        } else {
            // Pick random except jackpot
            selectedIdx = Math.floor(Math.random() * 7);
        }

        const spins = 5; // 5 full rotations
        const sliceAngle = 360 / ITEMS.length;
        // Calculate final degree:
        // (spins * 360) + (selectedIdx * sliceAngle) + offset to put it in center
        const finalDegree = -(spins * 360 + (selectedIdx * sliceAngle));

        setSpinDeg(finalDegree);

        setTimeout(() => {
            setSpinning(false);
            const prize = ITEMS[selectedIdx];
            if (prize.type === 'coins') {
                onAddCoins(prize.amount);
                toast.success(`¡Ganaste ${prize.amount} Monedas! 🪙`);
            } else if (prize.type === 'gems') {
                onAddGems(prize.amount);
                toast.success(`¡Ganaste ${prize.amount} Gemas! 💎`);
            } else {
                toast.info("¡Ooops! No ganaste nada esta vez.");
            }
            localStorage.setItem('fiesta_last_spin', new Date().toISOString());
            checkLastSpin();
        }, 4000);
    };

    return (
        <div className="max-w-md mx-auto relative z-10 text-center flex flex-col items-center">
            <h2 className="text-3xl font-black mb-2 text-white drop-shadow-md">Ruleta Diaria</h2>
            <p className="text-white/80 mb-8">Un giro gratis cada 24 horas.</p>

            <div className="relative w-72 h-72 mb-8">
                {/* Selector pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-md z-20" />

                {/* Wheel */}
                <motion.div
                    className="w-full h-full rounded-full border-4 border-white/20 shadow-2xl relative overflow-hidden"
                    animate={{ rotate: spinDeg }}
                    transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {ITEMS.map((item, i) => {
                        const rot = i * (360 / ITEMS.length);
                        return (
                            <div
                                key={i}
                                className="absolute w-1/2 h-full right-0 origin-left"
                                style={{ transform: `rotate(${rot}deg)` }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: item.color,
                                        clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
                                        transform: `translateY(-50%)`
                                    }}
                                />
                                <span
                                    className="absolute left-10 top-1/2 -translate-y-1/2 font-bold text-white text-sm"
                                    style={{ transform: 'rotate(90deg) translateX(-10px)' }}
                                >
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full font-bold shadow-lg"
                disabled={!canSpin || spinning}
                onClick={spin}
            >
                {spinning ? 'Girando...' : canSpin ? 'GIRAR RULETA' : `Vuelve en ${timeLeft}`}
            </Button>
        </div>
    );
}
