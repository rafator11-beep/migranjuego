/**
 * Player Classification Engine
 * Analyzes player stats across all modes and generates fun personality titles,
 * badges, and rankings that update in real-time.
 */

import { PlayerRanking } from '@/utils/localRanking';

// ─── CLASSIFICATION TYPES ────────────────────────────
export interface PlayerClassification {
    mainTitle: string;        // Primary personality title
    mainEmoji: string;        // Emoji for the title
    mainColor: string;        // CSS color class
    badges: PlayerBadge[];    // All earned badges
    stats: StatHighlight[];   // Fun stat highlights
    personalityTraits: string[]; // Short trait tags
    funFact: string;          // Random fun fact about the player
}

export interface PlayerBadge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
    earned: boolean;
}

export interface StatHighlight {
    label: string;
    value: string;
    emoji: string;
    color: string;
}

// ─── PERSONALITY TITLES ────────────────────────────
// Each title has conditions based on stats
interface TitleRule {
    title: string;
    emoji: string;
    color: string;
    priority: number; // Higher = more important
    condition: (r: PlayerRanking) => boolean;
}

const TITLE_RULES: TitleRule[] = [
    // === LEGENDARY (priority 100+) ===
    {
        title: 'Leyenda Suprema', emoji: '👑', color: 'text-yellow-400', priority: 150,
        condition: r => (r.games_won || 0) >= 100 && (r.level || 1) >= 30
    },
    {
        title: 'Dios del Party', emoji: '⚡', color: 'text-purple-400', priority: 140,
        condition: r => (r.games_played || 0) >= 200
    },
    {
        title: 'El Inmortal', emoji: '🔥', color: 'text-red-400', priority: 130,
        condition: r => (r.win_streak || 0) >= 15
    },
    {
        title: 'Magnate de la Fiesta', emoji: '💰', color: 'text-yellow-500', priority: 120,
        condition: r => (r.coins || 0) >= 5000
    },
    {
        title: 'Coleccionista Supremo', emoji: '💎', color: 'text-cyan-400', priority: 110,
        condition: r => (r.unlocked_items?.length || 0) >= 30
    },

    // === EPIC (priority 70-99) ===
    {
        title: 'El Maestro', emoji: '🎓', color: 'text-blue-400', priority: 95,
        condition: r => (r.culture_wins || 0) >= 20 && (r.football_wins || 0) >= 20
    },
    {
        title: 'Tiburón del Poker', emoji: '🦈', color: 'text-emerald-400', priority: 90,
        condition: r => (r.poker_wins || 0) >= 30
    },
    {
        title: 'Rey del Parchís', emoji: '♟️', color: 'text-amber-400', priority: 88,
        condition: r => (r.parchis_wins || 0) >= 20
    },
    {
        title: 'El Incombustible', emoji: '🛡️', color: 'text-slate-300', priority: 85,
        condition: r => (r.games_played || 0) >= 100
    },
    {
        title: 'Cerebrito', emoji: '🧠', color: 'text-pink-400', priority: 82,
        condition: r => (r.culture_wins || 0) >= 15
    },
    {
        title: 'Futbolero de Élite', emoji: '⚽', color: 'text-green-400', priority: 80,
        condition: r => (r.football_wins || 0) >= 15
    },
    {
        title: 'El Picante', emoji: '🌶️', color: 'text-red-500', priority: 78,
        condition: r => (r.picante_games || 0) >= 20
    },
    {
        title: 'Alma de la Fiesta', emoji: '🎉', color: 'text-pink-400', priority: 75,
        condition: r => (r.megamix_wins || 0) >= 15
    },
    {
        title: 'Veterano de Guerra', emoji: '🎖️', color: 'text-amber-500', priority: 72,
        condition: r => (r.games_played || 0) >= 50
    },
    {
        title: 'Máquina de Ganar', emoji: '🏆', color: 'text-yellow-400', priority: 70,
        condition: r => (r.games_won || 0) >= 50
    },

    // === RARE (priority 40-69) ===
    {
        title: 'El Atrevido', emoji: '😈', color: 'text-red-400', priority: 65,
        condition: r => (r.picante_games || 0) >= 10
    },
    {
        title: 'Fiestero Nato', emoji: '🥳', color: 'text-purple-400', priority: 62,
        condition: r => (r.clasico_games || 0) >= 15
    },
    {
        title: 'El Estratega', emoji: '♟️', color: 'text-blue-500', priority: 60,
        condition: r => (r.poker_wins || 0) >= 10
    },
    {
        title: 'Enciclopedia Andante', emoji: '📚', color: 'text-indigo-400', priority: 58,
        condition: r => (r.culture_games || 0) >= 10
    },
    {
        title: 'Hincha Supremo', emoji: '📣', color: 'text-green-500', priority: 55,
        condition: r => (r.football_games || 0) >= 10
    },
    {
        title: 'Lobo Solitario', emoji: '🐺', color: 'text-slate-400', priority: 52,
        condition: r => (r.win_streak || 0) >= 5
    },
    {
        title: 'El Imparable', emoji: '💪', color: 'text-orange-400', priority: 50,
        condition: r => (r.games_won || 0) >= 20
    },
    {
        title: 'Jugador Dedicado', emoji: '🎮', color: 'text-cyan-400', priority: 48,
        condition: r => (r.games_played || 0) >= 30
    },
    {
        title: 'Rey del Megamix', emoji: '🎲', color: 'text-violet-400', priority: 45,
        condition: r => (r.megamix_games || 0) >= 10
    },
    {
        title: 'El Clásico', emoji: '🍻', color: 'text-amber-400', priority: 42,
        condition: r => (r.clasico_games || 0) >= 10
    },
    {
        title: 'Caos Andante', emoji: '🧨', color: 'text-red-500', priority: 40,
        condition: r => (r.chaos_events || 0) >= 10
    },

    // === COMMON (priority 10-39) ===
    {
        title: 'Promesa del Party', emoji: '⭐', color: 'text-yellow-300', priority: 35,
        condition: r => (r.games_won || 0) >= 10
    },
    {
        title: 'El Explorador', emoji: '🧭', color: 'text-teal-400', priority: 30,
        condition: r => (r.games_played || 0) >= 15
    },
    {
        title: 'Social Gamer', emoji: '🤝', color: 'text-blue-300', priority: 25,
        condition: r => (r.games_played || 0) >= 10
    },
    {
        title: 'Aprendiz', emoji: '📖', color: 'text-slate-300', priority: 20,
        condition: r => (r.games_played || 0) >= 5
    },
    {
        title: 'Novato Entusiasta', emoji: '🌱', color: 'text-green-300', priority: 15,
        condition: r => (r.games_played || 0) >= 2
    },
    {
        title: 'Recién Llegado', emoji: '👋', color: 'text-slate-400', priority: 10,
        condition: r => (r.games_played || 0) >= 1
    },
    {
        title: 'Espectador', emoji: '👀', color: 'text-slate-500', priority: 1,
        condition: () => true
    }, // Always matches as fallback
];

