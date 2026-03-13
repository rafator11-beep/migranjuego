import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { compressImageToDataUrl } from '@/utils/imageCompression';
import { User, Mail, Lock, Camera, Loader2 } from 'lucide-react';

export function WelcomeScreen() {
  const { signIn, signUp, isLoading, setAuthOverlayOpen } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file, 200, 0.8);
      setAvatarPreview(dataUrl);
    } catch {
      toast.error('Error al procesar la imagen');
    }
  };

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || isLoading || cooldown > 0) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('¡Bienvenido de nuevo!');
      } else {
        await signUp(email, password, username || 'Jugador', avatarPreview || undefined);
        toast.success('¡Cuenta creada! Bienvenido.');
      }
      setAuthOverlayOpen(false);
    } catch (err: any) {
      const msg: string = err?.message || '';
      // 429 = rate limit
      if (msg.includes('429') || msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('too many') || err?.status === 429) {
        const wait = 60;
        setCooldown(wait);
        setErrorMsg(`Demasiados intentos. Espera ${wait}s o juega como invitado.`);
        toast.error('Límite de intentos alcanzado. Espera un momento.');
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        setErrorMsg('Este correo ya está registrado. Prueba a iniciar sesión.');
        setIsLogin(true);
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('agotado')) {
        setErrorMsg('Sin conexión. Puedes jugar como invitado sin cuenta.');
      } else {
        setErrorMsg(msg || 'Error de autenticación. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isLoading;

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-500/15 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.12]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-2 tracking-tight">
            Fiesta Party
          </h1>
          <p className="text-white/60 text-sm">Juega con amigos y gana recompensas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20 ring-4 ring-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
                {username ? username[0].toUpperCase() : <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>

            {!isLogin && (
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-1.5 rounded-full flex items-center gap-2 transition-all text-sm border border-white/10">
                <Camera className="w-3.5 h-3.5" />
                <span>Subir foto</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wider font-bold">Correo</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/[0.06] border-white/[0.12] text-white placeholder-white/40 rounded-xl h-11 focus:border-purple-500/50 focus:ring-purple-500/20"
                  placeholder="tu@correo.com"
                  required
                  disabled={busy}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white/60 text-xs uppercase tracking-wider font-bold">Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/[0.06] border-white/[0.12] text-white placeholder-white/40 rounded-xl h-11 focus:border-purple-500/50 focus:ring-purple-500/20"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={busy}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="username" className="text-white/60 text-xs uppercase tracking-wider font-bold">Nombre de usuario</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/[0.06] border-white/[0.12] text-white placeholder-white/40 rounded-xl h-11 focus:border-purple-500/50 focus:ring-purple-500/20"
                    placeholder="Tu nombre"
                    required
                    disabled={busy}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-200 text-center">
              {errorMsg}
              {cooldown > 0 && (
                <div className="mt-1 font-bold text-red-300">
                  Reintenta en {cooldown}s
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_8px_30px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy || cooldown > 0}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </span>
            ) : cooldown > 0 ? (
              `Espera ${cooldown}s...`
            ) : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setUsername('');
                setAvatarPreview(null);
              }}
              className="text-white/50 hover:text-white/80 transition-colors text-sm"
              disabled={busy}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>

        {/* Guest - more prominent */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] text-center space-y-3">
          <p className="text-white/40 text-xs">O continúa sin cuenta (sin límites)</p>
          <button
            onClick={() => {
              if (username) localStorage.setItem('fiesta_player_name', username);
              setAuthOverlayOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] hover:border-purple-500/40 text-white/80 hover:text-white font-bold text-sm transition-all"
          >
            🎮 Jugar como invitado →
          </button>
        </div>
      </div>
    </div>
  );
}
