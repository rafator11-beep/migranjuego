import { c as createLucideIcon, j as jsxRuntimeExports, D as Dialog, a as DialogContent, b as DialogHeader, d as DialogTitle, e as DialogDescription, u as useAuth, r as reactExports, R as React, l as loadLocalRankings, s as safeLower, S as SHOP_ITEMS, A as AnimatePresence, m as motion, C as Coins, X, f as RARITY_COLORS, g as RARITY_LABELS, h as Check, B as Button, L as Lock, i as ue, k as saveLocalRankings, n as useRanking, T as Trophy, G as Gamepad2, U as Users, o as Star, p as getXPProgress, q as Avatar, t as AvatarImage, v as AvatarFallback, w as Tabs, x as TabsList, y as TabsTrigger, z as TabsContent } from "./index-14f03722.js";
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingBag = createLucideIcon("ShoppingBag", [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
]);
function ImagePreviewDialog({ open, onOpenChange, imageUrl, playerName }) {
  if (!imageUrl)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md p-4 bg-black/90 border border-white/10", "aria-describedby": void 0, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "sr-only", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Vista previa de imagen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { id: "image-preview-description", children: "Vista ampliada del avatar del jugador" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-2 ring-white/15 bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageUrl,
        onError: (e) => {
          e.currentTarget.style.display = "none";
        },
        alt: playerName || "avatar",
        className: "w-full h-full object-cover animate-in zoom-in-95 duration-200",
        loading: "eager",
        decoding: "async"
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-white/60 text-center", children: "Si no se ve la foto: asegúrate de que la URL sea pública (Supabase Storage → public) o usa una URL directa." })
  ] }) });
}
const KEY = "paco_achievements_v1";
function getUnlocked() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
const ACHIEVEMENTS = [
  { id: "drinks_10", label: "🍻 Bebedor social", desc: "Acumula 10 tragos." },
  { id: "drinks_25", label: "🥴 Resaca oficial", desc: "Acumula 25 tragos." },
  { id: "games_3", label: "🏆 Racha ganadora", desc: "Gana 3 partidas." },
  { id: "legendary_1", label: "✨ Toque legendario", desc: "Te sale 1 carta LEGENDARY." },
  { id: "cursed_1", label: "💀 Maldito", desc: "Te toca 1 evento CURSED." }
];
function CoinShop({ playerName, isOpen, onClose, currentCoins, currentGems, onCoinsUpdate, onGemsUpdate }) {
  const { equipItem } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("avatar");
  const [unlockedItems, setUnlockedItems] = reactExports.useState([]);
  const [equippedItems, setEquippedItems] = reactExports.useState({});
  React.useEffect(() => {
    if (isOpen) {
      const rankings = loadLocalRankings();
      const player = rankings.find((r) => safeLower(r.player_name) === safeLower(playerName));
      if (player) {
        if (player.unlocked_items)
          setUnlockedItems(player.unlocked_items);
        if (player.equipped_items)
          setEquippedItems(player.equipped_items);
      }
    }
  }, [isOpen, playerName]);
  const handleBuy = (item) => {
    if (unlockedItems.includes(item.id))
      return;
    const isGems = item.currency === "gems";
    if (isGems && currentGems < item.price) {
      ue.error(`Necesitas ${item.price - currentGems} gemas más`);
      return;
    } else if (!isGems && currentCoins < item.price) {
      ue.error(`Necesitas ${item.price - currentCoins} monedas más`);
      return;
    }
    const rankings = loadLocalRankings();
    const idx = rankings.findIndex((r) => safeLower(r.player_name) === safeLower(playerName));
    if (idx >= 0) {
      const newUnlocked = [...rankings[idx].unlocked_items || [], item.id];
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
      ue.success(`¡Desbloqueaste: ${item.name}!`, { icon: item.emoji });
    }
  };
  const handleEquip = async (item) => {
    setEquippedItems((prev) => ({ ...prev, [item.category]: item.id }));
    if (equipItem) {
      await equipItem(item.category, item.id);
    }
    ue.success(`${item.name} equipado`, { icon: item.emoji });
  };
  const filteredItems = SHOP_ITEMS.filter((item) => item.category === activeTab);
  if (!isOpen)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.9, y: 20 },
          animate: { scale: 1, y: 0 },
          className: "relative bg-card border border-border/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-purple-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black", children: "Tienda Web" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-end md:items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-yellow-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-yellow-400", children: currentCoins })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-bold text-sm", children: "💎" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-400", children: currentGems })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 md:ml-2 hover:bg-white/10 rounded-full transition-colors self-start md:self-auto shadow-sm shadow-black/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-2 gap-1 bg-muted/10 overflow-x-auto", children: ["avatar", "ficha", "carta", "marco", "dado", "efecto", "sonido"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveTab(tab),
                className: `px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-white/5"}`,
                children: tab === "avatar" ? "👤 Avatares" : tab === "ficha" ? "♙ Fichas" : tab === "carta" ? "🃏 Cartas" : tab === "dado" ? "🎲 Dados" : tab === "marco" ? "🖼️ Marcos" : tab === "efecto" ? "✨ Efectos" : "🔊 Sonidos"
              },
              tab
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredItems.map((item) => {
              const isUnlocked = unlockedItems.includes(item.id);
              const isGems = item.currency === "gems";
              const canAfford = isGems ? currentGems >= item.price : currentCoins >= item.price;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `relative p-3 rounded-xl border flex flex-col ${RARITY_COLORS[item.rarity]} ${isUnlocked ? "opacity-70" : "hover:scale-[1.02] transition-transform"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 text-[10px] font-bold uppercase opacity-60", children: RARITY_LABELS[item.rarity] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl text-center my-3", children: item.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[15px] leading-tight mb-1", children: item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 opacity-80", children: item.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto", children: isUnlocked ? equippedItems[item.category] === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-md flex items-center justify-center gap-1 border border-green-500/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                      " Equipado"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: () => handleEquip(item),
                        size: "sm",
                        variant: "outline",
                        className: "w-full text-xs font-bold h-8 border-primary text-primary hover:bg-primary/20",
                        children: "Equipar"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        onClick: () => handleBuy(item),
                        disabled: !canAfford,
                        size: "sm",
                        className: `w-full text-xs font-bold gap-1.5 h-8 ${canAfford ? isGems ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none" : "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black border-none" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
                        children: [
                          !canAfford && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
                          isGems ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "💎" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.price })
                        ]
                      }
                    ) })
                  ]
                },
                item.id
              );
            }) }) })
          ]
        }
      )
    }
  ) });
}
function pickWins(r, mode) {
  if (mode === "fiesta")
    return r.fiesta_games_won || 0;
  if (mode === "juego")
    return r.juego_games_won || 0;
  if (mode === "poker")
    return r.poker_chips_won || 0;
  if (mode === "megamix")
    return r.megamix_games_won || 0;
  if (mode === "clasico")
    return r.clasico_games_won || 0;
  if (mode === "picante")
    return r.picante_games_won || 0;
  if (mode === "parchis")
    return r.parchis_games_won || 0;
  return r.games_won || 0;
}
function pickGames(r, mode) {
  if (mode === "fiesta")
    return r.fiesta_games_played || 0;
  if (mode === "juego")
    return r.juego_games_played || 0;
  if (mode === "poker")
    return r.poker_games_played || 0;
  if (mode === "megamix")
    return r.megamix_games_played || 0;
  if (mode === "clasico")
    return r.clasico_games_played || 0;
  if (mode === "picante")
    return r.picante_games_played || 0;
  if (mode === "parchis")
    return r.parchis_games_played || 0;
  return r.games_played || 0;
}
function sortByWins(list, mode) {
  return [...list].sort((a, b) => pickWins(b, mode) - pickWins(a, mode));
}
function RankingList({ data, mode, onAvatarClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    data.map((rank, i) => {
      const wins = pickWins(rank, mode);
      const games = pickGames(rank, mode);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: i * 0.03 },
          className: `bg-card/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 ${i < 3 ? "neon-border" : "border border-border/30"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl w-8 text-center font-bold", children: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-12 w-12 ring-1 ring-primary/30 cursor-pointer", onClick: () => onAvatarClick(rank.avatar_url), children: [
              rank.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: rank.avatar_url, loading: "lazy" }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-white text-sm", children: rank.name.slice(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate", children: rank.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                games,
                " partidas"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-primary text-sm flex items-center gap-1", children: [
              mode === "poker" ? "🪙 " : "🏆 ",
              wins,
              " ",
              mode === "poker" ? "fichas" : "vics"
            ] })
          ]
        },
        rank.name
      );
    }),
    data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-8", children: "No hay datos aún para esta categoría" }) : null
  ] });
}
function Profiles() {
  var _a, _b;
  const [achOpen, setAchOpen] = reactExports.useState(false);
  const [shopOpen, setShopOpen] = reactExports.useState(false);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [localPlayerName, setLocalPlayerName] = reactExports.useState("");
  const { profile, syncEconomy } = useAuth();
  React.useEffect(() => {
    setLocalPlayerName(localStorage.getItem("fiesta_player_name") || "");
  }, []);
  const { rankings, loading } = useRanking();
  const totalGames = rankings.reduce((sum, r) => sum + (r.games_played || 0), 0);
  const globalRank = sortByWins(rankings.filter((r) => (r.games_played || 0) > 0), "global");
  sortByWins(rankings.filter((r) => (r.fiesta_games_played || 0) > 0), "fiesta");
  const juego = sortByWins(rankings.filter((r) => (r.juego_games_played || 0) > 0), "juego");
  const poker = sortByWins(rankings.filter((r) => (r.poker_games_played || 0) > 0 || r.poker_chips_won > 0), "poker");
  const parchis = sortByWins(rankings.filter((r) => (r.parchis_games_played || 0) > 0), "parchis");
  const megamix = sortByWins(rankings.filter((r) => (r.megamix_games_played || 0) > 0), "megamix");
  const clasico = sortByWins(rankings.filter((r) => (r.clasico_games_played || 0) > 0), "clasico");
  const picante = sortByWins(rankings.filter((r) => (r.picante_games_played || 0) > 0), "picante");
  const topPlayer = globalRank[0];
  const [previewAvatar, setPreviewAvatar] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-40 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))] opacity-10 rounded-full blur-[100px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "text-center mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black neon-text text-[hsl(var(--neon-purple))] mb-2", children: "🏆 Perfil y Online" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Comienza una partida para ver tu progreso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", className: "rounded-xl flex gap-2 items-center", onClick: () => setAchOpen(true), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4" }),
                " Logros"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "rounded-xl flex gap-2 items-center bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black border-none",
                  onClick: () => setShopOpen(true),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
                    " Tienda Web"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "grid grid-cols-3 gap-3 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-blue))]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: totalGames }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Partidas" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-yellow))]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: rankings.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Jugadores" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-center neon-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-orange))]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "Online" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live" })
            ] })
          ]
        }
      ),
      (() => {
        var _a2, _b2;
        const myProfile = rankings.find((r) => r.name.toLowerCase() === localPlayerName.toLowerCase());
        if (!myProfile)
          return null;
        const xpInfo = getXPProgress(myProfile.xp || 0);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: "bg-card border-2 border-primary/20 rounded-2xl p-4 mb-6 relative overflow-hidden shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-12 w-12 border-2 border-primary", children: [
                    ((_a2 = myProfile.equipped_items) == null ? void 0 : _a2.avatar) || myProfile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: ((_b2 = myProfile.equipped_items) == null ? void 0 : _b2.avatar) || myProfile.avatar_url || "" }) : null,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary font-bold", children: myProfile.name.slice(0, 2).toUpperCase() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg leading-tight", children: "Mi Perfil" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: myProfile.name })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-yellow-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-yellow-500", children: myProfile.coins || 0 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10", children: [
                    "Nivel ",
                    xpInfo.level
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-bold mb-1 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "EXP Global: ",
                    xpInfo.currentXP,
                    " / ",
                    xpInfo.neededXP
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    xpInfo.percent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2.5 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000",
                    style: { width: `${xpInfo.percent}%` }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-4 relative z-10 border-t border-primary/10 pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/20 p-2 rounded-lg text-center border border-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5", children: [
                    "Poker LVL ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: myProfile.poker_level || 1 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-gradient-to-r from-red-500 to-amber-500",
                      style: { width: `${getXPProgress(myProfile.poker_xp || 0).percent}%` }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/20 p-2 rounded-lg text-center border border-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5", children: [
                    "Parchís LVL ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: myProfile.parchis_level || 1 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-gradient-to-r from-green-400 to-emerald-500",
                      style: { width: `${getXPProgress(myProfile.parchis_xp || 0).percent}%` }
                    }
                  ) })
                ] })
              ] })
            ]
          }
        );
      })(),
      topPlayer ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          className: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-14 w-14 ring-2 ring-amber-500", children: [
              topPlayer.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: topPlayer.avatar_url }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-amber-500 to-yellow-500 text-white text-lg", children: topPlayer.name.slice(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "👑 Líder del ranking" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: topPlayer.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-400", children: [
                topPlayer.games_won || 0,
                " victorias totales"
              ] })
            ] })
          ]
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/70 backdrop-blur-sm rounded-2xl border border-border/40 p-4 neon-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-[hsl(var(--neon-yellow))]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Rankings" })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Cargando ranking..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "global", className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-1 px-1 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "inline-flex w-auto min-w-full gap-1 mb-4 bg-card/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "global", className: "text-[11px] sm:text-sm px-2", children: "🌎 TOP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "megamix", className: "text-[11px] sm:text-sm px-2", children: "🎲 Megamix" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "clasico", className: "text-[11px] sm:text-sm px-2", children: "🍻 Clásico" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "picante", className: "text-[11px] sm:text-sm px-2", children: "🌶️ Picante" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "juego", className: "text-[11px] sm:text-sm px-2", children: "🏆 Trivia" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "poker", className: "text-[11px] sm:text-sm px-2", children: "🃏 Poker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "parchis", className: "text-[11px] sm:text-sm px-2", children: "🎲 Parchís" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "global", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: globalRank, mode: "global", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "megamix", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: megamix, mode: "megamix", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "clasico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: clasico, mode: "clasico", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "picante", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: picante, mode: "picante", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "juego", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: juego, mode: "juego", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "poker", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: poker, mode: "poker", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "parchis", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingList, { data: parchis, mode: "parchis", onAvatarClick: (url) => {
              setPreviewAvatar(url);
              setPreviewOpen(true);
            } }) })
          ] }),
          rankings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center py-10 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-14 h-14 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aún no hay jugadores en el ranking" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "¡Juega una partida para aparecer aquí!" })
              ]
            }
          ) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CoinShop,
      {
        playerName: localPlayerName || (profile == null ? void 0 : profile.username) || "Guest",
        isOpen: shopOpen,
        onClose: () => setShopOpen(false),
        currentCoins: (profile == null ? void 0 : profile.coins) ?? ((_a = rankings.find((r) => r.name.toLowerCase() === localPlayerName.toLowerCase())) == null ? void 0 : _a.coins) ?? 0,
        currentGems: (profile == null ? void 0 : profile.gems) ?? ((_b = rankings.find((r) => r.name.toLowerCase() === localPlayerName.toLowerCase())) == null ? void 0 : _b.gems) ?? 0,
        onCoinsUpdate: (newCoins) => {
          if (profile)
            syncEconomy(newCoins, profile.gems);
        },
        onGemsUpdate: (newGems) => {
          if (profile)
            syncEconomy(profile.coins, newGems);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: achOpen, onOpenChange: setAchOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "aria-describedby": void 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Logros" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Lista de logros desbloqueados y pendientes." })
      ] }),
      (() => {
        const unlocked = getUnlocked();
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ACHIEVEMENTS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 p-3 bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/60", children: unlocked[a.id] ? "DESBLOQUEADO" : "BLOQUEADO" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/70 mt-1", children: a.desc })
        ] }, a.id)) });
      })()
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImagePreviewDialog,
      {
        open: previewOpen,
        onOpenChange: setPreviewOpen,
        imageUrl: previewAvatar
      }
    )
  ] });
}
export {
  Profiles as default
};
