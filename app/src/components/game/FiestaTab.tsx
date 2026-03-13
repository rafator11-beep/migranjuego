import { motion } from 'framer-motion';
import { GAME_MODES, GameMode, TAB_MAPPING } from '@/types/game';
import { Sparkles } from 'lucide-react';

interface FiestaTabProps {
    onSelectMode: (mode: GameMode) => void;
}

export function FiestaTab({ onSelectMode }: FiestaTabProps) {
    const fiestaModes = GAME_MODES.filter(m => TAB_MAPPING.fiesta.includes(m.id));

    return (
        <div className="w-full pb-24 pt-4 px-4 relative overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 relative z-10"
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <motion.span
                        className="text-4xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎉
                    </motion.span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight neon-text text-[hsl(var(--primary))]">
                        Modo Fiesta
                    </h1>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                    Locura, risas y retos para cualquier fiesta
                </p>
            </motion.div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10 mb-8">
                {fiestaModes.map((mode, index) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => onSelectMode(mode.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative group p-4 md:p-5 rounded-2xl bg-gradient-to-br ${mode.color} text-white shadow-lg transition-all duration-300 overflow-hidden text-center`}
                    >
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-3xl md:text-4xl mb-2 drop-shadow-lg">{mode.icon}</span>
                            <h3 className="text-base md:text-lg font-bold mb-1 drop-shadow-md">{mode.name}</h3>
                            <p className="text-xs opacity-80 line-clamp-2 leading-tight">{mode.description}</p>

                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                {mode.badge && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                                        {mode.badge}
                                    </span>
                                )}

                                {mode.adultOnly && (
                                    <span className="inline-block px-2 py-0.5 bg-red-500/70 backdrop-blur-sm rounded-full text-xs font-bold border border-red-400/50">
                                        +18
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
