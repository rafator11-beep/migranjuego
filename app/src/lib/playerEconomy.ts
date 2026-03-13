/**
 * Player Economy System — XP, Levels, Coins, Shop
 */

// ─── LEVEL SYSTEM ────────────────────────────
export function xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
}

export function getLevelFromXP(xp: number): number {
    let level = 1;
    while (xp >= xpForLevel(level)) {
        xp -= xpForLevel(level);
        level++;
    }
    return level;
}

export function getXPProgress(totalXP: number): { level: number; currentXP: number; neededXP: number; percent: number } {
    let level = 1;
    let remaining = totalXP;
    while (remaining >= xpForLevel(level)) {
        remaining -= xpForLevel(level);
        level++;
    }
    const needed = xpForLevel(level);
    return {
        level,
        currentXP: remaining,
        neededXP: needed,
        percent: Math.min(100, Math.floor((remaining / needed) * 100)),
    };
}

// ─── LEVEL REWARDS ────────────────────────────
export const LEVEL_REWARDS: Record<number, { coins: number; gems?: number; item?: string; description: string }> = {
    2: { coins: 20, description: '🎉 ¡Nivel 2! +20 monedas' },
    3: { coins: 30, description: '🎊 ¡Nivel 3! +30 monedas' },
    5: { coins: 50, gems: 5, item: 'frame_gold', description: '✨ ¡Nivel 5! Marco dorado + 5 gemas' },
    7: { coins: 50, description: '🔥 ¡Nivel 7! +50 monedas' },
    10: { coins: 100, gems: 10, item: 'ficha_huesca', description: '🏟️ ¡Nivel 10! Ficha Huesca + 10 gemas' },
    12: { coins: 75, item: 'effect_confetti', description: '🎆 ¡Nivel 12! Efecto confeti' },
    15: { coins: 100, gems: 15, item: 'ficha_gold', description: '👑 ¡Nivel 15! Ficha de oro + 15 gemas' },
    18: { coins: 120, description: '💰 ¡Nivel 18! +120 monedas' },
    20: { coins: 200, gems: 20, item: 'frame_legendary', description: '💎 ¡Nivel 20! Marco LEGENDARIO + 20 gemas' },
    22: { coins: 150, item: 'badge_veteran', description: '🎖️ ¡Nivel 22! Insignia Veterano' },
    25: { coins: 250, gems: 25, item: 'crown_silver', description: '👑 ¡Nivel 25! Corona de Plata + 25 gemas' },
    28: { coins: 200, item: 'emote_fire', description: '🔥 ¡Nivel 28! Emote de Fuego' },
    30: { coins: 300, gems: 30, item: 'bg_galaxy', description: '🌌 ¡Nivel 30! Fondo Galáctico + 30 gemas' },
    33: { coins: 250, item: 'effect_lightning', description: '⚡ ¡Nivel 33! Efecto Rayo' },
    35: { coins: 350, gems: 35, item: 'crown_gold', description: '👑 ¡Nivel 35! Corona de Oro + 35 gemas' },
    38: { coins: 300, item: 'emote_champion', description: '🏆 ¡Nivel 38! Emote Campeón' },
    40: { coins: 500, gems: 50, item: 'avatar_phoenix', description: '🔥 ¡Nivel 40! Avatar Fénix + 50 gemas' },
    42: { coins: 400, item: 'bg_fire', description: '🔥 ¡Nivel 42! Fondo en Llamas' },
    45: { coins: 500, gems: 50, item: 'frame_diamond', description: '💎 ¡Nivel 45! Marco Diamante + 50 gemas' },
    50: { coins: 1000, gems: 100, item: 'crown_diamond', description: '💎👑 ¡Nivel 50! Corona Diamante + 100 gemas — ¡LEYENDA!' },
};