// ─── BADGE DEFINITIONS ────────────────────────────
interface BadgeRule {
    id: string;
    name: string;
    emoji: string;
    description: string;
    rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
    condition: (r: PlayerRanking) => boolean;
}

const BADGE_RULES: BadgeRule[] = [
    // Games played milestones
    { id: 'first_game', name: 'Primera Partida', emoji: '🎯', description: 'Jugaste tu primera partida', rarity: 'bronze', condition: r => (r.games_played || 0) >= 1 },
    { id: '10_games', name: 'Jugador Regular', emoji: '🎮', description: '10 partidas jugadas', rarity: 'bronze', condition: r => (r.games_played || 0) >= 10 },
    { id: '25_games', name: 'Habitual', emoji: '🏠', description: '25 partidas jugadas', rarity: 'silver', condition: r => (r.games_played || 0) >= 25 },
    { id: '50_games', name: 'Veterano', emoji: '🎖️', description: '50 partidas jugadas', rarity: 'gold', condition: r => (r.games_played || 0) >= 50 },
    { id: '100_games', name: 'Leyenda', emoji: '👑', description: '100 partidas jugadas', rarity: 'diamond', condition: r => (r.games_played || 0) >= 100 },

    // Win milestones
    { id: 'first_win', name: 'Primera Victoria', emoji: '🏆', description: 'Ganaste tu primera partida', rarity: 'bronze', condition: r => (r.games_won || 0) >= 1 },
    { id: '10_wins', name: 'Ganador Serial', emoji: '🔥', description: '10 victorias', rarity: 'silver', condition: r => (r.games_won || 0) >= 10 },
    { id: '25_wins', name: 'Campeón', emoji: '🥇', description: '25 victorias', rarity: 'gold', condition: r => (r.games_won || 0) >= 25 },
    { id: '50_wins', name: 'Aplastador', emoji: '💀', description: '50 victorias', rarity: 'diamond', condition: r => (r.games_won || 0) >= 50 },

    // Win streak
    { id: 'streak_3', name: 'Racha x3', emoji: '🔥', description: '3 victorias seguidas', rarity: 'bronze', condition: r => (r.win_streak || 0) >= 3 },
    { id: 'streak_5', name: 'Racha x5', emoji: '⚡', description: '5 victorias seguidas', rarity: 'silver', condition: r => (r.win_streak || 0) >= 5 },
    { id: 'streak_10', name: 'Imbatible', emoji: '💎', description: '10 victorias seguidas', rarity: 'diamond', condition: r => (r.win_streak || 0) >= 10 },

    // Mode-specific
    { id: 'poker_pro', name: 'Poker Pro', emoji: '🃏', description: '10 victorias en Poker', rarity: 'gold', condition: r => (r.poker_wins || 0) >= 10 },
    { id: 'trivia_king', name: 'Rey del Trivia', emoji: '🧠', description: '10 victorias en Trivia', rarity: 'gold', condition: r => ((r.culture_wins || 0) + (r.football_wins || 0)) >= 10 },
    { id: 'megamix_master', name: 'Maestro Megamix', emoji: '🎲', description: '10 victorias en Megamix', rarity: 'gold', condition: r => (r.megamix_wins || 0) >= 10 },
    { id: 'parchis_boss', name: 'Jefe del Parchís', emoji: '♟️', description: '10 victorias en Parchís', rarity: 'gold', condition: r => (r.parchis_wins || 0) >= 10 },
    { id: 'spicy_lover', name: 'Amante del Picante', emoji: '🌶️', description: '10 partidas en modo Picante', rarity: 'silver', condition: r => (r.picante_games || 0) >= 10 },
    { id: 'classic_lover', name: 'Alma Clásica', emoji: '🍻', description: '10 partidas en Clásico', rarity: 'silver', condition: r => (r.clasico_games || 0) >= 10 },

    // Economy
    { id: 'rich_100', name: 'Primer Ahorro', emoji: '🪙', description: 'Acumula 100 monedas', rarity: 'bronze', condition: r => (r.coins || 0) >= 100 },
    { id: 'rich_500', name: 'Inversor', emoji: '💰', description: 'Acumula 500 monedas', rarity: 'silver', condition: r => (r.coins || 0) >= 500 },
    { id: 'rich_2000', name: 'Millonario', emoji: '🤑', description: 'Acumula 2000 monedas', rarity: 'gold', condition: r => (r.coins || 0) >= 2000 },
    { id: 'rich_10000', name: 'Magnate', emoji: '💎', description: 'Acumula 10000 monedas', rarity: 'diamond', condition: r => (r.coins || 0) >= 10000 },

    // Level
    { id: 'level_5', name: 'Nivel 5', emoji: '⬆️', description: 'Alcanza el nivel 5', rarity: 'bronze', condition: r => (r.level || 1) >= 5 },
    { id: 'level_10', name: 'Nivel 10', emoji: '🔟', description: 'Alcanza el nivel 10', rarity: 'silver', condition: r => (r.level || 1) >= 10 },
    { id: 'level_20', name: 'Nivel 20', emoji: '🌟', description: 'Alcanza el nivel 20', rarity: 'gold', condition: r => (r.level || 1) >= 20 },
    { id: 'level_40', name: 'Nivel 40', emoji: '💎', description: 'Alcanza el nivel 40', rarity: 'diamond', condition: r => (r.level || 1) >= 40 },

    // Special
    { id: 'chaos_survivor', name: 'Superviviente Caos', emoji: '🧨', description: '5 eventos caóticos', rarity: 'silver', condition: r => (r.chaos_events || 0) >= 5 },
    { id: 'virus_carrier', name: 'Portador del Virus', emoji: '🦠', description: 'Recibiste 5 virus', rarity: 'silver', condition: r => (r.viruses_received || 0) >= 5 },
    { id: 'collector', name: 'Coleccionista', emoji: '🗂️', description: 'Desbloquea 10 items', rarity: 'gold', condition: r => (r.unlocked_items?.length || 0) >= 10 },
    {
        id: 'all_rounder', name: 'Todoterreno', emoji: '🌍', description: 'Jugaste todos los modos', rarity: 'gold', condition: r =>
            (r.megamix_games || 0) > 0 && (r.clasico_games || 0) > 0 && (r.picante_games || 0) > 0 &&
            (r.poker_games || 0) > 0 && (r.football_games || 0) > 0 && (r.culture_games || 0) > 0
    },
];

