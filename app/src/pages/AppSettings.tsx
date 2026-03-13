import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Vibrate, Sparkles, Palette, Info, ChevronRight, Timer, Zap, Trophy, RotateCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from '@/types/game';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SETTINGS_KEY = 'fiesta-party-settings';

interface ExtendedSettings extends Settings {
  timerDuration: number;
  autoNextTurn: boolean;
  showHints: boolean;
  darkMode: boolean;
  reducedAnimations: boolean;
}

const defaultSettings: ExtendedSettings = {
  confettiEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  intensity: 'medium',
  timerDuration: 30,
  autoNextTurn: false,
  showHints: true,
  darkMode: true,
  reducedAnimations: false,
};

export function AppSettings() {
  const [settings, setSettings] = useState<ExtendedSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        console.error('Error parsing settings');
      }
    }
  }, []);

  const updateSetting = <K extends keyof ExtendedSettings>(key: K, value: ExtendedSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    toast.success('Ajustes restaurados');
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4">
      {/* Neon background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-pink))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-[hsl(var(--neon-blue))] opacity-10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-black neon-text text-[hsl(var(--neon-purple))] mb-2">
            ⚙️ Ajustes
          </h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia de juego
          </p>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {/* Effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 neon-border"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
              Efectos visuales
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="confetti">Confeti en aciertos</Label>
                </div>
                <Switch
                  id="confetti"
                  checked={settings.confettiEnabled}
                  onCheckedChange={(v) => updateSetting('confettiEnabled', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                  <Label htmlFor="sound">Efectos de sonido</Label>
                </div>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={(v) => updateSetting('soundEnabled', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="vibration">Vibración</Label>
                </div>
                <Switch
                  id="vibration"
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(v) => updateSetting('vibrationEnabled', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="reducedAnimations">Animaciones reducidas</Label>
                </div>
                <Switch
                  id="reducedAnimations"
                  checked={settings.reducedAnimations}
                  onCheckedChange={(v) => updateSetting('reducedAnimations', v)}
                />
              </div>
            </div>
          </motion.div>

          {/* Game settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 neon-border"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-[hsl(var(--neon-blue))]" />
              Configuración de juego
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Tiempo por pregunta</Label>
                  <span className="text-sm font-mono text-primary">{settings.timerDuration}s</span>
                </div>
                <Slider
                  value={[settings.timerDuration]}
                  onValueChange={([v]) => updateSetting('timerDuration', v)}
                  min={10}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10s</span>
                  <span>60s</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="showHints">Mostrar pistas</Label>
                </div>
                <Switch
                  id="showHints"
                  checked={settings.showHints}
                  onCheckedChange={(v) => updateSetting('showHints', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-muted-foreground" />
                  <Label htmlFor="autoNext">Turno automático</Label>
                </div>
                <Switch
                  id="autoNext"
                  checked={settings.autoNextTurn}
                  onCheckedChange={(v) => updateSetting('autoNextTurn', v)}
                />
              </div>
            </div>
          </motion.div>

          {/* Intensity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 neon-border"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[hsl(var(--neon-pink))]" />
              Intensidad de la fiesta
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Tranquila</span>
                <span>Normal</span>
                <span>¡LOCURA!</span>
              </div>
              <Slider
                value={[settings.intensity === 'low' ? 0 : settings.intensity === 'medium' ? 50 : 100]}
                onValueChange={([v]) => {
                  const intensity = v < 33 ? 'low' : v < 66 ? 'medium' : 'high';
                  updateSetting('intensity', intensity);
                }}
                max={100}
                step={50}
                className="w-full"
              />
            </div>
          </motion.div>

          {/* Reset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Button variant="outline" className="w-full" onClick={resetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar ajustes por defecto
            </Button>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 neon-border"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[hsl(var(--neon-blue))]" />
              Sobre la app
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span>Versión</span>
                <span className="text-muted-foreground">2.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Pruebas disponibles</span>
                <span className="text-primary font-bold">19.000+</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Modos de juego</span>
                <span className="text-primary font-bold">10</span>
              </div>
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg -mx-2 px-2">
                <span>Política de privacidad</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg -mx-2 px-2">
                <span>Términos y condiciones</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </motion.div>

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground py-4"
          >
            <p>Hecho con ❤️ para las mejores fiestas</p>
            <p className="text-xs mt-1">+19.000 pruebas • 10 modos de juego</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
