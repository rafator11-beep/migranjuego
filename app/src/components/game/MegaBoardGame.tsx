import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trophy, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RewardPopup } from './RewardPopup';
import { loadLocalRankings } from '@/utils/localRanking';
import { shuffleArray, getRandomWithoutRepeat, resetSessionTracker } from '@/utils/shuffleUtils';
import {
  clasico,
  yoNunca,
  quienEsMasProbable,
  normasRonda,
} from '@/data/gameContent';
import { duelos } from '@/data/duelosContent';
import { mimicaChallenges } from '@/data/mimicaContent';
import { cultureQuestionsNew2025 } from '@/data/cultureQuestionsNew2025';
import { useRanking } from '@/hooks/useRanking';

// ─── Tile Types & Content ─────────────────────────────────────────────────────
type TileType = 'start' | 'challenge' | 'trivia' | 'duel' | 'drink' | 'bonus' | 'trap' | 'mimica' | 'random' | 'norma' | 'finish' | 'oca' | 'puente' | 'posada' | 'pozo' | 'laberinto' | 'carcel' | 'calavera';

interface BoardTile {
  id: number;
  type: TileType;
  label: string;
  emoji: string;
  color: string;
}

const TILE_CONFIG: Record<TileType, { emoji: string; color: string; label: string }> = {
  start:     { emoji: '🏠', color: 'from-green-400 to-emerald-500', label: 'Salida' },
  challenge: { emoji: '🎯', color: 'from-blue-400 to-indigo-500', label: 'Reto' },
  trivia:    { emoji: '🧠', color: 'from-pink-400 to-rose-500', label: 'Trivia' },
  duel:      { emoji: '⚔️', color: 'from-red-400 to-orange-500', label: 'Duelo' },
  drink:     { emoji: '🍺', color: 'from-amber-400 to-yellow-500', label: 'Tragos' },
  bonus:     { emoji: '⭐', color: 'from-yellow-300 to-amber-400', label: 'Bonus' },
  trap:      { emoji: '💀', color: 'from-gray-600 to-gray-800', label: 'Trampa' },
  mimica:    { emoji: '🎭', color: 'from-purple-400 to-violet-500', label: 'Mímica' },
  random:    { emoji: '🎲', color: 'from-cyan-400 to-teal-500', label: 'Azar' },
  norma:     { emoji: '📜', color: 'from-orange-400 to-red-500', label: 'Norma' },
  finish:    { emoji: '🏆', color: 'from-yellow-400 to-amber-600', label: 'Meta' },
  oca:       { emoji: '🦢', color: 'from-white to-gray-200', label: 'Oca' },
  puente:    { emoji: '🌉', color: 'from-stone-400 to-stone-600', label: 'Puente' },
  posada:    { emoji: '🏨', color: 'from-amber-700 to-amber-900', label: 'Posada' },
  pozo:      { emoji: '🕳️', color: 'from-blue-800 to-indigo-900', label: 'Pozo' },
  laberinto: { emoji: '🧭', color: 'from-green-700 to-green-900', label: 'Laberinto' },
  carcel:    { emoji: '⛓️', color: 'from-slate-700 to-slate-900', label: 'Cárcel' },
  calavera:  { emoji: '☠️', color: 'from-black to-gray-900', label: 'Muerte' },
};

const ocaTilesList = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59, 63, 68, 72, 77, 81, 86, 90, 95];

const MAX_MEGABOARD_PLAYERS = 20;
const MAX_TILE_AVATARS = 4;