// ─── FUN FACTS ────────────────────────────
function generateFunFact(r: PlayerRanking): string {
    const facts: string[] = [];
    const winRate = (r.games_played || 0) > 0 ? Math.round(((r.games_won || 0) / (r.games_played || 1)) * 100) : 0;

    if (winRate >= 80) facts.push(`Ganas el ${winRate}% de tus partidas. ¡Eres casi invencible!`);
    else if (winRate >= 60) facts.push(`Tu ratio de victoria es del ${winRate}%. ¡Nada mal!`);
    else if (winRate >= 40) facts.push(`Ganas el ${winRate}% de las veces. ¡Equilibrado!`);
    else if (winRate > 0) facts.push(`Solo ganas el ${winRate}%... pero la diversión es lo que cuenta 😅`);

    if ((r.poker_wins || 0) > (r.megamix_wins || 0) + (r.clasico_wins || 0)) facts.push('Tu fuerte es el Poker. ¿Tienes cara de póker?');
    if ((r.picante_games || 0) > 10) facts.push(`Has jugado ${r.picante_games} partidas picantes. ¡Te va la marcha!`);
    if ((r.win_streak || 0) >= 5) facts.push(`Tu mejor racha fue de ${r.win_streak} victorias seguidas. ¡Imparable!`);
    if ((r.football_wins || 0) > (r.culture_wins || 0) * 2) facts.push('Sabes más de fútbol que de cultura general. ¡Futbolero puro!');
    if ((r.culture_wins || 0) > (r.football_wins || 0) * 2) facts.push('Eres un pozo de sabiduría. ¡El cerebrito del grupo!');
    if ((r.coins || 0) >= 1000) facts.push(`Tienes ${r.coins} monedas. ¡Podrías comprar media tienda!`);
    if ((r.chaos_events || 0) >= 5) facts.push(`Has sobrevivido a ${r.chaos_events} eventos caóticos. ¡El caos te persigue!`);
    if ((r.viruses_received || 0) >= 3) facts.push(`Recibiste ${r.viruses_received} virus. ¡Eres un imán para los problemas!`);
    if ((r.legendary_drops || 0) >= 3) facts.push(`${r.legendary_drops} cartas legendarias. ¡La suerte te sonríe!`);
    if ((r.games_played || 0) >= 50 && (r.games_played || 0) < 100) facts.push(`Llevas ${r.games_played} partidas. ¡Te acercas a las 100!`);
    if ((r.megamix_games || 0) >= 20) facts.push('El Megamix es tu hábitat natural.');
    if ((r.parchis_wins || 0) >= 5) facts.push(`Has ganado ${r.parchis_wins} partidas de Parchís. ¡Dominas el tablero!`);

    facts.push('Cada partida te acerca a tu próximo título. ¡Sigue jugando!');

    return facts[Math.floor(Math.random() * Math.min(facts.length, 3))];
}

