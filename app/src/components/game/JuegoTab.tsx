import { useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_MODES, GameMode, TAB_MAPPING, PlayMode } from '@/types/game';
import { Trophy, Globe, Smartphone, Crown } from 'lucide-react';

interface JuegoTabProps {
    onSelectMode: (mode: GameMode, selectedPlayMode: PlayMode) => void;
}

export function JuegoTab({ onSelectMode }: JuegoTabProps) {
    const [playMode, setPlayMode] = useState<PlayMode>('local');
    const juegoModes = GAME_MODES.filter(m => TAB_MAPPING.juego.includes(m.id));

    return (
        <div className="w-full pb-24 pt-4 px-4 relative overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 relative z-10"
            >
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-8 h-8 text-[hsl(var(--neon-yellow))] drop-shadow-md" />
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight neon-text text-[hsl(var(--primary))]">
                            Juego Competitivo
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Demuestra quién manda.
                    </p>
                </div>

                {/* Local / Online Toggle */}
                <div className="flex bg-black/40 backdrop-blur p-1 rounded-full border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => setPlayMode('local')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${playMode === 'local'
                                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]'
                                : 'text-muted-foreground hover:bg-white/5'
                            }`}
                    >
                        <Smartphone className="w-4 h-4" />
                        LOCAL
                    </button>
                    <button
                        onClick={() => setPlayMode('online')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${playMode === 'online'
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                                : 'text-muted-foreground hover:bg-white/5'
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        ONLINE
                    </button>
                </div>
            </motion.div>

            {/* Menu Grid - Redesigned chips */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto relative z-10 mb-8">
                {juegoModes.map((mode, index) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => onSelectMode(mode.id, playMode)}
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
