import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Star, Trophy, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardPopupProps {
    isOpen: boolean;
    onClose: () => void;
    result: 'win' | 'lose';
    coinsEarned: number;
    xpEarned: number;
    oldLevel: number;
    newLevel: number;
    streak: number;
}

export function RewardPopup({ isOpen, onClose, result, coinsEarned, xpEarned, oldLevel, newLevel, streak }: RewardPopupProps) {
    const [showLevelUp, setShowLevelUp] = useState(false);
    const isWin = result === 'win';

    useEffect(() => {
        if (isOpen && newLevel > oldLevel) {
            const timer = setTimeout(() => setShowLevelUp(true), 1500);
            return () => clearTimeout(timer);
        } else {
            setShowLevelUp(false);
        }
    }, [isOpen, newLevel, oldLevel]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className={`relative w-full max-w-sm overflow-hidden rounded-3xl border-2 p-6 flex flex-col items-center text-center shadow-2xl ${isWin
                            ? 'bg-gradient-to-b from-yellow-900/40 to-black border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)]'
                            : 'bg-gradient-to-b from-slate-900 to-black border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Confetti effect background if win */}
                    {isWin && (
                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://c.tenor.com/2Xy12XqX08cAAAAC/confetti-celebrate.gif')] bg-cover mix-blend-screen" />
                    )}

                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isWin ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                        <Trophy className={`w-10 h-10 ${isWin ? 'animate-bounce' : ''}`} />
                    </div>

                    <h2 className={`text-3xl font-black uppercase tracking-widest mb-1 ${isWin ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600' : 'text-slate-300'
                        }`}>
                        {isWin ? '¡Victoria!' : 'Buen intento'}
                    </h2>

                    {streak >= 3 && isWin && (
                        <p className="text-sm font-bold text-orange-400 mb-6 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                            🔥 Racha de {streak} victorias
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-full mb-6 mt-4">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black/60 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Coins className="w-8 h-8 text-yellow-400 mb-2" />
                            <span className="text-2xl font-black text-yellow-400">+{coinsEarned}</span>
                            <span className="text-[10px] text-yellow-100/50 uppercase font-bold tracking-wider mt-1">Monedas</span>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-black/60 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Star className="w-8 h-8 text-blue-400 mb-2" />
                            <span className="text-2xl font-black text-blue-400">+{xpEarned}</span>
                            <span className="text-[10px] text-blue-100/50 uppercase font-bold tracking-wider mt-1">EXP</span>
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {showLevelUp && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="w-full bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-400/50 rounded-xl p-4 mb-6 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <ArrowUpCircle className="w-6 h-6 text-green-400" />
                                    <span className="font-black text-lg text-green-400 uppercase tracking-wider">¡Sube de Nivel!</span>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-2xl font-black text-white/50">{oldLevel}</span>
                                    <span className="text-green-400">➔</span>
                                    <span className="text-3xl font-black text-green-300 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">{newLevel}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        onClick={onClose}
                        className={`w-full font-bold text-lg h-12 uppercase tracking-wide transition-all ${isWin
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]'
                                : 'bg-slate-700 hover:bg-slate-600 text-white'
                            }`}
                    >
                        Continuar
                    </Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