// ─── PERSONALITY TRAITS ────────────────────────────
function getPersonalityTraits(r: PlayerRanking): string[] {
    const traits: string[] = [];
    const winRate = (r.games_played || 0) > 0 ? ((r.games_won || 0) / (r.games_played || 1)) : 0;
    const totalGames = r.games_played || 0;

    // Win-based
    if (winRate >= 0.8) traits.push('Imbatible');
    else if (winRate >= 0.7) traits.push('Competitivo');
    else if (winRate >= 0.5) traits.push('Equilibrado');
    if (winRate < 0.3 && totalGames >= 3) traits.push('Resiliente');
    if (winRate >= 0.6 && totalGames >= 5) traits.push('Consistente');

    // Mode-based (lowered thresholds)
    if ((r.picante_games || 0) >= 2) traits.push('Atrevido');
    if ((r.picante_games || 0) >= 8) traits.push('Sinvergüenza');
    if ((r.culture_games || 0) >= 2) traits.push('Culto');
    if ((r.culture_games || 0) >= 8) traits.push('Cerebrito');
    if ((r.football_games || 0) >= 2) traits.push('Deportista');
    if ((r.football_games || 0) >= 8) traits.push('Futbolero');
    if ((r.poker_games || 0) >= 2) traits.push('Estratega');
    if ((r.poker_games || 0) >= 8) traits.push('Calculador');
    if ((r.clasico_games || 0) >= 2) traits.push('Fiestero');
    if ((r.clasico_games || 0) >= 10) traits.push('Alma de fiesta');
    if ((r.megamix_games || 0) >= 2) traits.push('Versátil');
    if ((r.megamix_games || 0) >= 10) traits.push('Todoterreno');
    if ((r.parchis_games || 0) >= 1) traits.push('Tablero');
    if ((r.parchis_games || 0) >= 5) traits.push('Paciente');

    // Streak
    if ((r.win_streak || 0) >= 2) traits.push('En racha');
    if ((r.win_streak || 0) >= 5) traits.push('Imparable');
    if ((r.win_streak || 0) >= 10) traits.push('Leyenda');

    // Economy
    if ((r.coins || 0) >= 200) traits.push('Ahorrador');
    if ((r.coins || 0) >= 1000) traits.push('Emprendedor');
    if ((r.coins || 0) >= 5000) traits.push('Magnate');
    if ((r.gems || 0) >= 10) traits.push('Joyero');
    if ((r.gems || 0) >= 50) traits.push('Rico');
    if ((r.unlocked_items?.length || 0) >= 3) traits.push('Coleccionista');
    if ((r.unlocked_items?.length || 0) >= 15) traits.push('Shopaholic');

    // Chaos/Special
    if ((r.chaos_events || 0) >= 2) traits.push('Caótico');
    if ((r.chaos_events || 0) >= 8) traits.push('Destructor');
    if ((r.viruses_received || 0) >= 2) traits.push('Infectado');
    if ((r.viruses_received || 0) >= 8) traits.push('Inmune');
    if ((r.legendary_drops || 0) >= 1) traits.push('Suertudo');
    if ((r.legendary_drops || 0) >= 5) traits.push('Bendecido');

    // Experience
    if (totalGames >= 2) traits.push('Activo');
    if (totalGames >= 10) traits.push('Dedicado');
    if (totalGames >= 30) traits.push('Incansable');
    if (totalGames >= 75) traits.push('Veterano');
    if ((r.level || 1) >= 5) traits.push('Subiendo');
    if ((r.level || 1) >= 15) traits.push('Experto');
    if ((r.level || 1) >= 30) traits.push('Maestro');

    // Multi-mode
    const modesPlayed = [r.megamix_games, r.clasico_games, r.picante_games, r.poker_games, r.parchis_games, r.football_games, r.culture_games]
        .filter(g => (g || 0) > 0).length;
    if (modesPlayed >= 3) traits.push('Explorador');
    if (modesPlayed >= 5) traits.push('Polivalente');
    if (modesPlayed >= 7) traits.push('Completista');

    // Social
    if (totalGames >= 1) traits.push('Social');
    if ((r.games_won || 0) >= 1) traits.push('Ganador');

    // Always return at least 2 traits
    if (traits.length === 0) traits.push('Nuevo', 'Curioso');
    if (traits.length === 1) traits.push('Curioso');

    // Remove duplicates and limit
    const unique = [...new Set(traits)];
    return unique.slice(0, 6); // Max 6 traits
}

