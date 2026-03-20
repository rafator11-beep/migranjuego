import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface PokerControlsProps {
    onAction: (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => void;
    isActive: boolean;
    currentBetToMatch?: number;
    myChips?: number;
    pot?: number;
}

export function PokerControls({ onAction, isActive, currentBetToMatch = 0, myChips = 1000, pot = 0 }: PokerControlsProps) {
    const minRaise = currentBetToMatch > 0 ? currentBetToMatch * 2 : 20;
    const [raiseAmount, setRaiseAmount] = useState(minRaise);

    // Reset slider when turn becomes active
    useEffect(() => {
        if (isActive) {
            setRaiseAmount(Math.min(minRaise, myChips));
        }
    }, [isActive, minRaise, myChips]);

    if (!isActive) {
        return (
            <div className="text-muted-foreground animate-pulse text-sm font-medium tracking-widest uppercase">
                Esperando a otros jugadores...
            </div>
        );
    }

    const maxBet = myChips;
    const halfPot = Math.floor(pot / 2);

    const handleQuickBet = (type: 'min' | 'half' | 'allin') => {
        if (type === 'min') setRaiseAmount(Math.min(minRaise, myChips));
        if (type === 'half') setRaiseAmount(Math.min(halfPot > minRaise ? halfPot : minRaise, myChips));
        if (type === 'allin') setRaiseAmount(myChips);
    };

    const handleActionOut = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
        // Sound/Visual feedback via toast
        if (action === 'fold') toast('Te has retirado', { icon: '🏳️' });
        if (action === 'check') toast('Pasas turno', { icon: '✊' });
        if (action === 'call') toast(`Igualas la apuesta (${currentBetToMatch})`, { icon: '🪙' });
        if (action === 'raise') toast(amount === myChips ? '¡ÓRDAGO! (ALL IN)' : `Subes a ${amount}`, { icon: amount === myChips ? '🔥' : '📈' });

        onAction(action, amount);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-xl px-2">

            {/* Betting Slider Section */}
            <AnimatePresence>
                {myChips > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Apuesta</span>
                            <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter flex items-center gap-1">
                                <Coins size={20} className="fill-current opacity-80" /> {raiseAmount}
                            </span>
                        </div>

                        <Slider
                            defaultValue={[raiseAmount]}
                            value={[raiseAmount]}
                            min={Math.min(minRaise, myChips)}
                            max={myChips}
                            step={10}
                            onValueChange={(val) => setRaiseAmount(val[0])}
                            className="py-2"
                        />

                        {/* Quick Bet Buttons */}
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleQuickBet('min')} className="flex-1 bg-white/5 hover:bg-white/10 text-xs">MIN</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleQuickBet('half')} className="flex-1 bg-white/5 hover:bg-white/10 text-xs">1/2 BOTE</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleQuickBet('allin')} className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 text-xs font-black">ALL IN</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Action Buttons */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 w-full"
            >
                <Button
                    variant="destructive"
                    className="flex-1 font-bold text-sm md:text-base h-16 rounded-[20px] shadow-lg border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all"
                    onClick={() => handleActionOut('fold')}
                >
                    Retirarse
                </Button>

                <Button
                    variant="secondary"
                    className="flex-1 font-bold text-sm md:text-base h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] shadow-lg border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all"
                    onClick={() => handleActionOut(currentBetToMatch > 0 ? 'call' : 'check', currentBetToMatch)}
                >
                    {currentBetToMatch > 0 ? `Igualar ${currentBetToMatch}` : 'Pasar'}
                </Button>

                {myChips > 0 && (
                    <Button
                        variant="default"
                        className="flex-1 font-bold text-sm md:text-base h-16 bg-emerald-600 hover:bg-emerald-700 rounded-[20px] shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 transition-all"
                        onClick={() => handleActionOut('raise', raiseAmount)}
                    >
                        Subir
                    </Button>
                )}
            </motion.div>
        </div>
    );
}
