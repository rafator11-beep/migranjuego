import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ShoppingBag, X, Lock, Check } from 'lucide-react';
import { SHOP_ITEMS, ShopItem, RARITY_COLORS, RARITY_LABELS } from '@/lib/playerEconomy';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { loadLocalRankings, saveLocalRankings } from '@/utils/localRanking';
import { safeLower } from '@/utils/safeText';
import { useAuth } from '@/contexts/AuthContext';

interface CoinShopProps {
    playerName: string;
    isOpen: boolean;
    onClose: () => void;
    currentCoins: number;
    currentGems: number;
    onCoinsUpdate: (newCoins: number) => void;
    onGemsUpdate: (newGems: number) => void;
}

export function CoinShop({ playerName, isOpen, onClose, currentCoins, currentGems, onCoinsUpdate, onGemsUpdate }: CoinShopProps) {
    const { equipItem } = useAuth();
    const [activeTab, setActiveTab] = useState<'avatar' | 'ficha' | 'carta' | 'marco' | 'efecto' | 'sonido' | 'dado'>('avatar');
    const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
    const [equippedItems, setEquippedItems] = useState<Record<string, string>>({});

    // Load unlocked items for the player
    React.useEffect(() => {
        if (isOpen) {
            const rankings = loadLocalRankings();
            const player = rankings.find(r => safeLower(r.player_name) === safeLower(playerName));
            if (player) {
                if (player.unlocked_items) setUnlockedItems(player.unlocked_items);
                if (player.equipped_items) setEquippedItems(player.equipped_items);
            }
        }
    }, [isOpen, playerName]);

    const handleBuy = (item: ShopItem) => {
        if (unlockedItems.includes(item.id)) return;

        const isGems = item.currency === 'gems';
        if (isGems && currentGems < item.price) {
            toast.error(`Necesitas ${item.price - currentGems} gemas más`);
            return;
        } else if (!isGems && currentCoins < item.price) {
            toast.error(`Necesitas ${item.price - currentCoins} monedas más`);
            return;
        }

        // Process purchase
        const rankings = loadLocalRankings();
        const idx = rankings.findIndex(r => safeLower(r.player_name) === safeLower(playerName));
        if (idx >= 0) {
            const newUnlocked = [...(rankings[idx].unlocked_items || []), item.id];

            if (isGems) {
                const newGems = currentGems - item.price;
                rankings[idx].gems = newGems;
                onGemsUpdate(newGems);
            } else {
                const newCoins = currentCoins - item.price;
                rankings[idx].coins = newCoins;
                onCoinsUpdate(newCoins);
            }

            rankings[idx].unlocked_items = newUnlocked;
            saveLocalRankings(rankings);

            setUnlockedItems(newUnlocked);
            toast.success(`¡Desbloqueaste: ${item.name}!`, { icon: item.emoji });
        }
    };

    const handleEquip = async (item: ShopItem) => {
        setEquippedItems(prev => ({ ...prev, [item.category]: item.id }));
        if (equipItem) {
            await equipItem(item.category, item.id);
        }
        toast.success(`${item.name} equipado`, { icon: item.emoji });
    };

    const filteredItems = SHOP_ITEMS.filter(item => item.category === activeTab);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative bg-card border border-border/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-purple-400" />
                            <h2 className="text-xl font-black">Tienda Web</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                                    <Coins className="w-4 h-4 text-yellow-400" />
                                    <span className="font-bold text-yellow-400">{currentCoins}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                                    <span className="text-emerald-400 font-bold text-sm">💎</span>
                                    <span className="font-bold text-emerald-400">{currentGems}</span>
                                </div>
                                <button onClick={onClose} className="p-2 md:ml-2 hover:bg-white/10 rounded-full transition-colors self-start md:self-auto shadow-sm shadow-black/50">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-2 gap-1 bg-muted/10 overflow-x-auto">
                        {(['avatar', 'ficha', 'carta', 'marco', 'dado', 'efecto', 'sonido'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-white/5'
                                    }`}
                            >
                                {tab === 'avatar' ? '👤 Avatares' : tab === 'ficha' ? '♙ Fichas' : tab === 'carta' ? '🃏 Cartas' : tab === 'dado' ? '🎲 Dados' : tab === 'marco' ? '🖼️ Marcos' : tab === 'efecto' ? '✨ Efectos' : '🔊 Sonidos'}
                            </button>
                        ))}
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredItems.map(item => {
                                const isUnlocked = unlockedItems.includes(item.id);
                                const isGems = item.currency === 'gems';
                                const canAfford = isGems ? currentGems >= item.price : currentCoins >= item.price;

                                return (
                                    <div
                                        key={item.id}
                                        className={`relative p-3 rounded-xl border flex flex-col ${RARITY_COLORS[item.rarity]} ${isUnlocked ? 'opacity-70' : 'hover:scale-[1.02] transition-transform'
                                            }`}
                                    >
                                        <div className="absolute top-2 right-2 text-[10px] font-bold uppercase opacity-60">
                                            {RARITY_LABELS[item.rarity]}
                                        </div>

                                        <div className="text-4xl text-center my-3">{item.emoji}</div>

                                        <h3 className="font-bold text-[15px] leading-tight mb-1">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-4 opacity-80">{item.description}</p>

                                        <div className="mt-auto">
                                            {isUnlocked ? (
                                                equippedItems[item.category] === item.id ? (
                                                    <div className="w-full py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-md flex items-center justify-center gap-1 border border-green-500/30">
                                                        <Check className="w-3 h-3" /> Equipado
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleEquip(item)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full text-xs font-bold h-8 border-primary text-primary hover:bg-primary/20"
                                                    >
                                                        Equipar
                                                    </Button>
                                                )
                                            ) : (
                                                <Button
                                                    onClick={() => handleBuy(item)}
                                                    disabled={!canAfford}
                                                    size="sm"
                                                    className={`w-full text-xs font-bold gap-1.5 h-8 ${canAfford
                                                        ? isGems ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none' : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black border-none'
                                                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                                                        }`}
                                                >
                                                    {!canAfford && <Lock className="w-3 h-3" />}
                                                    {isGems ? <span className="text-xs">💎</span> : <Coins className="w-3 h-3" />}
                                                    <span>{item.price}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