// ─── STAT HIGHLIGHTS ────────────────────────────
function getStatHighlights(r: PlayerRanking): StatHighlight[] {
    const highlights: StatHighlight[] = [];
    const winRate = (r.games_played || 0) > 0 ? Math.round(((r.games_won || 0) / (r.games_played || 1)) * 100) : 0;

    highlights.push({ label: 'Ratio Victoria', value: `${winRate}%`, emoji: '📊', color: winRate >= 50 ? 'text-green-400' : 'text-red-400' });

    // Find best mode
    const modes = [
        { name: 'Megamix', wins: r.megamix_wins || 0, games: r.megamix_games || 0 },
        { name: 'Clásico', wins: r.clasico_wins || 0, games: r.clasico_games || 0 },
        { name: 'Picante', wins: r.picante_wins || 0, games: r.picante_games || 0 },
        { name: 'Poker', wins: r.poker_wins || 0, games: r.poker_games || 0 },
        { name: 'Parchís', wins: r.parchis_wins || 0, games: r.parchis_games || 0 },
        { name: 'Fútbol', wins: r.football_wins || 0, games: r.football_games || 0 },
        { name: 'Cultura', wins: r.culture_wins || 0, games: r.culture_games || 0 },
    ].filter(m => m.games > 0);

    if (modes.length > 0) {
        const best = modes.sort((a, b) => b.wins - a.wins)[0];
        highlights.push({ label: 'Mejor Modo', value: best.name, emoji: '🏅', color: 'text-yellow-400' });

        const mostPlayed = modes.sort((a, b) => b.games - a.games)[0];
        if (mostPlayed.name !== best.name) {
            highlights.push({ label: 'Más Jugado', value: mostPlayed.name, emoji: '🎮', color: 'text-blue-400' });
        }
    }

    if ((r.win_streak || 0) > 0) {
        highlights.push({ label: 'Mejor Racha', value: `${r.win_streak}🔥`, emoji: '🔥', color: 'text-orange-400' });
    }

    highlights.push({ label: 'Puntos Totales', value: `${r.total_score || 0}`, emoji: '⭐', color: 'text-purple-400' });

    return highlights.slice(0, 5);
}

