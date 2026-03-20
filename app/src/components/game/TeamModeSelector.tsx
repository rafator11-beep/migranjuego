import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamModeSelectorProps {
  modeName: string;
  modeIcon: string;
  onSelect: (isTeam: boolean) => void;
}

export function TeamModeSelector({ modeName, modeIcon, onSelect }: TeamModeSelectorProps) {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))] opacity-10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">{modeIcon}</span>
          <h1 className="text-3xl font-black neon-text text-[hsl(var(--primary))] mb-2">
            {modeName}
          </h1>
          <p className="text-muted-foreground">
            ¿Cómo quieres jugar?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(false)}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Individual (1vs1)</h3>
                <p className="text-sm opacity-80">Cada jugador compite por sí mismo</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(true)}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Por Equipos</h3>
                <p className="text-sm opacity-80">Crea equipos y compite en equipo</p>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