// ─── SHOP ITEMS ────────────────────────────
export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: 'coins' | 'gems';
    category: 'avatar' | 'ficha' | 'carta' | 'marco' | 'efecto' | 'sonido' | 'dado';
    emoji: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const SHOP_ITEMS: ShopItem[] = [
    // --- AVATARES PREMIUM ---
    { id: 'avatar_king', name: 'Rey del Party', description: 'Corona y estilo real', price: 200, currency: 'coins', category: 'avatar', emoji: '🤴', rarity: 'rare' },
    { id: 'avatar_alien', name: 'Visitante Espacial', description: 'Viene en son de fiesta', price: 300, currency: 'coins', category: 'avatar', emoji: '👽', rarity: 'epic' },
    { id: 'avatar_ninja', name: 'Ninja Oculto', description: 'Sigiloso y letal en minijuegos', price: 250, currency: 'coins', category: 'avatar', emoji: '🥷', rarity: 'rare' },
    { id: 'avatar_dragon', name: 'Dragón Milenario', description: 'Impone respeto en la sala', price: 50, currency: 'gems', category: 'avatar', emoji: '🐲', rarity: 'legendary' },
    { id: 'avatar_robot', name: 'Ciborg fiestero', description: 'Bebe aceite de motor', price: 150, currency: 'coins', category: 'avatar', emoji: '🤖', rarity: 'common' },
    { id: 'avatar_demon', name: 'Demonio VIP', description: 'Dueño del modo picante', price: 100, currency: 'gems', category: 'avatar', emoji: '😈', rarity: 'legendary' },

    // --- FICHAS DE PARCHÍS ---
    { id: 'ficha_blue', name: 'Ficha Azul Neón', description: 'Ficha con brillo neón azul', price: 50, currency: 'coins', category: 'ficha', emoji: '🔵', rarity: 'common' },
    { id: 'ficha_red_velvet', name: 'Terciopelo Rojo', description: 'Ficha de textura suave', price: 75, currency: 'coins', category: 'ficha', emoji: '🔴', rarity: 'common' },
    { id: 'ficha_fire', name: 'Ficha de Fuego', description: 'Deja una estela de fuego', price: 100, currency: 'coins', category: 'ficha', emoji: '🔥', rarity: 'rare' },
    { id: 'ficha_ice', name: 'Ficha de Hielo', description: 'Congela por donde pasa', price: 100, currency: 'coins', category: 'ficha', emoji: '❄️', rarity: 'rare' },
    { id: 'ficha_huesca', name: 'SD Huesca', description: 'Con el escudo del Huesca', price: 150, currency: 'coins', category: 'ficha', emoji: '🏟️', rarity: 'epic' },
    { id: 'ficha_madrid', name: 'Real Madrid', description: 'Escudo blanco y dorado', price: 300, currency: 'coins', category: 'ficha', emoji: '🛡️', rarity: 'epic' },
    { id: 'ficha_barca', name: 'FC Barcelona', description: 'Escudo azulgrana', price: 300, currency: 'coins', category: 'ficha', emoji: '🛡️', rarity: 'epic' },
    { id: 'ficha_betis', name: 'Real Betis', description: 'Musho Betis', price: 200, currency: 'coins', category: 'ficha', emoji: '🟢', rarity: 'rare' },
    { id: 'ficha_atleti', name: 'Atlético de Madrid', description: 'Coraje y corazón', price: 250, currency: 'coins', category: 'ficha', emoji: '🔴', rarity: 'epic' },
    { id: 'ficha_ninja', name: 'Estrella Ninja', description: 'Ficha con forma de shuriken', price: 200, currency: 'coins', category: 'ficha', emoji: '🥷', rarity: 'epic' },
    { id: 'ficha_gold', name: 'Ficha de Oro', description: 'Ficha dorada brillante', price: 300, currency: 'coins', category: 'ficha', emoji: '👑', rarity: 'legendary' },
    { id: 'ficha_diamond', name: 'Ficha Diamante', description: 'Efecto cristal premium', price: 50, currency: 'gems', category: 'ficha', emoji: '💎', rarity: 'legendary' },
    { id: 'ficha_hologram', name: 'Ficha Holograma', description: 'Translúcida del futuro', price: 75, currency: 'gems', category: 'ficha', emoji: '🛸', rarity: 'legendary' },

    // --- REVERSOS DE CARTAS (POKER) ---
    { id: 'carta_roja', name: 'Dorso Rojo Clásico', description: 'El de toda la vida', price: 50, currency: 'coins', category: 'carta', emoji: '🃏', rarity: 'common' },
    { id: 'carta_negra', name: 'Negro Mate', description: 'Elegancia en la mesa', price: 150, currency: 'coins', category: 'carta', emoji: '♠️', rarity: 'rare' },
    { id: 'carta_neon', name: 'Ciberpunk', description: 'Bordes brillantes de neón', price: 300, currency: 'coins', category: 'carta', emoji: '🌃', rarity: 'epic' },
    { id: 'carta_fuego', name: 'Cartas en Llamas', description: 'Queman al tocarlas', price: 500, currency: 'coins', category: 'carta', emoji: '🔥', rarity: 'legendary' },
    { id: 'carta_oro', name: 'Láminas de Oro 24K', description: 'Para auténticos High Rollers', price: 100, currency: 'gems', category: 'carta', emoji: '💰', rarity: 'legendary' },
    { id: 'carta_magica', name: 'Tarot Místico', description: 'Cartas con movimiento interior', price: 150, currency: 'gems', category: 'carta', emoji: '🔮', rarity: 'legendary' },
    { id: 'ficha_diamond', name: 'Ficha Diamante', description: 'Efecto cristal premium', price: 50, currency: 'gems', category: 'ficha', emoji: '💎', rarity: 'legendary' },
    { id: 'ficha_hologram', name: 'Ficha Holograma', description: 'Translúcida del futuro', price: 75, currency: 'gems', category: 'ficha', emoji: '🛸', rarity: 'legendary' },

    // --- MARCOS DE AVATAR ---
    { id: 'frame_silver', name: 'Marco Plata', description: 'Borde plateado para tu avatar', price: 75, currency: 'coins', category: 'marco', emoji: '🪞', rarity: 'common' },
    { id: 'frame_wood', name: 'Marco Roble', description: 'Borde de madera rústica', price: 80, currency: 'coins', category: 'marco', emoji: '🪵', rarity: 'common' },
    { id: 'frame_gold', name: 'Marco Dorado', description: 'Borde dorado premium', price: 150, currency: 'coins', category: 'marco', emoji: '✨', rarity: 'rare' },
    { id: 'frame_neon_pink', name: 'Neón Rosa', description: 'Marco ciberpunk iluminado', price: 180, currency: 'coins', category: 'marco', emoji: '🎀', rarity: 'rare' },
    { id: 'frame_animated', name: 'Marco Animado', description: 'Marco con animación rotatoria', price: 250, currency: 'coins', category: 'marco', emoji: '🌀', rarity: 'epic' },
    { id: 'frame_vampire', name: 'Marco Vampiro', description: 'Marco gótico de sangre', price: 300, currency: 'coins', category: 'marco', emoji: '🧛', rarity: 'epic' },
    { id: 'frame_legendary', name: 'Marco Legendario', description: 'Aura de fuego legendario', price: 500, currency: 'coins', category: 'marco', emoji: '🔥', rarity: 'legendary' },
    { id: 'frame_cosmos', name: 'Marco Cosmos', description: 'Galaxia estrellas en movimiento', price: 100, currency: 'gems', category: 'marco', emoji: '🌌', rarity: 'legendary' },

    // --- DADOS (NUEVO) ---
    { id: 'dice_classic_red', name: 'Dado Rojo', description: 'Dado clásico de casino', price: 50, currency: 'coins', category: 'dado', emoji: '🎲', rarity: 'common' },
    { id: 'dice_bone', name: 'Dado de Hueso', description: 'Dado rudimentario antiguo', price: 120, currency: 'coins', category: 'dado', emoji: '☠️', rarity: 'rare' },
    { id: 'dice_crystal', name: 'Dado de Cristal', description: 'Dado semitransparente', price: 250, currency: 'coins', category: 'dado', emoji: '🔮', rarity: 'epic' },
    { id: 'dice_gold', name: 'Dado de Oro', description: 'Dado metálico de 24k', price: 500, currency: 'coins', category: 'dado', emoji: '💰', rarity: 'legendary' },
    { id: 'dice_huesca', name: 'Dado SD Huesca', description: 'Conmemorativo azulgrana', price: 40, currency: 'gems', category: 'dado', emoji: '🏟️', rarity: 'epic' },
    { id: 'dice_nebula', name: 'Dado Cósmico', description: 'Tirada desde el universo', price: 80, currency: 'gems', category: 'dado', emoji: '☄️', rarity: 'legendary' },

    // --- EFECTOS DE CELEBRACIÓN ---
    { id: 'effect_confetti', name: 'Confeti', description: 'Lluvia de confeti al ganar', price: 100, currency: 'coins', category: 'efecto', emoji: '🎊', rarity: 'common' },
    { id: 'effect_balloons', name: 'Globos', description: 'Suben globos al terminar', price: 120, currency: 'coins', category: 'efecto', emoji: '🎈', rarity: 'common' },
    { id: 'effect_fireworks', name: 'Fuegos Artificiales', description: 'Explosión de colores', price: 200, currency: 'coins', category: 'efecto', emoji: '🎆', rarity: 'rare' },
    { id: 'effect_money_rain', name: 'Lluvia Billetes', description: 'Que llueva el dinero', price: 250, currency: 'coins', category: 'efecto', emoji: '💸', rarity: 'epic' },
    { id: 'effect_crown', name: 'Coronación', description: 'Corona que baja del cielo', price: 300, currency: 'coins', category: 'efecto', emoji: '👑', rarity: 'epic' },
    { id: 'effect_dragon', name: 'Dragón', description: 'Fuego legendario de dragón', price: 120, currency: 'gems', category: 'efecto', emoji: '🐉', rarity: 'legendary' },

    // --- SONIDOS ---
    { id: 'sound_airhorn', name: 'Bocina', description: 'Suena bocina al ganar', price: 50, currency: 'coins', category: 'sonido', emoji: '📢', rarity: 'common' },
    { id: 'sound_tada', name: 'Ta-Da!', description: 'Sonido de magia', price: 60, currency: 'coins', category: 'sonido', emoji: '🪄', rarity: 'common' },
    { id: 'sound_troll', name: 'Troll (Nelson)', description: 'Sonido troll épico', price: 75, currency: 'coins', category: 'sonido', emoji: '😈', rarity: 'rare' },
    { id: 'sound_mariachi', name: 'Mariachi', description: 'Música mexicana', price: 100, currency: 'coins', category: 'sonido', emoji: '🎺', rarity: 'rare' },
    { id: 'sound_inception', name: 'Inception Brass', description: 'Sonido épico de cine', price: 150, currency: 'coins', category: 'sonido', emoji: '📯', rarity: 'epic' },
    { id: 'sound_choir', name: 'Coro Angelical', description: 'Alabad al campeón', price: 20, currency: 'gems', category: 'sonido', emoji: '👼', rarity: 'legendary' },

    // --- EMOTES ---
    { id: 'emote_fire', name: 'Emote Fuego', description: 'Emoji animado de fuego', price: 80, currency: 'coins', category: 'efecto', emoji: '🔥', rarity: 'common' },
    { id: 'emote_laugh', name: 'Emote Carcajada', description: 'Risa explosiva animada', price: 80, currency: 'coins', category: 'efecto', emoji: '😂', rarity: 'common' },
    { id: 'emote_champion', name: 'Emote Campeón', description: 'Trofeo animado exclusivo', price: 200, currency: 'coins', category: 'efecto', emoji: '🏆', rarity: 'epic' },
    { id: 'emote_skull', name: 'Emote Calavera', description: 'Para cuando te eliminan', price: 120, currency: 'coins', category: 'efecto', emoji: '💀', rarity: 'rare' },
    { id: 'emote_heart', name: 'Emote Corazón', description: 'Lluvia de corazones', price: 100, currency: 'coins', category: 'efecto', emoji: '❤️', rarity: 'rare' },

    // --- INSIGNIAS (BADGES) ---
    { id: 'badge_veteran', name: 'Insignia Veterano', description: 'Para jugadores con experiencia', price: 150, currency: 'coins', category: 'marco', emoji: '🎖️', rarity: 'rare' },
    { id: 'badge_pro', name: 'Insignia Pro', description: 'Demuestra que eres pro', price: 250, currency: 'coins', category: 'marco', emoji: '⭐', rarity: 'epic' },
    { id: 'badge_legend', name: 'Insignia Leyenda', description: 'Solo para los mejores', price: 80, currency: 'gems', category: 'marco', emoji: '🌟', rarity: 'legendary' },

    // --- CORONAS ---
    { id: 'crown_silver', name: 'Corona Plata', description: 'Corona plateada elegante', price: 200, currency: 'coins', category: 'marco', emoji: '👑', rarity: 'rare' },
    { id: 'crown_gold', name: 'Corona Oro', description: 'Corona dorada de rey', price: 400, currency: 'coins', category: 'marco', emoji: '👑', rarity: 'epic' },
    { id: 'crown_diamond', name: 'Corona Diamante', description: 'La corona definitiva', price: 150, currency: 'gems', category: 'marco', emoji: '💎', rarity: 'legendary' },

    // --- FONDOS DE PERFIL ---
    { id: 'bg_galaxy', name: 'Fondo Galáctico', description: 'Estrellas y nebulosas en tu perfil', price: 300, currency: 'coins', category: 'efecto', emoji: '🌌', rarity: 'epic' },
    { id: 'bg_fire', name: 'Fondo en Llamas', description: 'Fuego ardiente detrás de tu avatar', price: 350, currency: 'coins', category: 'efecto', emoji: '🔥', rarity: 'epic' },
    { id: 'bg_ocean', name: 'Fondo Océano', description: 'Olas y burbujas animadas', price: 250, currency: 'coins', category: 'efecto', emoji: '🌊', rarity: 'rare' },
    { id: 'bg_matrix', name: 'Fondo Matrix', description: 'Código verde cayendo', price: 60, currency: 'gems', category: 'efecto', emoji: '💻', rarity: 'legendary' },
    { id: 'bg_aurora', name: 'Aurora Boreal', description: 'Luces del norte resplandecientes', price: 90, currency: 'gems', category: 'efecto', emoji: '✨', rarity: 'legendary' },

    // --- AVATARES EXTRA ---
    { id: 'avatar_pirate', name: 'Pirata Festivo', description: 'Capitán de la fiesta', price: 180, currency: 'coins', category: 'avatar', emoji: '🏴‍☠️', rarity: 'rare' },
    { id: 'avatar_wizard', name: 'Mago Supremo', description: 'Domina la magia del juego', price: 350, currency: 'coins', category: 'avatar', emoji: '🧙', rarity: 'epic' },
    { id: 'avatar_ghost', name: 'Fantasma VIP', description: 'Aparece y desaparece en las partidas', price: 200, currency: 'coins', category: 'avatar', emoji: '👻', rarity: 'rare' },
    { id: 'avatar_phoenix', name: 'Fénix Renacido', description: 'Renace de sus cenizas', price: 120, currency: 'gems', category: 'avatar', emoji: '🔥', rarity: 'legendary' },
    { id: 'avatar_unicorn', name: 'Unicornio Mágico', description: 'Pura magia y diversión', price: 80, currency: 'gems', category: 'avatar', emoji: '🦄', rarity: 'legendary' },

    // --- DADOS EXTRA ---
    { id: 'dice_star', name: 'Dado Estrella', description: 'Brilla con cada tirada', price: 180, currency: 'coins', category: 'dado', emoji: '⭐', rarity: 'rare' },
    { id: 'dice_rainbow', name: 'Dado Arcoíris', description: 'Colores diferentes en cada cara', price: 280, currency: 'coins', category: 'dado', emoji: '🌈', rarity: 'epic' },
    { id: 'dice_dragon', name: 'Dado Dragón', description: 'Forjado en fuego de dragón', price: 60, currency: 'gems', category: 'dado', emoji: '🐉', rarity: 'legendary' },
];


