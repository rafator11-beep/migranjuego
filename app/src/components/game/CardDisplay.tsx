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

    // Dynamic Color Palette Mapping
    const getModeStyles = () => {
        switch (gameMode) {
            case 'megamix':
                return {
                    border: 'border-purple-500/50',
                    glow: 'bg-purple-500',
                    gradient: 'from-purple-600/20 to-pink-600/20',
                    icon: '🔮'
                };
            case 'clasico':
                return {
                    border: 'border-emerald-500/50',
                    glow: 'bg-emerald-500',
                    gradient: 'from-emerald-600/20 to-lime-600/20',
                    icon: '🎲'
                };
            case 'yo_nunca':
            case 'yo_nunca_equipos':
                return {
                    border: 'border-blue-500/50',
                    glow: 'bg-blue-500',
                    gradient: 'from-blue-600/20 to-indigo-600/20',
                    icon: '🌊'
                };
            case 'picante':
                return {
                    border: 'border-magenta-500/50',
                    glow: 'bg-pink-600',
                    gradient: 'from-magenta-600/20 to-pink-600/20',
                    icon: '🔥'
                };
            case 'espana':
                return {
                    border: 'border-orange-500/50',
                    glow: 'bg-orange-500',
                    gradient: 'from-orange-600/20 to-red-600/20',
                    icon: '💃'
                };
            case 'votacion':
                return {
                    border: 'border-violet-500/50',
                    glow: 'bg-violet-500',
                    gradient: 'from-violet-600/20 to-purple-600/20',
                    icon: '🗳️'
                };
            case 'pacovers':
            case 'veteranos':
                return {
                    border: 'border-amber-500/50',
                    glow: 'bg-amber-500',
                    gradient: 'from-amber-600/20 to-yellow-600/20',
                    icon: '🏆'
                };
            case 'impostor':
            case 'mimica':
            case 'boca_cerrada':
                return {
                    border: 'border-purple-900/50',
                    glow: 'bg-purple-950',
                    gradient: 'from-black to-slate-900',
                    icon: '🕵️'
                };
            default:
                return {
                    border: 'border-white/20',
                    glow: 'bg-primary/20',
                    gradient: 'from-white/5 to-transparent',
                    icon: '🎲'
                };
        }
    };

    const styles = getModeStyles();

    // Reset vote when content changes
    useEffect(() => {
        setVoted(null);
    }, [content]);

    const handleVote = (e: React.MouseEvent, vote: 'up' | 'down') => {
        e.stopPropagation();
        setVoted(vote);
        console.log(`Voted ${vote} for: ${content}`);
    };

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
                    layout
                    initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="w-full h-full group"
                >
                    <Card className={`
            w-full h-full p-8 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-[2.5rem] transition-all duration-500
            !bg-slate-950 backdrop-blur-none !border-2 shadow-2xl
            ${type === 'legendary' ? '!border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 
              type === 'virus' ? '!border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]' :
              type === 'chaos' ? '!border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)]' :
              type === 'rare' ? '!border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.4)]' :
              `!${styles.border} shadow-xl`}
          `}>
                        {/* Glossy Dynamic Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-[0.15] group-hover:opacity-30 transition-opacity`} />
                        
                        {/* Dynamic Neon Glow */}
                        <div className={`absolute -inset-4 opacity-20 group-hover:opacity-40 transition-opacity blur-[60px] pointer-events-none
                            ${type === 'legendary' ? 'bg-yellow-400' : 
                              type === 'virus' ? 'bg-green-500' : 
                              type === 'chaos' ? 'bg-red-600' : 
                              type === 'rare' ? 'bg-blue-400' : 
                              styles.glow}
                        `} />

                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <span className="text-7xl drop-shadow-2xl">{styles.icon}</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                            <RarityBadge rarity={type} />

                            <h2 className="text-2xl md:text-3xl font-bold leading-tight balance-text text-white w-full">
                                {(() => {
                                    const isNormaCard = content.toUpperCase().includes('NORMA:') || content.toUpperCase().startsWith('NORMA');
                                    if (isNormaCard) {
                                        return (
                                            <div className="flex flex-col items-center gap-6">
                                                <span className="text-7xl mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">📜</span>
                                                <span className="text-yellow-500 text-3xl md:text-4xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">¡NUEVA NORMA!</span>
                                                <span className="text-lg text-white/70 font-black italic tracking-tight bg-white/5 px-4 py-1 rounded-full border border-white/10">(Lee arriba)</span>
                                            </div>
                                        );
                                    }

                                    const sanitized = sanitizeCardText(content) || 'Siguiente carta';
                                    return (
                                        <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter balance-text text-white w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-[1.1]">
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