// Generate 100-tile board with varied tile distribution
function generateBoard(): BoardTile[] {
  const tileSequence: TileType[] = [
    'drink', 'challenge', 'drink', 'drink', 'trivia',
    'drink', 'duel', 'drink', 'bonus', 'drink',
    'drink', 'mimica', 'drink', 'drink', 'random',
    'drink', 'norma', 'drink', 'trap', 'drink',
  ];

  const tiles: BoardTile[] = [{ id: 0, type: 'start', ...TILE_CONFIG.start }];

  for (let i = 1; i < 99; i++) {
    const type = tileSequence[i % tileSequence.length];
    const cfg = TILE_CONFIG[type];
    tiles.push({ id: i, type, label: cfg.label, emoji: cfg.emoji, color: cfg.color });
  }

  // Inject Classic Oca Tiles
  ocaTilesList.forEach(i => {
    if (i < 99) tiles[i] = { id: i, type: 'oca', ...TILE_CONFIG.oca };
  });
  tiles[6] = { id: 6, type: 'puente', ...TILE_CONFIG.puente };
  tiles[12] = { id: 12, type: 'puente', ...TILE_CONFIG.puente };
  tiles[19] = { id: 19, type: 'posada', ...TILE_CONFIG.posada };
  tiles[31] = { id: 31, type: 'pozo', ...TILE_CONFIG.pozo };
  tiles[42] = { id: 42, type: 'laberinto', ...TILE_CONFIG.laberinto };
  tiles[56] = { id: 56, type: 'carcel', ...TILE_CONFIG.carcel };
  tiles[58] = { id: 58, type: 'calavera', ...TILE_CONFIG.calavera };

  tiles.push({ id: 99, type: 'finish', ...TILE_CONFIG.finish });
  return tiles;
}

// ─── Drink/Party Content for tiles ────────────────────────────────────────────
const DRINK_EVENTS = [
  "🍻 Todos beben 2 tragos.",
  "🍺 El jugador actual bebe 2 tragos y reparte 2 más.",
  "🥂 Brindis general: nadie se libra, todos 1 trago.",
  "🍹 Elige a dos personas para que beban 2 tragos cada una.",
  "🍺 El de tu izquierda y tú bebéis 2 tragos.",
  "🥃 Si no haces un mini discurso, bebes 3 tragos.",
  "🍻 Ronda rápida: todos 2 tragos seguidos.",
  "🍺 Reparte 4 tragos como quieras.",
  "🥂 El último en levantar el vaso bebe 3 tragos.",
  "🍹 Tu eliges: bebes 3 o repartes 5.",
  "🍺 El más alto, el más bajo y tú bebéis 2 tragos.",
  "🍻 Cascada: empieza el jugador actual y todos le siguen.",
  "🥃 Fondo corto o 4 tragos. Tú decides.",
  "🍺 Si te ríes antes de acabar la ronda, bebes 2 más. Empieza bebiendo 2.",
  "👑 El jugador actual reparte 6 tragos entre el grupo.",
  "🍻 Todos los que lleven móvil cerca beben 2 tragos.",
  "🥂 Choque de vasos y 2 tragos cada uno.",
  "🍺 Elige a alguien para un duelo: quien pierda bebe 4 tragos.",
  "🍹 Ronda de castigo: todos 1 trago y tú 2 extra.",
  "🥃 El grupo decide si bebes 2 o 4 tragos.",
];

const BONUS_EVENTS = [
  "⭐ ¡Avanza 3 casillas extra!",
  "⭐ ¡Tira otra vez!",
  "⭐ Eres inmune al próximo trap. ¡Escudo activado!",
  "⭐ ¡Doble XP en esta ronda! (+20 puntos extra)",
  "⭐ Elige a un jugador y retrocédelo 2 casillas.",
  "⭐ ¡Comodín! Puedes saltarte la próxima casilla negativa.",
  "⭐ ¡Roba 5 puntos de XP a otro jugador!",
];

const TRAP_EVENTS = [
  "💀 ¡Retrocede 3 casillas!",
  "💀 Pierdes tu próximo turno.",
  "💀 Bebe 3 tragos y retrocede 1 casilla.",
  "💀 Todos te señalan y bebes 2 tragos.",
  "💀 Vuelves a la casilla 1! (si estás antes de la 20, solo retrocedes 5)",
  "💀 Haz 10 sentadillas o bebe 5 tragos.",
  "💀 El grupo te pone un mote. Te llaman así hasta que acabe la partida.",
];

