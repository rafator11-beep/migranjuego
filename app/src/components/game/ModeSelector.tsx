import { motion } from 'framer-motion';
import { GAME_MODES, GameMode } from '@/types/game';
import { Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

// Total de preguntas por modo (actualizado con extras)
const QUESTIONS_COUNT: Record<string, number> = {
  megamix: 12000,
  clasico: 1500,
  yo_nunca: 500,
  yo_nunca_equipos: 500,
  picante: 500,
  cultura: 1400,
  espana: 500,
  votacion: 300,
  pacovers: 500,
  trivia_futbol: 900,
  futbol: 900,
};

import { getTotalContentCount } from '@/data/contentStats';

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const totalQuestions = Object.values(QUESTIONS_COUNT).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4 relative overflow-hidden">
      {/* Neon background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))] opacity-10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--neon-blue))] opacity-5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.span
            className="text-5xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight neon-text text-[hsl(var(--primary))]">
            Fiesta Party
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground">
          Elige un modo de juego para empezar
        </p>
      </motion.div>

      {/* Menu Grid - 3 columns on desktop, 2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10 mb-8">
        {GAME_MODES.map((mode, index) => (
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

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 text-muted-foreground glass-card px-6 py-3 rounded-full">
          <Sparkles className="w-4 h-4 text-[hsl(var(--neon-yellow))]" />
          <span className="text-sm md:text-base font-medium">
            +{totalQuestions.toLocaleString()} pruebas totales • {GAME_MODES.length} modos de juego
          </span>
          <Sparkles className="w-4 h-4 text-[hsl(var(--neon-yellow))]" />
        </div>
      </motion.div>
    </div>
  );
}
