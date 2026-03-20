import { r as reactExports, E as isSupabaseConfigured, F as supabase, l as loadLocalRankings, j as jsxRuntimeExports, T as Trophy, B as Button, M as Monitor, m as motion, H as Crown, i as ue } from "./index-4c908fdb.js";
function getPlayerTitle(xp, gamesPlayed, wins, stats) {
  if (stats == null ? void 0 : stats.mostDrinks)
    return { title: "El Fiestero", emoji: "🔥", color: "text-orange-400" };
  if (stats == null ? void 0 : stats.leastDrinks)
    return { title: "El Santito", emoji: "😇", color: "text-blue-200" };
  if (stats == null ? void 0 : stats.mostDrama)
    return { title: "Rey del Drama", emoji: "👑", color: "text-pink-400" };
  if (stats == null ? void 0 : stats.leastInteraction)
    return { title: "El Invisible", emoji: "👻", color: "text-slate-400" };
  if (stats == null ? void 0 : stats.mostImpostorWins)
    return { title: "Impostor Nato", emoji: "🎭", color: "text-purple-400" };
  if (stats == null ? void 0 : stats.mostKamikaze)
    return { title: "El Kamikaze", emoji: "💣", color: "text-red-400" };
  if (stats == null ? void 0 : stats.mostDiplomatic)
    return { title: "El Diplomático", emoji: "🤝", color: "text-blue-400" };
  if (stats == null ? void 0 : stats.mostDuelWins)
    return { title: "De Hielo", emoji: "🧊", color: "text-cyan-200" };
  if (stats == null ? void 0 : stats.mostDevil)
    return { title: "El Diablillo", emoji: "😈", color: "text-red-500" };
  if (stats == null ? void 0 : stats.mostClown)
    return { title: "El Payaso", emoji: "🤡", color: "text-pink-300" };
  if (xp >= 5e3)
    return { title: "Dios de la Fiesta", emoji: "⚡", color: "text-amber-300" };
  if (xp >= 2e3)
    return { title: "Veterano Pro", emoji: "🎖️", color: "text-yellow-400" };
  return { title: "Aprendiz", emoji: "📖", color: "text-slate-500" };
}
function PlayerAvatar({ url, name, size = "md" }) {
  const sz = size === "lg" ? "w-14 h-14" : size === "md" ? "w-10 h-10" : "w-8 h-8";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${sz} rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0`, children: url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: name, className: "w-full h-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-white text-sm", children: name.trim().charAt(0).toUpperCase() }) });
}
function getClassifications(xp, gamesPlayed, wins) {
  const badges = [];
  const winRate = gamesPlayed > 0 ? wins / gamesPlayed : 0;
  if (winRate >= 0.8 && gamesPlayed >= 5)
    badges.push({ label: "Invencible", emoji: "🛡️", color: "bg-yellow-500/20 text-yellow-300" });
  else if (winRate >= 0.6 && gamesPlayed >= 5)
    badges.push({ label: "Estratega", emoji: "🧠", color: "bg-blue-500/20 text-blue-300" });
  else if (winRate < 0.2 && gamesPlayed >= 5)
    badges.push({ label: "Kamikaze", emoji: "💥", color: "bg-red-500/20 text-red-300" });
  if (gamesPlayed >= 50)
    badges.push({ label: "Veterano", emoji: "🎖️", color: "bg-emerald-500/20 text-emerald-300" });
  else if (gamesPlayed >= 20)
    badges.push({ label: "Habitual", emoji: "🔄", color: "bg-teal-500/20 text-teal-300" });
  else if (gamesPlayed >= 10)
    badges.push({ label: "Frecuente", emoji: "📅", color: "bg-cyan-500/20 text-cyan-300" });
  if (xp >= 2e3)
    badges.push({ label: "Party Animal", emoji: "🦁", color: "bg-orange-500/20 text-orange-300" });
  if (xp >= 1e3 && wins >= 30)
    badges.push({ label: "Leyenda Viva", emoji: "👑", color: "bg-amber-500/20 text-amber-300" });
  if (wins >= 10 && winRate >= 0.5)
    badges.push({ label: "Clutch Master", emoji: "🎯", color: "bg-pink-500/20 text-pink-300" });
  if (gamesPlayed >= 10 && wins === 0)
    badges.push({ label: "El Optimista", emoji: "😅", color: "bg-purple-500/20 text-purple-300" });
  if (gamesPlayed >= 5 && winRate >= 0.4 && winRate < 0.6)
    badges.push({ label: "Equilibrado", emoji: "⚖️", color: "bg-indigo-500/20 text-indigo-300" });
  if (xp >= 500 && xp < 1e3)
    badges.push({ label: "En Racha", emoji: "🔥", color: "bg-rose-500/20 text-rose-300" });
  return badges.slice(0, 3);
}
function PlayerRowCard({ player, idx }) {
  const titleInfo = getPlayerTitle(player.xp, player.gamesPlayed, player.wins, player.sessionStats);
  getClassifications(player.xp, player.gamesPlayed, player.wins);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: idx * 0.05 },
      className: `relative p-4 rounded-[32px] transition-all duration-500 overflow-hidden group
        ${idx === 0 ? "bg-gradient-to-br from-yellow-500/20 via-slate-900 to-slate-900 border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]" : idx === 1 ? "bg-gradient-to-br from-slate-400/20 via-slate-900 to-slate-900 border border-slate-400/50 shadow-[0_0_20px_rgba(148,163,184,0.15)]" : idx === 2 ? "bg-gradient-to-br from-amber-700/20 via-slate-900 to-slate-900 border border-amber-700/50 shadow-[0_0_20px_rgba(180,83,9,0.15)]" : "bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/20"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center w-10 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-2xl font-black ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-white/20"}`, children: [
              "#",
              idx + 1
            ] }),
            idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-yellow-400 animate-ping mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-2xl p-1 transition-all duration-500
            ${idx === 0 ? "bg-gradient-to-tr from-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(234,179,8,0.5)]" : idx === 1 ? "bg-slate-400" : idx === 2 ? "bg-amber-700" : "bg-white/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerAvatar, { url: player.avatar, name: player.name, size: idx < 3 ? "md" : "sm" }) }),
            idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "absolute -top-3 -right-3 w-6 h-6 text-yellow-400 fill-yellow-400 rotate-12 drop-shadow-lg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-white text-lg leading-none truncate mb-1 uppercase tracking-tight group-hover:text-primary transition-colors", children: player.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${titleInfo.color}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: titleInfo.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: titleInfo.title })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black text-white tabular-nums tracking-tighter", children: player.xp }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-white/30 uppercase tracking-widest -mt-1", children: "EXP" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center justify-end gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-black uppercase tracking-tighter border border-primary/20", children: [
              "NV.",
              player.level
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-xl p-2 border border-white/5 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] font-black text-white/30 uppercase tracking-[0.2em]", children: "Partidas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white/80", children: player.gamesPlayed })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-xl p-2 border border-white/5 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] font-black text-white/30 uppercase tracking-[0.2em]", children: "Victorias" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-emerald-400", children: player.wins })
          ] })
        ] }),
        idx < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] opacity-20 pointer-events-none
          ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-slate-400" : "bg-amber-700"}`
          }
        )
      ]
    }
  );
}
const RANK_TITLES = [
  { emoji: "⚡", title: "Dios de la Fiesta", req: "5000+ XP", color: "text-amber-300" },
  { emoji: "🎭", title: "Rey del Drama", req: "3000+ XP", color: "text-pink-400" },
  { emoji: "🎉", title: "El Fiestero", req: "2000+ XP", color: "text-yellow-400" },
  { emoji: "🕵️", title: "Impostor Nato", req: "1000+ XP", color: "text-purple-400" },
  { emoji: "🌙", title: "Alma de la Noche", req: "700+ XP", color: "text-indigo-400" },
  { emoji: "💣", title: "El Kamikaze", req: "500+ XP", color: "text-red-400" },
  { emoji: "👻", title: "El Invisible", req: "300+ XP", color: "text-slate-400" },
  { emoji: "🤝", title: "El Diplomático", req: "200+ XP", color: "text-blue-400" },
  { emoji: "⭐", title: "Promesa", req: "100+ XP", color: "text-yellow-300" },
  { emoji: "📖", title: "Aprendiz", req: "Inicio", color: "text-slate-500" },
  { emoji: "😇", title: "El Santito", req: "Karma+", color: "text-blue-200" },
  { emoji: "🤡", title: "El Payaso", req: "Risas+", color: "text-pink-300" },
  { emoji: "😈", title: "El Diablillo", req: "Caos+", color: "text-red-500" },
  { emoji: "🔮", title: "El Adivino", req: "Votos+", color: "text-purple-300" },
  { emoji: "🧊", title: "De Hielo", req: "Sin Beber", color: "text-cyan-200" }
];
function HallOfFame() {
  const [loading, setLoading] = reactExports.useState(true);
  const [players, setPlayers] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("xp");
  const [source, setSource] = reactExports.useState("local");
  const [screencastActive, setScreencastActive] = reactExports.useState(false);
  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreencastActive(true);
      ue.success("¡Ranking proyectado! Disfruta en tu TV.");
      stream.getVideoTracks()[0].onended = () => {
        setScreencastActive(false);
      };
    } catch {
      ue.error("No se pudo iniciar la proyección.");
    }
  };
  reactExports.useEffect(() => {
    loadData();
  }, [source, filter]);
  const loadData = async () => {
    setLoading(true);
    try {
      if (source === "global" && isSupabaseConfigured) {
        let query = supabase.from("user_stats").select("player_name, avatar_url, total_xp, games_played, total_wins, level, futbol_xp, cultura_xp");
        if (filter === "xp")
          query = query.order("total_xp", { ascending: false });
        else if (filter === "wins")
          query = query.order("total_wins", { ascending: false });
        else if (filter === "played")
          query = query.order("games_played", { ascending: false });
        else if (filter === "football")
          query = query.order("futbol_xp", { ascending: false });
        else if (filter === "culture")
          query = query.order("cultura_xp", { ascending: false });
        const { data, error } = await query.limit(50);
        if (!error && data) {
          setPlayers(data.map((r) => ({
            name: r.player_name || "Jugador",
            avatar: r.avatar_url,
            xp: filter === "football" ? r.futbol_xp || 0 : filter === "culture" ? r.cultura_xp || 0 : r.total_xp || 0,
            gamesPlayed: r.games_played || 0,
            wins: r.total_wins || 0,
            level: r.level || 1,
            // Extra stats for title system
            sessionStats: {
              xp: r.total_xp,
              footballXp: r.futbol_xp,
              cultureXp: r.cultura_xp
            }
          })));
        } else {
          loadLocal();
        }
      } else {
        loadLocal();
      }
    } catch {
      loadLocal();
    } finally {
      setLoading(false);
    }
  };
  const loadLocal = () => {
    const local = loadLocalRankings();
    const mapped = local.map((r) => ({
      name: r.player_name || "Jugador",
      avatar: r.avatar_url || null,
      xp: r.total_score || 0,
      gamesPlayed: r.games_played || 0,
      wins: r.games_won || 0,
      level: Math.floor((r.total_score || 0) / 100) + 1
    }));
    setPlayers(mapped);
  };
  const sorted = [...players].sort((a, b) => {
    if (filter === "xp")
      return b.xp - a.xp;
    if (filter === "wins")
      return b.wins - a.wins;
    return b.gamesPlayed - a.gamesPlayed;
  });
  const filterBtns = [
    { key: "xp", label: "XP", icon: "⚡" },
    { key: "wins", label: "Victorias", icon: "🏆" },
    { key: "played", label: "Partidas", icon: "🎮" },
    { key: "football", label: "Fútbol", icon: "⚽" },
    { key: "culture", label: "Cultura", icon: "📚" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 pb-28 pt-6 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 pointer-events-none overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-7 h-7 text-yellow-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400", children: "Hall of Fame" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 ml-10", children: "Clasificación de leyendas del party" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleScreenShare,
          className: `w-full h-12 rounded-2xl border-white/5 font-black transition-all ${screencastActive ? "bg-primary/20 border-primary text-primary" : "bg-white/5 text-slate-400 hover:text-white hover:border-white/20"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: `w-5 h-5 mr-3 ${screencastActive ? "animate-pulse" : ""}` }),
            screencastActive ? "TRANSMITIENDO A TV..." : "COMPARTIR EN TV"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4", children: ["local", "global"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSource(s),
          className: `flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${source === s ? "bg-purple-600/40 border-purple-500/60 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70"}`,
          children: s === "local" ? "📱 Local" : "🌍 Global"
        },
        s
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1", children: filterBtns.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setFilter(f.key),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f.key ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]" : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.label })
          ]
        },
        f.key
      )) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm", children: "Cargando leyendas..." })
      ] }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "🏆" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 font-bold", children: "Nadie ha jugado aún" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-sm mt-1", children: "¡Sé el primero en entrar al Hall of Fame!" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: sorted.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerRowCard, { player: p, idx }, `${p.name}-${idx}`)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white/40 uppercase tracking-wider mb-3", children: "Títulos de Rango (10 niveles)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: RANK_TITLES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${t.color} font-bold truncate`, children: t.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30 ml-auto shrink-0", children: t.req })
        ] }, t.title)) })
      ] })
    ] })
  ] });
}
export {
  HallOfFame
};
