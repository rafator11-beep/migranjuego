import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GemCatcherProps {
    onAddGems: (amt: number) => void;
}

interface FallingItem {
    id: string;
    type: 'gem' | 'bomb';
    x: number; // percentage width
    speed: number; // fall duration in seconds
}

export function GemCatcher({ onAddGems }: GemCatcherProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [items, setItems] = useState<FallingItem[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let gameInterval: NodeJS.Timeout;
        let spawnInterval: NodeJS.Timeout;

        if (isPlaying && timeLeft > 0) {
            gameInterval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

            // Spawn items progressively faster
            const spawnRate = Math.max(300, 1000 - ((30 - timeLeft) * 20));
            spawnInterval = setInterval(() => {
                const type = Math.random() > 0.75 ? 'bomb' : 'gem';
                const newItem: FallingItem = {
                    id: Math.random().toString(36).substring(7),
                    type,
                    x: Math.random() * 80 + 10, // 10% to 90%
                    speed: Math.random() * 1.5 + 1.5, // 1.5s to 3s fall
                };
                setItems(prev => [...prev, newItem]);

                // Clean up old items after they fall
                setTimeout(() => {
                    setItems(prev => prev.filter(i => i.id !== newItem.id));
                }, newItem.speed * 1000);
            }, spawnRate);

        } else if (isPlaying && timeLeft === 0) {
            endGame();
        }

        return () => {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
        };
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setItems([]);
        setIsPlaying(true);
    };

    const endGame = () => {
        setIsPlaying(false);
        setItems([]);

        // Calculate rewards
        if (score >= 50) {
            onAddGems(300);
            toast.success(`¡INCREÍBLE! ${score} puntos. Has ganado 300 Gemas 💎💎💎`, { duration: 5000 });
        } else if (score >= 30) {
            onAddGems(100);
            toast.success(`¡Muy bien! ${score} puntos. Has ganado 100 Gemas 💎`);
        } else if (score >= 10) {
            onAddGems(20);
            toast.success(`Nada mal. ${score} puntos. Aquí tienes 20 Gemas.`);
        } else {
            toast.error(`Fin del tiempo. Puntuación muy baja (${score}).`);
        }
    };

    const handleCatch = (id: string, type: 'gem' | 'bomb') => {
        if (!isPlaying) return;

        // Remove immediately so it feels responsive
        setItems(prev => prev.filter(i => i.id !== id));

        if (type === 'gem') {
            setScore(prev => prev + 1);
        } else {
            // Bomb: huge penalty
            setScore(prev => Math.max(0, prev - 5));
            // Red flash effect
            if (containerRef.current) {
                containerRef.current.classList.add('bg-red-500/50');
                setTimeout(() => {
                    containerRef.current?.classList.remove('bg-red-500/50');
                }, 200);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center pt-4 h-[70vh]">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-black mb-1 text-white drop-shadow-md">Caza-Gemas Frenético</h2>
                <p className="text-white/80 text-xs">Toca las Gemas, evita las Bombas (30s).</p>
            </div>

            <div className="flex items-center justify-between w-full px-4 mb-4 bg-black/30 backdrop-blur py-2 rounded-xl border border-white/10">
                <div className="font-mono text-xl font-bold text-white">
                    ⏱️ 00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="font-bold text-white text-xl">
                    Puntos: <span className={score >= 50 ? 'text-green-400' : 'text-blue-400'}>{score}</span>
                </div>
            </div>

            {!isPlaying && (
                <Button onClick={startGame} size="lg" className="mb-4 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/50 w-full rounded-2xl">
                    {timeLeft < 30 ? 'VOLVER A JUGAR' : 'EMPEZAR (GRATIS)'}
                </Button>
            )}

            {/* Play Area */}
            <div
                ref={containerRef}
                className="w-full flex-1 bg-black/40 backdrop-blur-md rounded-2xl relative overflow-hidden border-2 border-white/10 transition-colors duration-200"
            >
                <AnimatePresence>
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ y: -50, x: `${item.x}%`, opacity: 1, scale: 0.5 }}
                            animate={{ y: '100%', scale: 1 }}
                            exit={{ opacity: 0, scale: 2 }}
                            transition={{ duration: item.speed, ease: "linear" }}
                            onPointerDown={() => handleCatch(item.id, item.type)}
                            className="absolute top-0 w-14 h-14 flex items-center justify-center text-4xl cursor-pointer select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] active:scale-75 touch-none"
                            style={{ left: `${item.x}%` }}
                        >
                            {item.type === 'gem' ? '💎' : '💣'}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!isPlaying && items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 px-8 text-center">
                        Las gemas lloverán pronto...
                    </div>
                )}
            </div>

            <div className="w-full text-center mt-4">
                <p className="text-xs text-white/50">Recompensas: 10pts=20💎 | 30pts=100💎 | 50pts=300💎</p>
            </div>
        </div>
    );
}
