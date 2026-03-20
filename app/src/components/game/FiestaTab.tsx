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

            {/* Menu Grid - Redesigned chips */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto relative z-10 mb-8">
                {fiestaModes.map((mode, index) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => onSelectMode(mode.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-6 py-3 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center gap-1 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 shadow-lg group overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-primary transition-colors">{mode.name}</span>
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{mode.icon}</span>
                        
                        {mode.badge && (
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white ring-2 ring-slate-900">
                                    !
                                </span>
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
