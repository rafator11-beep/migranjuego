export type GameMode = 'futbol' | 'megamix' | 'clasico' | 'yo_nunca' | 'yo_nunca_equipos' | 'picante' | 'cultura' | 'espana' | 'votacion' | 'pacovers' | 'trivia_futbol' | 'tictactoe' | 'poker' | 'parchis' | 'megaboard';
export type TabId = 'fiesta' | 'juego';
export type PlayMode = 'local' | 'online';

export enum ModeId {
  // Fiesta
  MEGAMIX = 'megamix',
  CLASICO = 'clasico',
  YONUNCA = 'yo_nunca',
  YONUNCAEQUIPOS = 'yo_nunca_equipos',
  PICANTE = 'picante',
  ESPANA = 'espana',
  PROBABLE = 'votacion',
  COVERS = 'pacovers',

  // Juego
  CULTURA = 'cultura',
  FUTBOL = 'futbol', // Tic Tac Toe
  TRIVIAOS = 'trivia_futbol',
  TICTACTOE = 'tictactoe',
  POKER = 'poker',
  PARCHIS = 'parchis',
  MEGABOARD = 'megaboard'
}

export const TAB_MAPPING: Record<TabId, GameMode[]> = {
  fiesta: ['megamix', 'clasico', 'yo_nunca', 'yo_nunca_equipos', 'picante', 'espana', 'votacion', 'pacovers'],
  juego: ['cultura', 'trivia_futbol', 'futbol', 'tictactoe', 'poker', 'parchis', 'megaboard']
};
export type GameStatus = 'setup' | 'playing' | 'round_end' | 'finished';
export type QuestionType = 'test' | 'open' | 'true_false' | 'social' | 'reto' | 'yo_nunca' | 'votacion' | 'accion';

export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  current_round: number;
  current_turn: number;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  avatar_url: string | null;
  team_id: string | null;
  score: number;
  has_played_this_round: boolean;
  turn_order: number;
  created_at: string;
}

export interface Team {
  id: string;
  game_id: string;
  name: string;
  color: string;
  score: number;
  created_at: string;
}

export interface Question {
  id: string;
  mode: GameMode;
  category: string;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string | null;
  difficulty: number;
  created_at: string;
}

export interface UsedQuestion {
  id: string;
  game_id: string;
  question_id: string;
  round_number: number;
  answered_by: string | null;
  was_correct: boolean | null;
  created_at: string;
}

export interface TicTacToeState {
  id: string;
  game_id: string;
  board: (string | null)[][];
  current_player_index: number;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoundHistory {
  id: string;
  game_id: string;
  round_number: number;
  winner_player_id: string | null;
  winner_team_id: string | null;
  summary: Record<string, unknown> | null;
  created_at: string;
}

export interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  teamBased: boolean;
  badge?: string;
  adultOnly?: boolean;
}

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'megamix',
    name: 'MEGAMIX',
    description: 'Mezcla de todos los modos - caos total con normas',
    icon: '🎲',
    color: 'from-pink-500 to-purple-600',
    teamBased: false,
    badge: 'RECOMENDADO',
  },
  {
    id: 'clasico',
    name: 'Clásico',
    description: 'Retos y pruebas mixtas tradicionales',
    icon: '🎯',
    color: 'from-green-500 to-emerald-600',
    teamBased: false,
  },
  {
    id: 'yo_nunca',
    name: 'Yo Nunca',
    description: 'Confiesa o bebe - clásico de fiestas',
    icon: '🙈',
    color: 'from-cyan-500 to-blue-600',
    teamBased: false,
  },
  {
    id: 'yo_nunca_equipos',
    name: 'Yo Nunca (Equipos)',
    description: '¡NUEVO! Puesta en común por equipos - Adivina quién lo hizo',
    icon: '👥',
    color: 'from-blue-500 to-indigo-600',
    teamBased: true,
    badge: 'NUEVO',
  },
  {
    id: 'picante',
    name: 'Picante +18',
    description: 'Solo para adultos atrevidos',
    icon: '🌶️',
    color: 'from-purple-500 to-pink-600',
    teamBased: false,
    adultOnly: true,
  },
  {
    id: 'cultura',
    name: 'Cultura General',
    description: '¿Sabes más que un niño de primaria? 1vs1 o equipos',
    icon: '🧠',
    color: 'from-pink-500 to-rose-600',
    teamBased: true,
    badge: 'NUEVO',
  },
  {
    id: 'espana',
    name: 'España Nostálgica',
    description: 'Recuerdos de la infancia española',
    icon: '🇪🇸',
    color: 'from-red-500 to-yellow-500',
    teamBased: false,
  },
  {
    id: 'votacion',
    name: 'Quién es más probable',
    description: 'Votaciones grupales divertidas',
    icon: '🗳️',
    color: 'from-violet-500 to-purple-600',
    teamBased: false,
  },
  {
    id: 'pacovers',
    name: 'Pacovers / Veteranos',
    description: 'Para los que ya no son tan jóvenes',
    icon: '👴',
    color: 'from-amber-500 to-orange-600',
    teamBased: false,
  },
  {
    id: 'trivia_futbol',
    name: 'Fútbol Trivia',
    description: '500+ preguntas de las 4 grandes ligas. 1vs1 o equipos',
    icon: '⚽',
    color: 'from-green-500 to-lime-600',
    teamBased: true,
    badge: 'NUEVO',
  },
  {
    id: 'futbol',
    name: 'Tic Tac Toe Fútbol',
    description: 'Tres en raya con preguntas. 1vs1 o equipos',
    icon: '⚽',
    color: 'from-cyan-500 to-teal-600',
    teamBased: true,
    badge: 'NUEVO',
  },
  {
    id: 'poker',
    name: 'Poker Online',
    description: 'Texas Hold\'em con videollamada',
    icon: '🃏',
    color: 'from-slate-700 to-zinc-900',
    teamBased: false,
    badge: 'NUEVO',
  },
  {
    id: 'parchis',
    name: 'Parchís Huesca',
    description: 'Parchís online temático del SD Huesca',
    icon: '🎲',
    color: 'from-blue-600 to-red-600',
    teamBased: false,
    badge: 'NUEVO',
  },
  {
    id: 'megaboard',
    name: 'MegaBoard 3D',
    description: 'Tablero tipo Oca con 100 casillas, retos y pruebas épicas',
    icon: '🏰',
    color: 'from-amber-500 to-rose-600',
    teamBased: false,
    badge: 'NUEVO',
  }
];

export const TEAM_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

// Settings interface
export interface Settings {
  confettiEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  intensity: 'low' | 'medium' | 'high';
}

// Player virus effect
export interface PlayerVirus {
  playerId: string;
  virusName: string;
  virusDescription: string;
  turnsRemaining: number;
}