// ─── COIN REWARDS by mode ────────────────────────────
export const COIN_REWARDS: Record<string, { win: number; lose: number; label: string; xp: number }> = {
    megamix: { win: 15, lose: 3, label: '🎲 Megamix', xp: 25 },
    clasico: { win: 10, lose: 2, label: '🍻 Clásico', xp: 20 },
    picante: { win: 10, lose: 2, label: '🌶️ Picante', xp: 20 },
    poker: { win: 20, lose: 2, label: '🃏 Poker', xp: 30 },
    parchis: { win: 25, lose: 3, label: '🎯 Parchís', xp: 35 },
    trivia_futbol: { win: 12, lose: 2, label: '⚽ Trivia Fútbol', xp: 15 },
    cultura: { win: 12, lose: 2, label: '📚 Trivia Cultura', xp: 15 },
    yo_nunca: { win: 8, lose: 1, label: '🙈 Yo Nunca', xp: 10 },
    votacion: { win: 8, lose: 1, label: '🗳️ Votación', xp: 10 },
    espana: { win: 10, lose: 2, label: '🇪🇸 España', xp: 15 },
    pacovers: { win: 10, lose: 2, label: '🇪🇸 Pacoversos', xp: 15 },
    futbol: { win: 12, lose: 2, label: '⚽ Fútbol', xp: 15 },
    arcade: { win: 5, lose: 0, label: '🕹️ Arcade', xp: 10 },
};

