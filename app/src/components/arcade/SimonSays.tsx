import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SimonSaysProps {
    onAddGems: (amt: number) => void;
}

const COLORS = [
    { id: 'green', code: 'bg-green-500', active: 'bg-green-300 drop-shadow-[0_0_30px_rgba(74,222,128,1)]' },
    { id: 'red', code: 'bg-red-500', active: 'bg-red-300 drop-shadow-[0_0_30px_rgba(248,113,113,1)]' },
    { id: 'yellow', code: 'bg-yellow-400', active: 'bg-yellow-200 drop-shadow-[0_0_30px_rgba(250,204,21,1)]' },
    { id: 'blue', code: 'bg-blue-500', active: 'bg-blue-300 drop-shadow-[0_0_30px_rgba(96,165,250,1)]' },
];

export function SimonSays({ onAddGems }: SimonSaysProps) {
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerStep, setPlayerStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [highScore, setHighScore] = useState(0);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = () => {
        setIsPlaying(true);
        setSequence([]);
        setPlayerStep(0);
        nextLevel([]);
    };

    const nextLevel = (currentSeq: string[]) => {
        const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)].id;
        const newSeq = [...currentSeq, nextColor];
        setSequence(newSeq);
        setPlayerStep(0);
        playSequence(newSeq);
    };

    const playSequence = async (seq: string[]) => {
        setIsShowingSequence(true);

        // Wait a brief moment before starting
        await new Promise(r => setTimeout(r, 1000));

        for (let i = 0; i < seq.length; i++) {
            setActiveColor(seq[i]);
            // The further you get, the faster it plays
            const speed = Math.max(300, 800 - (seq.length * 30));
            await new Promise(r => setTimeout(r, speed));
            setActiveColor(null);
            await new Promise(r => setTimeout(r, Math.min(200, speed / 2)));
        }

        setIsShowingSequence(false);
    };

    const handleColorClick = (colorId: string) => {
        if (!isPlaying || isShowingSequence) return;

        // Flash the button manually
        setActiveColor(colorId);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setActiveColor(null), 300);

        const expectedColor = sequence[playerStep];

        if (colorId === expectedColor) {
            // Correct!
            const nextStep = playerStep + 1;
            setPlayerStep(nextStep);

            if (nextStep === sequence.length) {
                // Advanced
                if (sequence.length > highScore) {
                    setHighScore(sequence.length);
                }

                // Win condition at 15
                if (sequence.length === 15) {
                    onAddGems(250);
                    toast.success('¡MEMORIA PERFECTA! Has ganado 250 Gemas 💎', { duration: 5000 });
                    setIsPlaying(false);
                } else {
                    // Play next level
                    setTimeout(() => nextLevel(sequence), 1000);
                }
            }
        } else {
            // Wrong!
            toast.error(`¡Error! Fallaste en el nivel ${sequence.length}.`, { duration: 3000 });
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center pt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-1 text-white drop-shadow-md">Simón Dice</h2>
                <p className="text-white/80">Llega al nivel 15 para ganar 250 Gemas.</p>
            </div>

            <div className="flex items-center justify-between w-full px-8 mb-8">
                <div className="px-6 py-2 bg-black/40 backdrop-blur rounded-2xl border border-white/10 font-bold text-white text-xl shadow-inner">
                    Nivel: {sequence.length}
                </div>
                <div className="px-6 py-2 bg-black/40 backdrop-blur rounded-2xl border border-yellow-500/20 font-bold text-yellow-400 text-sm flex flex-col items-center">
                    <span>Récord</span>
                    <span className="text-xl">{highScore}</span>
                </div>
            </div>

            <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-2xl bg-black border-4 border-gray-800 rotate-45 mb-10">
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-2 p-2 relative">
                    {/* Inner circle for nice retro aesthetics */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-900 rounded-full z-10 border-4 border-gray-800 flex items-center justify-center">
                        <span className="text-gray-600 font-bold -rotate-45 text-2xl tracking-tighter">SIMON</span>
                    </div>

                    {COLORS.map((c, i) => {
                        const isActive = activeColor === c.id;
                        let radiusClass = "";
                        if (i === 0) radiusClass = "rounded-tl-full";
                        if (i === 1) radiusClass = "rounded-tr-full";
                        if (i === 2) radiusClass = "rounded-bl-full";
                        if (i === 3) radiusClass = "rounded-br-full";

                        return (
                            <motion.div
                                key={c.id}
                                whileTap={!isShowingSequence ? { scale: 0.95 } : {}}
                                className={`w-full h-full cursor-pointer transition-all duration-150 ${radiusClass} ${isActive ? c.active + ' scale-105 z-20' : c.code + ' opacity-80'}`}
                                onPointerDown={() => handleColorClick(c.id)}
                                style={{ touchAction: 'none' }}
                            />
                        );
                    })}
                </div>
            </div>

            {!isPlaying && (
                <Button onClick={startGame} size="lg" className="w-full text-lg font-bold rounded-2xl px-12 py-6 bg-emerald-600 hover:bg-emerald-700">
                    {sequence.length > 0 ? 'REINTENTAR' : 'JUGAR'}
                </Button>
            )}
            {isPlaying && isShowingSequence && (
                <div className="text-white/60 font-bold animate-pulse text-xl">Presta atención...</div>
            )}
            {isPlaying && !isShowingSequence && (
                <div className="text-white font-bold text-xl">Tu turno</div>
            )}
        </div>
    );
}
