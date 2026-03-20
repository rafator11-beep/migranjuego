
import { Zap, Skull, AlertCircle } from 'lucide-react';

export function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string,string> = {
    common: "bg-white/10 text-white",
    rare: "bg-blue-500/20 text-blue-300",
    legendary: "bg-yellow-500/20 text-yellow-300",
    chaos: "bg-red-500/20 text-red-300",
    cursed: "bg-purple-600/30 text-purple-300"
  };

  const getIcon = () => {
    switch (rarity) {
      case 'legendary': return <Zap className="w-3 h-3" />;
      case 'chaos': return <Skull className="w-3 h-3" />;
      case 'cursed': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[rarity] || colors.common} flex items-center gap-1`}>
      {getIcon()}
      {rarity.toUpperCase()}
    </span>
  );
}