// ─── DAILY REWARD (with streak) ────────────────────────────
const DAILY_KEY = 'fiesta-daily-reward-v1';
const STREAK_KEY = 'fiesta-daily-streak';

export function getDailyStreak(): number {
    try {
        return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
    } catch { return 0; }
}

export function canClaimDailyReward(): boolean {
    try {
        const last = localStorage.getItem(DAILY_KEY);
        if (!last) return true;
        const lastDate = new Date(last).toDateString();
        const today = new Date().toDateString();
        return lastDate !== today;
    } catch { return true; }
}

export function claimDailyReward(): { coins: number; gems: number; streak: number } {
    const streak = getDailyStreak() + 1;
    // Streak bonuses: every 7 days = gems bonus
    const baseCoins = 10 + Math.floor(Math.random() * 11); // 10-20
    const streakBonus = Math.floor(streak / 3) * 5; // +5 per 3 days
    const coins = baseCoins + streakBonus;
    const gems = streak % 7 === 0 ? 5 + Math.floor(streak / 7) * 3 : 0; // Every 7 days
    localStorage.setItem(DAILY_KEY, new Date().toISOString());
    localStorage.setItem(STREAK_KEY, streak.toString());
    return { coins, gems, streak };
}

// ─── DAILY MISSIONS ────────────────────────────
export interface DailyMission {
    id: string;
    title: string;
    description: string;
    target: number;
    reward: { coins?: number; gems?: number };
    icon: string;
}