const RANDOM_EVENTS = [
  "🎲 ¡Cambio de posiciones! Los dos jugadores más adelantados intercambian lugar.",
  "🎲 Todos tiran un dado imaginario (di un número del 1-6). El más alto avanza 2 extra.",
  "🎲 El jugador decide: ¿doble o nada? Tira otro dado. Si es par, avanza el doble. Si es impar, retrocede.",
  "🎲 ¡Tormenta! Todos retroceden 1 casilla excepto el jugador actual.",
  "🎲 Reto relámpago: di 5 países en 10 segundos o pierdes tu turno.",
  "🎲 ¡Intercambio! Cambia posición con el jugador de tu izquierda.",
  "🎲 Lotería: si el dado salió par, ganas 15 XP. Si salió impar, pierdes 10.",
];

// ─── Player Interface ─────────────────────────────────────────────────────────
interface MBPlayer {
  id: string;
  name: string;
  avatarUrl?: string;
  position: number;
  score: number;
  skipNextTurn: boolean;
  shielded: boolean;
}

interface MegaBoardGameProps {
  onExit: () => void;
  localPlayerName: string;
  localPlayerAvatar?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MegaBoardGame({ onExit, localPlayerName, localPlayerAvatar }: MegaBoardGameProps) {
  const [board] = useState<BoardTile[]>(() => generateBoard());
  const [players, setPlayers] = useState<MBPlayer[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'event' | 'finished'>('setup');
  const [eventText, setEventText] = useState('');
  const [eventEmoji, setEventEmoji] = useState('');
  const [eventType, setEventType] = useState<'info' | 'challenge' | 'duel' | 'trivia' | 'roll_again'>('info');
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({ coins: 0, xp: 0, oldLevel: 1, newLevel: 1, streak: 0 });
  const [setupNames, setSetupNames] = useState<string[]>([localPlayerName, '']);
  const [triviaQuestion, setTriviaQuestion] = useState<any>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [activeNorma, setActiveNorma] = useState<string | null>(null);
  const { updateMultiplePlayers } = useRanking();

  const currentPlayer = players[currentPlayerIdx];

  // Reset session trackers on mount
  useEffect(() => {
    resetSessionTracker('megaboard_challenge');
    resetSessionTracker('megaboard_drink');
    resetSessionTracker('megaboard_trivia');
    resetSessionTracker('megaboard_duel');
    resetSessionTracker('megaboard_mimica');
  }, []);

  const startGame = () => {
    const activePlayers = setupNames
      .filter(n => n.trim().length > 0)
      .map((name, i) => ({
        id: `p${i}`,
        name: name.trim(),
        avatarUrl: i === 0 ? localPlayerAvatar : undefined,
        position: 0,
        score: 0,
        skipNextTurn: false,
        shielded: false,
      }));
    if (activePlayers.length < 2) {
      toast.error('Necesitas al menos 2 jugadores.');
      return;
    }
    setPlayers(shuffleArray(activePlayers));
    setGamePhase('playing');
  };

  const rollDice = () => {
    if (rolling || gamePhase !== 'playing') return;
    if (currentPlayer.skipNextTurn) {
      toast.info(`${currentPlayer.name} pierde turno.`);
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, skipNextTurn: false } : p));
      nextTurn();
      return;
    }
    setRolling(true);
    setDiceValue(null);
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      setRolling(false);
      movePlayer(value);
    }, 800);
  };

  const movePlayer = (steps: number) => {
    const newPos = Math.min(currentPlayer.position + steps, 99);
    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIdx ? { ...p, position: newPos } : p
    ));

    // Check finish
    if (newPos >= 99) {
      handleWin();
      return;
    }

    // Trigger tile event
    const tile = board[newPos];
    setTimeout(() => triggerTileEvent(tile, newPos), 400);
  };

  const triggerTileEvent = (tile: BoardTile, pos: number) => {
    switch (tile.type) {
      case 'challenge': {
        const challenge = getRandomWithoutRepeat('megaboard_challenge', clasico);
        const text = challenge.replace(/{player}/g, currentPlayer.name);
        setEventEmoji('🎯');
        setEventText(text);
        setEventType('challenge');
        setGamePhase('event');
        break;
      }
      case 'drink': {
        const drink = getRandomWithoutRepeat('megaboard_drink', DRINK_EVENTS);
        setEventEmoji('🍺');
        setEventText(drink);
        setEventType('info');
        setGamePhase('event');
        break;
      }
      case 'trivia': {
        const q = getRandomWithoutRepeat('megaboard_trivia', cultureQuestionsNew2025);
        setTriviaQuestion(q);
        setTriviaAnswered(false);
        setEventEmoji('🧠');
        setEventText(`TRIVIA: ${q.question}`);
        setEventType('trivia');
        setGamePhase('event');
        break;
      }
      case 'duel': {
        const duel = getRandomWithoutRepeat('megaboard_duel', duelos);
        setEventEmoji('⚔️');
        setEventText(`${duel.name}: ${duel.description}`);
        setEventType('duel');
        setGamePhase('event');
        break;
      }
      case 'bonus': {
        const bonus = BONUS_EVENTS[Math.floor(Math.random() * BONUS_EVENTS.length)];
        setEventEmoji('⭐');
        setEventText(bonus);
        applyBonus(bonus);
        setEventType('info');
        setGamePhase('event');
        break;
      }
      case 'trap': {
        if (currentPlayer.shielded) {
          setEventEmoji('🛡️');
          setEventText('¡Tu escudo te protegió! La trampa no tiene efecto.');
          setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, shielded: false } : p));
        } else {
          const trap = TRAP_EVENTS[Math.floor(Math.random() * TRAP_EVENTS.length)];
          setEventEmoji('💀');
          setEventText(trap);
          applyTrap(trap);
        }
        setEventType('info');
        setGamePhase('event');
        break;
      }
      case 'mimica': {
        const mimica = getRandomWithoutRepeat('megaboard_mimica', mimicaChallenges);
        setEventEmoji('🎭');
        setEventText(`${currentPlayer.name}, representa sin hablar:\n\n"${mimica.text}"\n\nSi te adivinan ganas XP, si fallan pierdes.`);
        setEventType('challenge');
        setGamePhase('event');
        break;
      }
      case 'random': {
        const random = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        setEventEmoji('🎲');
        setEventText(random);
        setEventType('info');
        setGamePhase('event');
        break;
      }
      case 'norma': {
        const norma = normasRonda[Math.floor(Math.random() * normasRonda.length)];
        const cleanNorma = norma.replace(/^NORMA:\s*/, '');
        setActiveNorma(cleanNorma);
        setEventEmoji('📜');
        setEventText(`¡NUEVA NORMA para todos!\n\n${cleanNorma}`);
        setGamePhase('event');
        break;
      }
      case 'oca': {
        setEventEmoji('🦢');
        setEventText('¡De Oca a Oca y tiro porque me toca!\nAvanzas a la siguiente Oca y VUELVES A TIRAR.');
        const nextOca = ocaTilesList.find(o => o > pos);
        if (nextOca) {
          setTimeout(() => {
            setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: nextOca } : p));
          }, 1500);
        }
        setEventType('roll_again');
        setGamePhase('event');
        break;
      }
      case 'puente': {
        setEventEmoji('🌉');
        setEventText('¡De puente a puente y tiro porque me lleva la corriente!\nTe mueves al otro puente y VUELVES A TIRAR.');
        if (pos === 6) {
          setTimeout(() => setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: 12 } : p)), 1500);
        } else if (pos === 12) {
          setTimeout(() => setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: 6 } : p)), 1500);
        }
        setEventType('roll_again');
        setGamePhase('event');
        break;
      }
      case 'posada': {
        setEventEmoji('🏨');
        setEventText('¡Has caído en la Posada!\nPierdes 1 turno descansando.');
        applyTrap('próximo turno');
        setGamePhase('event');
        break;
      }
      case 'pozo': {
        setEventEmoji('🕳️');
        setEventText('¡Has caído en el pozo!\nMientras esperas el rescate, bebe 2 tragos y pierdes 1 turno.');
        applyTrap('próximo turno');
        setGamePhase('event');
        break;
      }
      case 'laberinto': {
        setEventEmoji('🧭');
        setEventText('¡Te has perdido en el laberinto!\nRetrocedes a la casilla 30.');
        setTimeout(() => setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: 30 } : p)), 1500);
        setGamePhase('event');
        break;
      }
      case 'carcel': {
        setEventEmoji('⛓️');
        setEventText('¡Vas directo a la Cárcel!\nPierdes 1 turno y bebes 3 tragos.');
        applyTrap('próximo turno');
        setGamePhase('event');
        break;
      }
      case 'calavera': {
        setEventEmoji('☠️');
        setEventText('¡LA CALAVERA!\nHas muerto. Vuelves a la casilla 1.');
        applyTrap('Vuelves a la casilla 1');
        setGamePhase('event');
        break;
      }
      default:
        nextTurn();
    }
  };

  const applyBonus = (text: string) => {
    if (text.includes('Avanza 3')) {
      const newPos = Math.min(currentPlayer.position + 3, 99);
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: newPos } : p));
    } else if (text.includes('Doble XP') || text.includes('+20')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, score: p.score + 20 } : p));
    } else if (text.includes('Escudo')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, shielded: true } : p));
    } else if (text.includes('Roba 5')) {
      // Steal 5 XP from a random other player
      const others = players.filter((_, i) => i !== currentPlayerIdx);
      if (others.length > 0) {
        const victim = others[Math.floor(Math.random() * others.length)];
        setPlayers(prev => prev.map(p => {
          if (p.id === victim.id) return { ...p, score: Math.max(0, p.score - 5) };
          if (p.id === currentPlayer.id) return { ...p, score: p.score + 5 };
          return p;
        }));
      }
    }
  };

  const applyTrap = (text: string) => {
    if (text.includes('Retrocede 3')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: Math.max(0, p.position - 3) } : p));
    } else if (text.includes('próximo turno')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, skipNextTurn: true } : p));
    } else if (text.includes('Vuelves a la casilla 1')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: p.position < 20 ? Math.max(0, p.position - 5) : 0 } : p));
    } else if (text.includes('retrocede 1')) {
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: Math.max(0, p.position - 1) } : p));
    }
  };

  const handleTriviaAnswer = (answer: string) => {
    if (triviaAnswered) return;
    setTriviaAnswered(true);
    const correct = answer === triviaQuestion?.correct_answer;
    if (correct) {
      toast.success('¡Correcto! +15 XP');
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, score: p.score + 15 } : p));
    } else {
      toast.error(`Incorrecto. Retrocedes 1 casilla.`);
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: Math.max(0, p.position - 1) } : p));
    }
  };

  const handleChallengeResult = (passed: boolean) => {
    if (!passed) {
      const penalty = currentPlayer.position >= 70 ? 3 : currentPlayer.position >= 40 ? 2 : 1;
      toast.error(`❌ Has fallado. Retrocedes ${penalty} casilla${penalty > 1 ? 's' : ''}.`);
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: Math.max(0, p.position - penalty) } : p));
    } else {
      toast.success('✨ ¡Reto superado! +10 XP');
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, score: p.score + 10 } : p));
    }
    dismissEvent();
  };

  const handleDuelResult = (won: boolean) => {
    if (won) {
      toast.success('👑 ¡Has ganado el duelo! +15 XP');
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, score: p.score + 15 } : p));
    } else {
      const penalty = currentPlayer.position >= 70 ? 3 : currentPlayer.position >= 40 ? 2 : 1;
      toast.error(`💀 Has perdido. Retrocedes ${penalty} casilla${penalty > 1 ? 's' : ''}.`);
      setPlayers(prev => prev.map((p, i) => i === currentPlayerIdx ? { ...p, position: Math.max(0, p.position - penalty) } : p));
    }
    dismissEvent();
  };

  const dismissEvent = () => {
    setTriviaQuestion(null);
    setTriviaAnswered(false);
    setGamePhase('playing');
    if (eventType !== 'roll_again') {
        nextTurn();
    } else {
        setEventType('info'); // Reset to default
    }
  };

  const nextTurn = () => {
    setDiceValue(null);
    setCurrentPlayerIdx(prev => (prev + 1) % players.length);
  };

  const handleWin = async () => {
    setGamePhase('finished');
    
    // Sync to Hall of Fame (Local + Global)
    await updateMultiplePlayers(players.map(p => ({
        name: p.name,
        score: p.id === currentPlayer?.id ? p.score + 50 : p.score,
        won: p.id === currentPlayer?.id,
        avatarUrl: p.avatarUrl,
        gameMode: 'megaboard' as any
    })));

    const rankings = loadLocalRankings();
    const result = rankings.find(r => r.player_name.toLowerCase() === currentPlayer.name.toLowerCase());
    
    setRewardData({
      coins: 30, xp: currentPlayer.score + 50,
      oldLevel: result?.level || 1, newLevel: result?.level || 1,
      streak: result?.win_streak || 0
    });
    setShowReward(true);
  };

  const getDiceIcon = (v: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    return icons[v - 1] || Dice1;
  };

  // ─── Visible Board Rendering (3D Isometric Path) ─────────────────────────────
  const VISIBLE_RANGE = 100; // Show full board
  const getVisibleTiles = () => {
    return board;
  };

  // Sorted players for leaderboard
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.position !== b.position) return b.position - a.position;
    return b.score - a.score;
  });

  // ─── SETUP SCREEN ────────────────────────────────────────────────────────────
  if (gamePhase === 'setup') {
    return (
      <div className="fixed inset-0 z-50 premium-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="premium-panel rounded-[30px] p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🏰</div>
            <h2 className="text-3xl font-black premium-title">MegaBoard</h2>
            <p className="text-sm text-white/50 mt-1">100 casillas · más tragos · retos · trivia · hasta 20 jugadores</p>
          </div>

          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs text-white/60">
            <span className="font-bold uppercase tracking-[0.18em]">Jugadores</span>
            <span className="font-black text-white">{setupNames.filter(name => name.trim().length > 0).length} / {MAX_MEGABOARD_PLAYERS}</span>
          </div>

          <div className="space-y-3 mb-4">
            {setupNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 ${i === 0 ? 'bg-gradient-to-br from-amber-500 to-rose-500' : 'bg-white/10'}`}>
                  {i === 0 ? '👑' : `${i + 1}`}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    const newNames = [...setupNames];
                    newNames[i] = e.target.value;
                    setSetupNames(newNames);
                  }}
                  placeholder={i === 0 ? localPlayerName : `Jugador ${i + 1}`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none transition-colors"
                  readOnly={i === 0}
                />
                {i > 1 && (
                  <button
                    onClick={() => setSetupNames(prev => prev.filter((_, idx) => idx !== i))}
                    className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-colors shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {setupNames.length < MAX_MEGABOARD_PLAYERS && (
            <Button
              variant="ghost"
              onClick={() => setSetupNames(prev => [...prev, ''])}
              className="w-full mb-4 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40"
            >
              + Añadir jugador
            </Button>
          )}

          <Button onClick={startGame} className="w-full h-14 rounded-xl font-black text-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-400/50">
            🎲 ¡EMPEZAR PARTIDA!
          </Button>
          <Button variant="ghost" onClick={onExit} className="w-full mt-3 text-white/40 hover:text-white/60">
            ← Volver
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN GAME SCREEN ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 premium-screen text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-5 shrink-0"><div className="premium-panel rounded-[28px] px-4 py-4 md:px-5 md:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-black premium-title">🏰 MegaBoard</h2>
          {activeNorma && (
            <div className="hidden md:flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 text-xs text-orange-300 max-w-[200px] truncate">
              📜 {activeNorma}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={onExit} className="rounded-xl font-bold">
            <LogOut className="w-4 h-4 mr-1" /> Salir
          </Button>
        </div>
      </div></div>

      {/* Active Norma Mobile */}
      {activeNorma && (
        <div className="md:hidden px-4 pb-2"> <div className="premium-panel-soft rounded-2xl px-4 py-3 border border-orange-500/20">
          <p className="text-xs text-orange-300 truncate">📜 {activeNorma}</p>
        </div></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden px-3 pb-3 md:px-5 md:pb-5 gap-4">
        {/* Board Area */}
        <div className="flex-1 overflow-auto premium-panel rounded-[30px] p-3 md:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="premium-stat">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2">Turno</p>
              <p className="text-lg md:text-xl font-black truncate">{currentPlayer?.name || '...'}</p>
            </div>
            <div className="premium-stat">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2">Líder</p>
              <p className="text-lg md:text-xl font-black truncate">{sortedPlayers[0]?.name || '...'}</p>
            </div>
            <div className="premium-stat">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2">Meta</p>
              <p className="text-lg md:text-xl font-black">Casilla 99</p>
            </div>
            <div className="premium-stat">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-bold mb-2">Jugadores</p>
              <p className="text-lg md:text-xl font-black">{players.length}</p>
            </div>
          </div>

          {/* 3D Isometric Board */}
          <div className="relative rounded-[28px] border border-white/8 bg-white/[0.03] p-3 md:p-4 overflow-auto">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 md:gap-3">
              {getVisibleTiles().map((tile) => {
                const playersOnTile = players.filter(p => p.position === tile.id);
                const isCurrentTile = currentPlayer && currentPlayer.position === tile.id;

                return (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (tile.id % 20) * 0.02 }}
                    className={`relative w-full aspect-square rounded-2xl border flex flex-col items-center justify-center text-center backdrop-blur-[2px]
                      ${isCurrentTile ? 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''}
                      bg-gradient-to-br ${tile.color} border-white/20 shadow-lg`}

                  >
                    {/* Tile number */}
                    <span className="absolute top-1 left-1.5 text-[10px] font-bold text-white/60">{tile.id}</span>
                    <span className="text-2xl md:text-3xl">{tile.emoji}</span>
                    <span className="px-1 text-[10px] md:text-[11px] font-bold text-white/90 leading-tight">{tile.label}</span>

                    {/* Player Avatars on tile */}
                    {playersOnTile.length > 0 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                        {playersOnTile.slice(0, MAX_TILE_AVATARS).map(p => (
                          <div key={p.id} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 overflow-hidden ${p.id === currentPlayer?.id ? 'border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'border-white/50'}`}>
                            {p.avatarUrl ? (
                              <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                                {p.name[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        ))}
                        {playersOnTile.length > MAX_TILE_AVATARS && (
                          <div className="h-5 min-w-5 px-1 md:h-6 md:min-w-6 rounded-full border border-white/40 bg-slate-950/90 flex items-center justify-center text-[8px] md:text-[9px] font-black text-white">
                            +{playersOnTile.length - MAX_TILE_AVATARS}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar — Leaderboard + Controls */}
        <div className="w-full md:w-80 premium-panel rounded-[30px] p-4 flex flex-col gap-3 shrink-0">
          {/* Leaderboard */}
          <div className="premium-panel-soft rounded-[24px] p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Clasificación
            </h3>
            <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
              {sortedPlayers.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${p.id === currentPlayer?.id ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/5'}`}>
                  <span className="text-sm font-black w-5 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{p.name[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-white/40">Casilla {p.position} · {p.score} XP</div>
                  </div>
                  {p.shielded && <span className="text-xs">🛡️</span>}
                  {p.skipNextTurn && <span className="text-xs">⏭️</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Dice & Controls */}
          <div className="premium-panel-soft rounded-[24px] p-4 text-center">
            <p className="text-xs text-white/50 mb-1">Turno de</p>
            <p className="text-lg font-black text-amber-400 mb-3">{currentPlayer?.name || '...'}</p>

            {/* Dice Display */}
            <div className="flex justify-center mb-3">
              <motion.div
                animate={rolling ? { rotateX: [0, 360, 720], rotateY: [0, 180, 360] } : {}}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 rounded-[24px] bg-white text-slate-900 flex items-center justify-center text-4xl font-black shadow-lg border-2 border-white/50 mx-auto"
              >
                {rolling ? '🎲' : diceValue || '?'}
              </motion.div>
            </div>

            <Button
              onClick={rollDice}
              disabled={rolling || gamePhase !== 'playing'}
              className="w-full h-14 rounded-2xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:via-orange-400 hover:to-rose-500 text-white shadow-[0_0_18px_rgba(245,158,11,0.28)] border border-white/10 disabled:opacity-30"
            >
              {rolling ? 'Tirando...' : '🎲 TIRAR DADO'}
            </Button>
          </div>
        </div>
      </div>

      {/* EVENT OVERLAY - Responsive for screens: Board visible in Landscape TV mode */}
      <AnimatePresence>
        {gamePhase === 'event' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none flex md:items-end md:justify-end items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -30 }}
              className="premium-panel rounded-[30px] p-6 md:p-8 max-w-sm md:max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.55)] pointer-events-auto"
            >
              <div className="text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl mb-4">
                  {eventEmoji}
                </motion.div>
                <h3 className="text-2xl font-black mb-4 text-white">{currentPlayer?.name}</h3>
                <p className="text-lg text-white/90 leading-relaxed mb-6 whitespace-pre-line">{eventText}</p>

                {/* Trivia Options */}
                {triviaQuestion && !triviaAnswered && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {triviaQuestion.options?.map((opt: string, i: number) => (
                      <Button
                        key={i}
                        onClick={() => handleTriviaAnswer(opt)}
                        className="h-14 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/10 text-white"
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}

                {triviaAnswered && (
                  <div className={`p-3 rounded-xl mb-4 ${triviaQuestion?.correct_answer === 'answered' ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    <p className="text-sm">Respuesta correcta: <span className="font-bold text-green-400">{triviaQuestion?.correct_answer}</span></p>
                  </div>
                )}

                {/* Interactive Results based on Event Type */}
                {eventType === 'challenge' && (
                  <div className="flex gap-3">
                    <Button onClick={() => handleChallengeResult(true)} className="flex-1 h-14 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl whitespace-normal break-words py-2 px-2 h-auto text-sm leading-tight leading-4">
                      ✅ Superado
                    </Button>
                    <Button onClick={() => handleChallengeResult(false)} className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl whitespace-normal break-words py-2 px-2 h-auto text-sm leading-tight border border-red-500/50">
                      ❌ He Fallado<br/>(Atrás 1)
                    </Button>
                  </div>
                )}

                {eventType === 'duel' && (
                  <div className="flex gap-3">
                    <Button onClick={() => handleDuelResult(true)} className="flex-1 h-14 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl text-lg">
                      👑 ¡Gané yo!
                    </Button>
                    <Button onClick={() => handleDuelResult(false)} className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm leading-tight">
                      💀 Perdí el duelo<br/>(Atrás 1)
                    </Button>
                  </div>
                )}

                {(eventType === 'info' || eventType === 'roll_again' || (eventType === 'trivia' && triviaAnswered)) && (
                  <Button
                    onClick={dismissEvent}
                    className="w-full h-14 rounded-xl font-black text-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white"
                  >
                    Continuar <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME OVER OVERLAY */}
      <AnimatePresence>
        {gamePhase === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] premium-screen backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center">
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl mb-6">
                🏆
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2">¡{currentPlayer?.name} GANA!</h2>
              <p className="text-xl text-white/70 mb-6">Ha llegado a la meta con {currentPlayer?.score} XP</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={onExit} className="h-14 px-8 rounded-xl font-bold bg-white/20 hover:bg-white/30 text-white border border-white/20">
                  Volver al Menú
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RewardPopup
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        result="win"
        coinsEarned={rewardData.coins}
        xpEarned={rewardData.xp}
        oldLevel={rewardData.oldLevel}
        newLevel={rewardData.newLevel}
        streak={rewardData.streak}
      />
    </div>
  );
}
