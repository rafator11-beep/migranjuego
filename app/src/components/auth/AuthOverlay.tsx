import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, LogIn, UserPlus, Camera, Sparkles, ArrowRight, Shield, Mail, Lock, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { compressImageToDataUrl } from '@/utils/imageCompression';

const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=John',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Sofia',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Gamer',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=ProX',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=LucyQ',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool99',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=DarkKnight',
];

export function AuthOverlay() {
    const { user, signIn, signUp, isLoading, isAuthOverlayOpen, setAuthOverlayOpen } = useAuth();
    const [step, setStep] = useState<'profile' | 'auth'>('profile');
    const [playerName, setPlayerName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);

    // Auth fields (step 2)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if user already has a local profile
    const hasLocalProfile = !!localStorage.getItem('fiesta_player_name');

    // Don't show if: loading session, already logged in via Supabase, already has local profile, or overlay was dismissed
    if (isLoading || user || hasLocalProfile || !isAuthOverlayOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImageToDataUrl(file, 500, 0.70);
            setCustomAvatar(compressed);
            setAvatarUrl(compressed);
        } catch (err) {
            console.error('Error compressing image:', err);
            toast.error('Error al procesar la imagen');
        }
    };

    const handleProfileDone = () => {
        if (!playerName.trim()) {
            toast.error('Escribe un nombre para continuar');
            return;
        }
        // Save to localStorage
        localStorage.setItem('fiesta_player_name', playerName.trim());
        if (avatarUrl) {
            localStorage.setItem('fiesta_player_avatar', avatarUrl);
        }
        toast.success(`¡Bienvenido, ${playerName.trim()}!`);
        // Move to optional auth step
        setStep('auth');
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (authMode === 'login') {
                await signIn(email, password);
                toast.success('Sesión iniciada correctamente');
            } else {
                await signUp(email, password, playerName.trim(), avatarUrl);
                toast.success('¡Cuenta creada! Tu progreso se guardará online.');
            }
            setAuthOverlayOpen(false);
        } catch (err: any) {
            toast.error(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleSkipAuth = () => {
        setAuthOverlayOpen(false);
    };

    const effectiveAvatar = customAvatar || avatarUrl;

    return (
        <AnimatePresence mode="wait">
            {step === 'profile' && (
                <motion.div
                    key="profile-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex items-center justify-center p-4"
                >
                    {/* Decorative orbs */}
                    <div className="absolute top-20 left-10 w-40 h-40 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="text-center mb-6 relative z-10">
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30"
                            >
                                <Sparkles className="text-white" size={32} />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white">¡Bienvenido!</h2>
                            <p className="text-slate-400 mt-2 text-sm">Crea tu perfil para empezar a jugar</p>
                        </div>

                        {/* Avatar Selection */}
                        <div className="flex flex-col items-center gap-4 relative z-10">
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Avatar className="h-28 w-28 ring-4 ring-purple-500/40 shadow-xl transition-transform group-hover:scale-105">
                                    {effectiveAvatar ? (
                                        <AvatarImage src={effectiveAvatar} className="object-cover" />
                                    ) : (
                                        <AvatarFallback className="bg-slate-800">
                                            <Camera className="h-10 w-10 text-slate-500" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap font-bold shadow-lg">
                                    📷 Subir foto
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>

                            {/* Avatar Gallery */}
                            <div className="grid grid-cols-5 gap-2 w-full">
                                {AVATAR_OPTIONS.map((url) => (
                                    <div
                                        key={url}
                                        onClick={() => { setAvatarUrl(url); setCustomAvatar(null); }}
                                        className={`w-full aspect-square rounded-xl cursor-pointer overflow-hidden border-2 transition-all ${avatarUrl === url && !customAvatar
                                                ? 'border-purple-500 scale-110 shadow-lg shadow-purple-500/40 z-10'
                                                : 'border-slate-700/50 opacity-60 hover:opacity-100 hover:border-slate-500'
                                            }`}
                                    >
                                        <img src={url} alt="Avatar" className="w-full h-full object-cover bg-slate-800" />
                                    </div>
                                ))}
                            </div>

                            {/* Name Input */}
                            <div className="w-full space-y-2 mt-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Tu nombre de jugador</label>
                                <Input
                                    placeholder="Ej: ElReyDeLaFiesta"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="bg-slate-800/60 border-slate-600 text-white text-lg h-14 placeholder:text-slate-500 rounded-xl"
                                    maxLength={20}
                                    onKeyDown={(e) => e.key === 'Enter' && handleProfileDone()}
                                />
                            </div>

                            {/* Action */}
                            <Button
                                onClick={handleProfileDone}
                                disabled={!playerName.trim()}
                                className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-lg border-none shadow-xl shadow-purple-600/30 transition-all active:scale-95"
                            >
                                ¡Entrar a Jugar! <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {step === 'auth' && (
                <motion.div
                    key="auth-step"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4"
                >
                    <div className="absolute top-10 right-10 w-36 h-36 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        <div className="text-center mb-6 relative z-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                <Shield className="text-white" size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-white">¿Guardar tu progreso?</h2>
                            <p className="text-slate-400 mt-2 text-sm">
                                Crea una cuenta para no perder tus Monedas, Gemas y estadísticas. También podrás jugar online.
                            </p>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-3 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    Email / Usuario
                                </label>
                                <Input
                                    required
                                    type="email"
                                    className="bg-slate-800/60 border-slate-600 text-white placeholder:text-slate-500 rounded-xl h-12"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Lock className="h-3 w-3" />
                                    Contraseña
                                </label>
                                <Input
                                    required
                                    type="password"
                                    className="bg-slate-800/60 border-slate-600 text-white placeholder:text-slate-500 rounded-xl h-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    minLength={6}
                                />
                            </div>

                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg border-none"
                            >
                                {loading ? 'Cargando...' : (authMode === 'login' ? <><LogIn className="mr-2" /> Iniciar Sesión</> : <><UserPlus className="mr-2" /> Crear Cuenta</>)}
                            </Button>
                        </form>

                        <div className="mt-4 text-center relative z-10">
                            <button
                                type="button"
                                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 text-center relative z-10">
                            <Button
                                variant="ghost"
                                className="text-slate-400 hover:text-white font-medium"
                                onClick={handleSkipAuth}
                            >
                                Continuar sin cuenta (modo offline)
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
