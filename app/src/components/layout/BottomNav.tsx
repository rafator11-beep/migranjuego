import { Home, Users, Plus, History, Settings, MessageSquarePlus, Trophy, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: 'inicio' | 'perfiles' | 'jugar' | 'historial' | 'ajustes' | 'arcade' | 'hall';
  onTabChange: (tab: 'inicio' | 'perfiles' | 'jugar' | 'historial' | 'ajustes' | 'arcade' | 'hall') => void;
}

const tabs = [
  { id: 'inicio' as const, label: 'Inicio', icon: Home },
  { id: 'perfiles' as const, label: 'Ranking', icon: Users },
  { id: 'jugar' as const, label: 'Jugar', icon: Plus, isCenter: true },
  { id: 'historial' as const, label: 'Partidas', icon: History },
  { id: 'hall' as const, label: 'Hall', icon: Trophy },
  { id: 'arcade' as const, label: 'Arcade', icon: Gamepad2 },
  { id: 'ajustes' as const, label: 'Ajustes', icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative -mt-8"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--neon-pink))] flex items-center justify-center shadow-lg neon-box">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
              </motion.button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-lg transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-[hsl(var(--neon-purple))]")} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-[hsl(var(--neon-purple))]"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
