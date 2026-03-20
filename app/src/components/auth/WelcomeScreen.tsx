import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { compressImageToDataUrl } from '@/utils/imageCompression';
import { User, Mail, Lock, Camera, Loader2, Sparkles, ShieldCheck, Ghost, AlertCircle, ArrowLeft, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WelcomeScreen() {
  const { signIn, signUp, isLoading, setAuthOverlayOpen } = useAuth();
  const [step, setStep] = useState<'initial' | 'auth' | 'recent'>('initial');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recent Users handling
  const [recentUsers, setRecentUsers] = useState<Array<{email: string, name: string, avatar: string}>>(() => {
    try {
      return JSON.parse(localStorage.getItem('fiesta_recent_users') || '[]');
    } catch { return []; }
  });

  const saveToRecent = (email: string, name: string, avatar: string) => {
    const updated = [{email, name, avatar}, ...recentUsers.filter(u => u.email !== email)].slice(0, 3);
    setRecentUsers(updated);
    localStorage.setItem('fiesta_recent_users', JSON.stringify(updated));
  };

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
        toast.success(`¡Bienvenido de nuevo!`);
        // We'll update recent info after successful fetch if needed, 
        // but for now we use what we have in form
      } else {
        await signUp(email, password, username || 'Jugador', avatarPreview || undefined);
        toast.success('¡Cuenta creada! Bienvenido.');
      }
      
      // Save to recent for next time
      saveToRecent(email, username || email.split('@')[0], avatarPreview || '');
      localStorage.setItem('fiesta_player_name', username || 'Jugador');
      
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
    <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center p-4 overflow-y-auto font-sans">
      {/* Premium Cyber Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[440px] bg-slate-900/40 backdrop-blur-[20px] rounded-[32px] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
      >
        {/* Glow effect at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full blur-sm" />

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            CYBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PARTY</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Experiencia Premium de Juego Social</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'initial' ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">¿Estuviste aquí antes?</h2>
                <p className="text-slate-400 text-sm">Sincroniza tus monedas y rango global</p>
              </div>

              <div className="grid gap-4">
                <Button
                  onClick={() => {
                    if (recentUsers.length > 0) setStep('recent');
                    else {
                      setIsLogin(true);
                      setStep('auth');
                    }
                  }}
                  className="h-20 rounded-[2rem] bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all border-0 flex flex-col items-center justify-center gap-1 group"
                >
                  <span className="text-lg font-black tracking-widest uppercase">SÍ, HE JUGADO</span>
                  <span className="text-[10px] opacity-60 font-bold group-hover:opacity-100 transition-opacity">ACCEDER A MI PERFIL</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLogin(false);
                    setStep('auth');
                  }}
                  className="h-20 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-lg font-black tracking-widest uppercase text-white">SOY NUEVO</span>
                  <span className="text-[10px] text-slate-500 font-bold">CREAR PERFIL / INVITADO</span>
                </Button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-white/5" />
                <ShieldCheck className="w-5 h-5 text-purple-500/50" />
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <button
                onClick={() => setAuthOverlayOpen(false)}
                className="w-full h-12 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Ghost className="w-4 h-4" />
                Jugar como Invitado Anónimo
              </button>
            </motion.div>
          ) : step === 'recent' ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Selecciona tu Perfil</h2>
                <p className="text-slate-400 text-xs">Usuarios detectados en este dispositivo</p>
              </div>

              <div className="space-y-3">
                {recentUsers.map(u => (
                  <button
                    key={u.email}
                    onClick={() => {
                      setEmail(u.email);
                      setIsLogin(true);
                      setStep('auth');
                    }}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-4 text-left group"
                  >
                    <Avatar className="w-12 h-12 ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-slate-800 text-white font-black">{u.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-black text-white uppercase leading-none mb-1">{u.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold truncate">{u.email}</p>
                    </div>
                    <Lock className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
                  </button>
                ))}

                <Button
                  variant="ghost"
                  onClick={() => {
                    setEmail('');
                    setIsLogin(true);
                    setStep('auth');
                  }}
                  className="w-full h-14 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:text-white"
                >
                  Usar otra cuenta
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep('initial')}
                className="w-full text-slate-500 hover:text-white text-xs font-bold uppercase"
              >
                ← Volver
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <button type="button" onClick={() => setStep('initial')} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Configuración de Acceso</span>
                </div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col items-center gap-4 mb-2"
                    >
                      <div className="relative group">
                        <Avatar className="w-24 h-24 ring-4 ring-purple-500/20 shadow-2xl transition-transform group-hover:scale-105">
                          <AvatarImage src={avatarPreview || undefined} />
                          <AvatarFallback className="bg-slate-800 text-slate-400 text-3xl font-bold border border-white/10">
                            {username ? username[0].toUpperCase() : <User className="w-10 h-10" />}
                          </AvatarFallback>
                        </Avatar>
                        <label className="absolute bottom-0 right-0 cursor-pointer bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full shadow-lg transition-all border-2 border-slate-900">
                          <Camera className="w-4 h-4" />
                          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                      </div>
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Personaliza tu Avatar</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1">Identidad Digital (Email)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors w-4.5 h-4.5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-slate-950/50 border-white/5 text-white placeholder-slate-600 rounded-2xl h-14 focus:border-purple-500/50 focus:ring-purple-500/10 transition-all text-base"
                        placeholder="nombre@ejemplo.com"
                        required
                        disabled={busy}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1">Código de Acceso</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors w-4.5 h-4.5" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 bg-slate-950/50 border-white/5 text-white placeholder-slate-600 rounded-2xl h-14 focus:border-purple-500/50 focus:ring-purple-500/10 transition-all text-base"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoFocus
                        disabled={busy}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-1.5"
                      >
                        <Label htmlFor="username" className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1">Nombre de Operador</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors w-4.5 h-4.5" />
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-12 bg-slate-950/50 border-white/5 text-white placeholder-slate-600 rounded-2xl h-14 focus:border-purple-500/50 focus:ring-purple-500/10 transition-all text-base"
                            placeholder="Tu alias"
                            required
                            disabled={busy}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">Error de Sistema</p>
                      <p className="text-xs opacity-80">{errorMsg}</p>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-black rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_10px_30px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] border-0 disabled:opacity-50"
                    disabled={busy || cooldown > 0}
                  >
                    {busy ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>SINCRONIZANDO...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span>{isLogin ? 'ACCEDER AL NÚCLEO' : 'REGISTRAR OPERADOR'}</span>
                      </div>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrorMsg(null);
                    }}
                    className="w-full text-slate-500 hover:text-purple-400 transition-colors text-xs font-black uppercase tracking-widest"
                    disabled={busy}
                  >
                    {isLogin ? '¿Nuevo aquí? Crear Perfil' : '¿Ya tienes perfil? Identifícate'}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    localStorage.setItem('fiesta_player_name', username || 'Jugador');
                    setAuthOverlayOpen(false);
                  }}
                  className="w-full text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  Continuar sin cuenta (Modo Invitado)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
