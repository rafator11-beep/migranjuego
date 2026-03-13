import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MemoryMatchProps {
    onAddGems: (amt: number) => void;
}

// 8x8 = 64 cards = 32 pairs
const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦍',
    '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌'];

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export function MemoryMatch({ onAddGems }: MemoryMatchProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIds, setFlippedIds] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isPlaying && timeLeft === 0) {
            setIsPlaying(false);
            toast.error('¡Tiempo agotado! Has perdido.');
        }
        return () => clearTimeout(timer);
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        // Requires exactly 32 unique emojis to make 64 cards.
        const deck = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));

        setCards(deck);
        setFlippedIds([]);
        setMatches(0);
        setTimeLeft(60);
        setIsPlaying(true);
    };

    const handleCardClick = (id: number) => {
        if (!isPlaying) return;
        if (flippedIds.length === 2) return;

        const clickedCard = cards.find(c => c.id === id);
        if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
        setCards(newCards);

        const newFlipped = [...flippedIds, id];
        setFlippedIds(newFlipped);

        if (newFlipped.length === 2) {
            const card1 = newCards.find(c => c.id === newFlipped[0]);
            const card2 = newCards.find(c => c.id === newFlipped[1]);

            if (card1 && card2 && card1.emoji === card2.emoji) {
                // Match!
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c
                    ));
                    setFlippedIds([]);
                    const newMatchCount = matches + 1;
                    setMatches(newMatchCount);
                    if (newMatchCount === 32) { // Won!
                        setIsPlaying(false);
                        onAddGems(500);
                        toast.success('¡IMPRESIONANTE! Has resuelto la Memoria Extrema. 500 Gemas para ti.');
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.id === card1?.id || c.id === card2?.id) ? { ...c, isFlipped: false } : c
                    ));
                    setFlippedIds([]);
                }, 800);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
            <div className="text-center mb-4 pt-2">
                <h2 className="text-2xl md:text-3xl font-black mb-1 text-white drop-shadow-md">Memoria Extrema</h2>
                <p className="text-white/80 text-sm">Encuentra las 32 parejas en 60s. Premio: 500 💎</p>
            </div>

            <div className="flex items-center justify-between w-full px-4 mb-4 bg-black/30 backdrop-blur py-2 rounded-xl border border-white/10">
                <div className="font-mono text-xl font-bold text-white">
                    ⏱️ 00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="font-bold text-white">
                    🎯 {matches}/32
                </div>
            </div>

            {!isPlaying && matches !== 32 && (
                <Button onClick={startGame} size="lg" className="mb-4 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/50">
                    {timeLeft < 60 && timeLeft > 0 ? 'REINTENTAR' : 'EMPEZAR (GRATIS)'}
                </Button>
            )}

            {/* 8x8 Grid */}
            <div className="grid grid-cols-8 gap-1 w-[95vw] max-w-[500px] aspect-square bg-black/40 p-2 rounded-xl backdrop-blur-md shadow-2xl">
                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`cursor-pointer rounded-md flex items-center justify-center text-lg md:text-2xl 
              ${card.isFlipped || card.isMatched ? 'bg-white shadow-inner' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 hover:brightness-110'}
              ${card.isMatched ? 'opacity-40' : ''}
            `}
                        whileTap={{ scale: 0.9 }}
                        initial={false}
                        animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <span style={{ opacity: card.isFlipped || card.isMatched ? 1 : 0, transform: 'scaleX(-1)' }}>
                            {card.emoji}
                        </span>
                    </motion.div>
                ))}
                {cards.length === 0 && (
                    <div className="col-span-8 h-full flex items-center justify-center text-white/50 text-sm">
                        Toca Empezar para repartir las cartas...
                    </div>
                )}
            </div>
        </div>
    );
}