const ALL_MISSIONS: DailyMission[] = [
    { id: 'play_3', title: 'Jugador Activo', description: 'Juega 3 partidas', target: 3, reward: { coins: 30 }, icon: '🎮' },
    { id: 'play_5', title: 'Maratón', description: 'Juega 5 partidas', target: 5, reward: { coins: 50, gems: 2 }, icon: '🏃' },
    { id: 'win_1', title: 'Victoria', description: 'Gana 1 partida', target: 1, reward: { coins: 25 }, icon: '🏆' },
    { id: 'win_3', title: 'Racha de Victorias', description: 'Gana 3 partidas', target: 3, reward: { coins: 60, gems: 3 }, icon: '🔥' },
    { id: 'arcade_2', title: 'Arcade Fan', description: 'Juega 2 minijuegos arcade', target: 2, reward: { coins: 20 }, icon: '🕹️' },
    { id: 'arcade_5', title: 'Rey del Arcade', description: 'Juega 5 minijuegos arcade', target: 5, reward: { coins: 40, gems: 2 }, icon: '👑' },
    { id: 'spin', title: 'Gira la Ruleta', description: 'Usa la ruleta diaria', target: 1, reward: { coins: 10 }, icon: '🎡' },
    { id: 'trivia_5', title: 'Cerebrito', description: 'Acierta 5 preguntas de trivia', target: 5, reward: { coins: 35, gems: 1 }, icon: '🧠' },
    { id: 'trivia_10', title: 'Genio', description: 'Acierta 10 preguntas de trivia', target: 10, reward: { coins: 70, gems: 5 }, icon: '🎓' },
    { id: 'poker_1', title: 'Jugador de Poker', description: 'Juega 1 partida de poker', target: 1, reward: { coins: 15 }, icon: '🃏' },
    { id: 'parchis_1', title: 'Jugador de Parchís', description: 'Juega 1 partida de parchís', target: 1, reward: { coins: 15 }, icon: '🎯' },
    { id: 'shop_1', title: 'Comprador', description: 'Compra 1 item en la tienda', target: 1, reward: { gems: 3 }, icon: '🛒' },
];

