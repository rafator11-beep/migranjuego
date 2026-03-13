import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { RarityBadge } from '@/components/game/RarityBadge';

interface CardDisplayProps {
    content: string;
    type?: 'common' | 'rare' | 'legendary' | 'chaos' | 'virus';
    onClick: () => void;
    gameMode: string;
    players?: any[];
    round?: number; // Added to calculate drink multipliers
}

export function sanitizeCardText(text: string): string {
    if (!text) return '';
    let clean = text;
    // Remove variations of "es", "norma", "norma", etc from the beginning
    clean = clean.replace(/^(es\s*:?\s*)+/i, '');
    clean = clean.replace(/^(norma\s*,?\s*:?\s*)+/i, '');
    clean = clean.replace(/^(es\s*norma\s*,?\s*:?\s*)+/i, '');
    clean = clean.replace(/^(nueva norma\s*:?\s*)+/i, '');

    clean = clean.replace(/\s{2,}/g, ' ').trim();
    if (clean.length > 0) {
        clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    return clean;
}

// Function to multiply drinks based on round number
export function processDrinkingMultiplier(text: string, round: number = 1): React.ReactNode {
    // Determine multiplier based on round
    // Rounds 1-5: 1x, Rounds 6-12: +1 trago (min 2), Rounds 13+: +2 tragos
    let extraDrinks = 0;
    if (round >= 6 && round <= 12) extraDrinks = 1;
    if (round >= 13) extraDrinks = 2;

    if (extraDrinks === 0) {
        // Just format the drinking text to stand out
        const parts = text.split(/(🍺.*?tragos?|🍻.*?doble|🥃.*?fondo|🥂.*?grupal!)/i);
        return parts.map((part, i) => {
            if (part && part.match(/(🍺|🍻|🥃|🥂)/)) {
                return <span key={i} className="text-red-400 font-extrabold block mt-6 text-3xl sm:text-4xl animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">{part}</span>;
            }
            return part;
        });
    }

    // Multiply the numbers dynamically
    const regex = /(🍺.*?)(\d+)(\s*tragos?.*)/i;

    // We split by lines starting with emojis (which usually denote the penalty)
    const segments = text.split(/(\n🍺.*|\n🍻.*|\n🥃.*|\n🥂.*)/i);

    return segments.map((segment, i) => {
        if (!segment) return null;
        if (segment.match(/(\n🍺|\n🍻|\n🥃|\n🥂)/)) {
            // It's a penalty line. Let's try to increase the number.
            let modified = segment;
            const match = modified.match(regex);

            if (match) {
                const originalNum = parseInt(match[2], 10);
                // "Fondo" or huge penalties don't get multiplied linearly, just capped at 5
                const newNum = Math.min(originalNum + extraDrinks, 5);
                modified = `${match[1]}${newNum}${match[3]} 🔥`;
            } else if (modified.toLowerCase().includes('bebe 1 trago')) {
                modified = modified.replace(/bebe 1 trago/i, `bebe ${1 + extraDrinks} tragos 🔥`);
            } else if (modified.toLowerCase().includes('doble')) {
                modified = modified + ' ¡TRIPLE! 🔥🔥'; // Escalate double
            }

            return <span key={i} className="text-red-500 font-black block mt-6 text-3xl sm:text-4xl lg:text-5xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce">{modified.trim()}</span>;
        }
        return <span key={i}>{segment}</span>;
    });
}

export function CardDisplay({ content, type = 'common', onClick, gameMode, players, round = 1 }: CardDisplayProps) {
    const [voted, setVoted] = useState<'up' | 'down' | null>(null);

    // Reset vote when content changes
    useEffect(() => {
        setVoted(null);
    }, [content]);

    const handleVote = (e: React.MouseEvent, vote: 'up' | 'down') => {
        e.stopPropagation();
        setVoted(vote);
        // Here you would typically save to localStorage or backend
        console.log(`Voted ${vote} for: ${content}`);
    };
    // TTS Removed
    useEffect(() => {
        if (!content) return;
        window.speechSynthesis.cancel();
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [content]);

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto aspect-[3/4] cursor-pointer" onClick={onClick}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={content}
                    initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full"
                >
                    <Card className={`
            w-full h-full p-8 flex flex-col items-center justify-center text-center relative overflow-hidden
            ${type === 'legendary' ? '!border-yellow-400 !border-2 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : ''}
            ${type === 'virus' ? '!border-green-500 !border-2 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : ''}
            ${type === 'chaos' ? '!border-red-600 !border-2 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : ''}
            ${type === 'rare' ? '!border-blue-400 !border-2 shadow-[0_0_20px_rgba(96,165,250,0.5)]' : ''}
            !bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 backdrop-blur-xl !border !border-white/20 text-white
          `}>
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-6xl">
                                {gameMode === 'picante' ? '🔥' : gameMode === 'cultura' ? '🧠' : '🎲'}
                            </span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                            <RarityBadge rarity={type} />

                            {/* Sanitize text and handle NORMA duplicated text */}
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight balance-text text-white w-full">
                                {(() => {
                                    const isNormaCard = content.toUpperCase().includes('NORMA:') || content.toUpperCase().startsWith('NORMA');
                                    if (isNormaCard) {
                                        return (
                                            <div className="flex flex-col items-center gap-6">
                                                <span className="text-6xl mb-2">📜</span>
                                                <span className="text-yellow-500 text-3xl md:text-4xl font-black tracking-widest uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">¡NUEVA NORMA!</span>
                                                <span className="text-lg text-white/60 font-medium italic">(Lee la norma en la parte superior)</span>
                                            </div>
                                        );
                                    }

                                    const sanitized = sanitizeCardText(content);
                                    // Apply the dynamic drinking multiplier and render HTML
                                    return (
                                        <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight balance-text text-white w-full drop-shadow-sm">
                                            {processDrinkingMultiplier(sanitized, round)}
                                        </div>
                                    );
                                })()}
                            </h2>

                            <motion.div
                                className="mt-8 flex flex-col items-center gap-4 z-10" // Modified layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                {/* Player Voting Options (Who is most likely) */}
                                {players && players.length > 0 && (gameMode === 'votacion' || content.includes('¿Quién') || content.includes('Quién')) && (
                                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                                        {players.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={(e) => { e.stopPropagation(); console.log('Voted:', p.name); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-bold text-white shadow-lg active:scale-95"
                                            >
                                                {p.avatar_url && <img src={p.avatar_url} className="w-6 h-6 rounded-full object-cover border border-white/20" />}
                                                <span>{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-8 mt-4">
                                    <Button
                                        variant="ghost"
                                        className={`w-16 h-16 rounded-full text-white/50 hover:text-white hover:bg-white/10 border-2 border-transparent hover:border-white/20 transition-all active:scale-90 ${voted === 'up' ? 'text-green-400 bg-white/10 border-green-400/50' : ''}`}
                                        onClick={(e) => handleVote(e, 'up')}
                                    >
                                        <ThumbsUp className="w-8 h-8" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className={`w-16 h-16 rounded-full text-white/50 hover:text-white hover:bg-white/10 border-2 border-transparent hover:border-white/20 transition-all active:scale-90 ${voted === 'down' ? 'text-red-400 bg-white/10 border-red-400/50' : ''}`}
                                        onClick={(e) => handleVote(e, 'down')}
                                    >
                                        <ThumbsDown className="w-8 h-8" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-16 h-16 rounded-full text-white/50 hover:text-white hover:bg-white/10 border-2 border-transparent hover:border-white/20 transition-all active:scale-90"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: 'Fiesta App',
                                                    text: content,
                                                }).catch(() => { });
                                            }
                                        }}
                                    >
                                        <Share2 className="w-8 h-8" />
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Emergency Skip - Discreet */}
                            <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-white/20 hover:text-white hover:bg-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClick(); // Triggers next card
                                    }}
                                    title="Saltar carta (Emergencia)"
                                >
                                    <span className="text-xs">⏭️</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