// ─── MAIN CLASSIFICATION FUNCTION ────────────────────────────
export function classifyPlayer(ranking: PlayerRanking | null | undefined): PlayerClassification {
    // Default for new/null players
    if (!ranking) {
        return {
            mainTitle: 'Nuevo Jugador',
            mainEmoji: '🌟',
            mainColor: 'text-slate-400',
            badges: [],
            stats: [],
            personalityTraits: ['Nuevo', 'Curioso'],
            funFact: '¡Todo empieza con la primera partida!',
        };
    }

    // Find the highest-priority matching title
    const matchedTitle = TITLE_RULES
        .filter(rule => rule.condition(ranking))
        .sort((a, b) => b.priority - a.priority)[0];

    // Evaluate all badges
    const badges: PlayerBadge[] = BADGE_RULES.map(rule => ({
        id: rule.id,
        name: rule.name,
        emoji: rule.emoji,
        description: rule.description,
        rarity: rule.rarity,
        earned: rule.condition(ranking),
    }));

    return {
        mainTitle: matchedTitle.title,
        mainEmoji: matchedTitle.emoji,
        mainColor: matchedTitle.color,
        badges,
        stats: getStatHighlights(ranking),
        personalityTraits: getPersonalityTraits(ranking),
        funFact: generateFunFact(ranking),
    };
}

// ─── BADGE RARITY COLORS ────────────────────────────
export const BADGE_RARITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
    bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700/50', text: 'text-amber-400' },
    silver: { bg: 'bg-slate-500/20', border: 'border-slate-400/50', text: 'text-slate-300' },
    gold: { bg: 'bg-yellow-500/20', border: 'border-yellow-400/50', text: 'text-yellow-400' },
    diamond: { bg: 'bg-cyan-500/20', border: 'border-cyan-400/50', text: 'text-cyan-300' },
};