const MISSIONS_KEY = 'fiesta-daily-missions';

export function getTodayMissions(): { mission: DailyMission; progress: number; claimed: boolean }[] {
    const today = new Date().toDateString();
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (raw) {
        try {
            const data = JSON.parse(raw);
            if (data.date === today) return data.missions;
        } catch { }
    }
    // Generate 3 random missions for today
    const shuffled = [...ALL_MISSIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).map(m => ({ mission: m, progress: 0, claimed: false }));
    localStorage.setItem(MISSIONS_KEY, JSON.stringify({ date: today, missions: selected }));
    return selected;
}

export function updateMissionProgress(missionId: string, increment: number = 1): void {
    const today = new Date().toDateString();
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (data.date !== today) return;
        const mission = data.missions.find((m: any) => m.mission.id === missionId);
        if (mission && !mission.claimed) {
            mission.progress = Math.min(mission.progress + increment, mission.mission.target);
            localStorage.setItem(MISSIONS_KEY, JSON.stringify(data));
        }
    } catch { }
}

export function claimMissionReward(missionId: string): { coins: number; gems: number } | null {
    const today = new Date().toDateString();
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        if (data.date !== today) return null;
        const mission = data.missions.find((m: any) => m.mission.id === missionId);
        if (mission && !mission.claimed && mission.progress >= mission.mission.target) {
            mission.claimed = true;
            localStorage.setItem(MISSIONS_KEY, JSON.stringify(data));
            return { coins: mission.mission.reward.coins || 0, gems: mission.mission.reward.gems || 0 };
        }
    } catch { }
    return null;
}

