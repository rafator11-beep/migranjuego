import { useState, useMemo, useEffect } from 'react';
import { Player, Team, GameMode } from '@/types/game';
import { useGameContext } from '@/contexts/GameContext';

export interface GameState {
  round: number;
  currentNorma: string | null;
  currentNormaTurnsRemaining?: number;
  showDuel: boolean;
  showVoting: boolean;
  showImpostor: boolean;
  showTrivia: boolean;
  showDrinkingGame: boolean;
  showMimica: boolean;
  showBocaCerrada: boolean;
  showBocaCerradaWarning?: boolean; // Added
  showImpostorWord: boolean;
  showCaptainPass: boolean;
  showVirusAlert: boolean;
  showVirusCycleAlert?: boolean; // Added
  showImpostorWarning?: boolean;
  showCaptainSelection?: boolean; // Added
  showMimicaReveal?: boolean; // Secret handover hold-to-reveal
  showNormaGlobal?: boolean; // Norma global overlay

  // Data for specific screens
  currentDrinkingGame: any | null;
  currentMimicaText: string | null;
  currentBocaCerradaText: string | null;
  bocaCerradaData?: { playerId: string; playerName: string }; // Added
  currentImpostorWord: string | null;
  votingQuestion: string | null;
  duelPlayers: Player[];
  currentDuelo: string | null;
  currentImpostorReal: string | null;
  currentImpostorFake: string | null;
  impostorPlayerId: string | null;
  impostorData?: {
    currentImpostorReal: string | null;
    currentImpostorFake: string | null;
    impostorPlayerId: string | null;
  };
  captainId: string | null;
  virusAlertData: { player: Player; virus: any } | null;
  virusCycleData?: { type: string; title: string; message: string }; // Added

  // Yo Nunca Equipos State
  yoNuncaEquiposPhase?: 'idle' | 'truth_phase' | 'guess_phase' | 'result_phase';
  yoNuncaTargetTeamId?: string | null;
  yoNuncaTruthVotes?: Record<string, boolean>;
  yoNuncaGuessVotes?: Record<string, boolean>;

  // Voting State
  votingSelections?: string[]; // Array of player IDs selected in voting mode
}

export const useGameEngine = (mode: GameMode) => {
  const { players, teams } = useGameContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gamesWon, setGamesWon] = useState<Record<string, number>>({});
  const [gameOver, setGameOver] = useState(false);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [roundSnapshot, setRoundSnapshot] = useState<{ round: number; scores: Record<string, number> } | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    currentNorma: null,
    currentNormaTurnsRemaining: 0,
    showDuel: false,
    showVoting: false,
    showImpostor: false,
    showTrivia: false,
    showDrinkingGame: false,
    showMimica: false,
    showBocaCerrada: false,
    showBocaCerradaWarning: false, // Added
    showImpostorWord: false,
    showCaptainPass: false,
    showVirusAlert: false,
    showVirusCycleAlert: false, // Added
    showImpostorWarning: false,
    showCaptainSelection: true, // Default to true so it asks on startup
    currentDrinkingGame: null,
    currentMimicaText: null,
    currentBocaCerradaText: null,
    bocaCerradaData: undefined, // Added
    currentImpostorWord: null,
    votingQuestion: null,
    duelPlayers: [],
    currentDuelo: null,
    currentImpostorReal: null,
    currentImpostorFake: null,
    impostorPlayerId: null,
    impostorData: {
      currentImpostorReal: null,
      currentImpostorFake: null,
      impostorPlayerId: null,
    },
    captainId: null,
    virusAlertData: null,
    virusCycleData: undefined, // Added
    yoNuncaEquiposPhase: 'idle',
    yoNuncaTargetTeamId: null,
    yoNuncaTruthVotes: {},
    yoNuncaGuessVotes: {},
    votingSelections: [], // Initial state
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('partyGameScores');
    const savedGames = localStorage.getItem('partyGameWins');
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedGames) setGamesWon(JSON.parse(savedGames));
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    localStorage.setItem('partyGameScores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('partyGameWins', JSON.stringify(gamesWon));
  }, [gamesWon]);

  // Derived state
  const currentPlayer = players[currentPlayerIndex];

  const playersWithScore = useMemo(() => {
    return players.map(p => ({ ...p, score: scores[p.id] || 0 }));
  }, [players, scores]);

  const teamsWithScore: Team[] = useMemo(() => {
    if (!teams || teams.length === 0) return [];
    const sums = new Map<string, number>();
    for (const p of playersWithScore) {
      if (!p.team_id) continue;
      sums.set(p.team_id, (sums.get(p.team_id) || 0) + (p.score || 0));
    }
    return teams.map(t => ({ ...t, score: sums.get(t.id) || 0 }));
  }, [teams, playersWithScore]);

  const hasTeams = useMemo(() => {
    return (teamsWithScore?.length || 0) > 0 && playersWithScore.some(p => !!p.team_id);
  }, [teamsWithScore, playersWithScore]);

  const advanceTurn = () => {
    setCurrentIndex(prev => prev + 1);

    // Check if we completed a full circle of players
    if ((currentPlayerIndex + 1) % players.length === 0) {
      setGameState(prev => ({ ...prev, round: prev.round + 1 }));

      // Game Over Condition (Example: 20 Rounds)
      // We can make this configurable later
      if (gameState.round >= 20) {
        setGameOver(true);
      }
    }

    setGameState(prev => {
      if (prev.currentNorma && prev.currentNormaTurnsRemaining && prev.currentNormaTurnsRemaining > 0) {
        const nextTurns = prev.currentNormaTurnsRemaining - 1;
        if (nextTurns === 0) {
          return { ...prev, currentNorma: null, currentNormaTurnsRemaining: 0 };
        }
        return { ...prev, currentNormaTurnsRemaining: nextTurns };
      }
      return prev;
    });

    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  };

  const addScore = (playerId: string, points: number) => {
    setScores(prev => {
      const newScores = {
        ...prev,
        [playerId]: (prev[playerId] || 0) + points
      };
      return newScores;
    });
  };

  const addWin = (playerId: string) => {
    setGamesWon(prev => {
      const newWins = {
        ...prev,
        [playerId]: (prev[playerId] || 0) + 1
      };
      return newWins;
    });
  };

  return {
    players,
    teams,
    currentPlayer,
    currentIndex,
    setCurrentIndex,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    scores,
    setScores,
    gamesWon,
    setGamesWon,
    gameOver,
    setGameOver,
    gameState,
    setGameState,
    playersWithScore,
    teamsWithScore,
    hasTeams,
    advanceTurn,
    addScore,
    addWin,
    showRoundSummary,
    setShowRoundSummary,
    roundSnapshot,
    setRoundSnapshot
  };
};
