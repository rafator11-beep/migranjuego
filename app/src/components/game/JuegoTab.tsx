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

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10 mb-8">
                {juegoModes.map((mode, index) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => onSelectMode(mode.id, playMode)}
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
                                        <Crown className="w-3 h-3 text-yellow-300" />
                                        {mode.badge}
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