// ─── PURCHASE ITEM ────────────────────────────
export function purchaseItem(
    playerCoins: number,
    playerGems: number,
    item: ShopItem,
    unlockedItems: string[]
): { success: boolean; newCoins: number; newGems: number; error?: string } {
    if (unlockedItems.includes(item.id)) {
        return { success: false, newCoins: playerCoins, newGems: playerGems, error: 'Ya tienes este item' };
    }

    const isGems = item.currency === 'gems';

    if (isGems) {
        if (playerGems < item.price) {
            return { success: false, newCoins: playerCoins, newGems: playerGems, error: `Necesitas ${item.price - playerGems} gemas más` };
        }
        return { success: true, newCoins: playerCoins, newGems: playerGems - item.price };
    } else {
        if (playerCoins < item.price) {
            return { success: false, newCoins: playerCoins, newGems: playerGems, error: `Necesitas ${item.price - playerCoins} monedas más` };
        }
        return { success: true, newCoins: playerCoins - item.price, newGems: playerGems };
    }
}

// ─── RARITY COLORS ────────────────────────────
export const RARITY_COLORS: Record<string, string> = {
    common: 'border-gray-400 bg-gray-500/10',
    rare: 'border-blue-400 bg-blue-500/10',
    epic: 'border-purple-400 bg-purple-500/10',
    legendary: 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
};

export const RARITY_LABELS: Record<string, string> = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
};
