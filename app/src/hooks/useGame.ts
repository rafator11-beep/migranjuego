import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Game, Player, Team, Question, TicTacToeState, GameMode, QuestionType } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

// Helper functions to safely cast database types
const parseGame = (data: any): Game => ({
  ...data,
  mode: data.mode as GameMode,
  status: data.status as Game['status'],
});

const parseTicTacToeState = (data: any): TicTacToeState | null => {
  if (!data) return null;
  return {
    ...data,
    board: data.board as (string | null)[][],
  };
};

const parseQuestion = (data: any): Question => ({
  ...data,
  mode: data.mode as GameMode,
  type: data.type as QuestionType,
  options: data.options as string[] | null,
});

export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [ticTacToeState, setTicTacToeState] = useState<TicTacToeState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for offline mode
  const localGameState = useRef<{
    game: Game | null;
    players: Player[];
    teams: Team[];
  }>({
    game: null,
    players: [],
    teams: []
  });

  const fetchGameData = useCallback(async () => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // In offline mode, state is handled synchronously by actions, 
      // but we set loading false to unblock UI
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [gameRes, playersRes, teamsRes, tttRes] = await Promise.all([
        supabase.from('games').select('*').eq('id', gameId).single(),
        supabase.from('players').select('*').eq('game_id', gameId).order('turn_order'),
        supabase.from('teams').select('*').eq('game_id', gameId),
        supabase.from('tictactoe_state').select('*').eq('game_id', gameId).maybeSingle(),
      ]);

      if (gameRes.error) throw gameRes.error;

      setGame(parseGame(gameRes.data));
      setPlayers(playersRes.data || []);
      setTeams(teamsRes.data || []);
      setTicTacToeState(parseTicTacToeState(tttRes.data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la partida');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!gameId || !isSupabaseConfigured) return;

    const gameChannel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setGame(parseGame(payload.new));
          }
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${gameId}` },
        () => {
          supabase.from('players').select('*').eq('game_id', gameId).order('turn_order')
            .then(({ data }) => setPlayers(data || []));
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `game_id=eq.${gameId}` },
        () => {
          supabase.from('teams').select('*').eq('game_id', gameId)
            .then(({ data }) => setTeams(data || []));
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tictactoe_state', filter: `game_id=eq.${gameId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setTicTacToeState(parseTicTacToeState(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [gameId]);

  const createGame = async (mode: GameMode) => {
    if (!isSupabaseConfigured) {
      const newGame: Game = {
        id: uuidv4(),
        mode,
        status: 'waiting' as any, // Cast to any to avoid strict literal mismatch if types differ
        current_round: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        current_turn: 0
      };

      // Update local ref
      localGameState.current = { game: newGame, players: [], teams: [] };

      // Simulating React state update
      setGame(newGame);
      setPlayers([]);
      setTeams([]);

      return newGame;
    }

    const { data, error } = await supabase
      .from('games')
      .insert({ mode })
      .select()
      .single();

    if (error) throw error;

    // If football mode, create tictactoe state
    if (mode === 'futbol') {
      await supabase.from('tictactoe_state').insert({
        game_id: data.id,
        board: [[null, null, null], [null, null, null], [null, null, null]],
      });
    }

    return data;
  };

  const addPlayer = async (name: string, avatarUrl?: string) => {
    // If offline, we might generate ID locally if gameId is present in local context
    if (!isSupabaseConfigured) {
      if (!game) throw new Error('No active game found locally');

      const newPlayer: Player = {
        id: uuidv4(),
        game_id: game.id,
        name,
        avatar_url: avatarUrl || null,
        score: 0,
        turn_order: players.length,
        team_id: null,
        has_played_this_round: false,
        created_at: new Date().toISOString()
      };

      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      localGameState.current.players = updatedPlayers;
      return newPlayer;
    }

    if (!gameId) throw new Error('No game ID');

    // Fix: Guard against duplicate names
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      console.warn("Player already exists:", name);
      return players.find(p => p.name.toLowerCase() === name.toLowerCase());
    }

    const turnOrder = players.length;
    const { data, error } = await supabase
      .from('players')
      .insert({
        game_id: gameId,
        name,
        avatar_url: avatarUrl || null,
        turn_order: turnOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const removePlayer = async (playerId: string) => {
    if (!isSupabaseConfigured) {
      const updatedPlayers = players.filter(p => p.id !== playerId);
      setPlayers(updatedPlayers);
      localGameState.current.players = updatedPlayers;
      return;
    }

    const { error } = await supabase.from('players').delete().eq('id', playerId);
    if (error) throw error;
  };

  const createTeam = async (name: string, color: string) => {
    if (!isSupabaseConfigured) {
      if (!game) throw new Error("No game");
      const newTeam: Team = {
        id: uuidv4(),
        game_id: game.id,
        name,
        color,
        score: 0,
        created_at: new Date().toISOString()
      };
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      localGameState.current.teams = updatedTeams;
      return newTeam;
    }

    if (!gameId) throw new Error('No game ID');

    const { data, error } = await supabase
      .from('teams')
      .insert({ game_id: gameId, name, color })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const assignPlayerToTeam = async (playerId: string, teamId: string | null) => {
    if (!isSupabaseConfigured) {
      const updatedPlayers = players.map(p =>
        p.id === playerId ? { ...p, team_id: teamId } : p
      );
      setPlayers(updatedPlayers);
      localGameState.current.players = updatedPlayers;
      return;
    }

    const { error } = await supabase
      .from('players')
      .update({ team_id: teamId })
      .eq('id', playerId);

    if (error) throw error;
  };

  const startGame = async () => {
    if (!isSupabaseConfigured) {
      if (!game) return;
      const updatedGame = { ...game, status: 'playing' as const };
      setGame(updatedGame);
      localGameState.current.game = updatedGame;
      return;
    }

    if (!gameId) throw new Error('No game ID');

    const { error } = await supabase
      .from('games')
      .update({ status: 'playing' })
      .eq('id', gameId);

    if (error) throw error;
  };

  const getNextQuestion = async (): Promise<Question | null> => {
    // In offline mode (refactored party game), we don't strictly use 
    // this DB-based question fetcher for 'megamix' or 'clasico' usually,
    // because those use local constant arrays in useGameContent.
    // However, for 'trivia_futbol' and 'cultura', it does fetch from DB.
    // For now, we return null in offline mode to avoid crashes,
    // or could eventually mock it if we had local question JSON.
    if (!isSupabaseConfigured) return null;

    if (!gameId || !game) return null;

    // Get IDs of already used questions
    const { data: usedQuestions } = await supabase
      .from('used_questions')
      .select('question_id')
      .eq('game_id', gameId);

    const usedIds = usedQuestions?.map(q => q.question_id) || [];

    // Get a random unused question for this mode
    let query = supabase
      .from('questions')
      .select('*')
      .eq('mode', game.mode);

    if (usedIds.length > 0) {
      // PostgREST expects strings/uuids quoted inside the in(...) list
      const inList = `(${usedIds.map((id) => `"${id}"`).join(',')})`;
      query = query.not('id', 'in', inList);
    }

    let { data: questions, error } = await query.limit(50);

    // If futbol mode seems under-seeded, seed once and retry
    if ((error || !questions || questions.length === 0) && game.mode === 'futbol') {
      try {
        await supabase.functions.invoke('seed-questions', { body: { mode: 'futbol' } });
      } catch {
        // ignore seed errors; fall back to existing behavior below
      }
      const retry = await query.limit(50);
      questions = retry.data;
      error = retry.error;
    }

    if (error || !questions || questions.length === 0) {
      // Reset used questions if we've run out
      await supabase.from('used_questions').delete().eq('game_id', gameId);
      const { data: resetQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('mode', game.mode)
        .limit(50);

      if (!resetQuestions || resetQuestions.length === 0) return null;
      const randomQ = parseQuestion(resetQuestions[Math.floor(Math.random() * resetQuestions.length)]);
      setCurrentQuestion(randomQ);
      return randomQ;
    }

    const randomQuestion = parseQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setCurrentQuestion(randomQuestion);
    return randomQuestion;
  };

  const answerQuestion = async (questionId: string, playerId: string, wasCorrect: boolean) => {
    if (!isSupabaseConfigured) return; // DB tracking disabled offline

    if (!gameId || !game) return;

    // Mark question as used
    await supabase.from('used_questions').insert({
      game_id: gameId,
      question_id: questionId,
      round_number: game.current_round,
      answered_by: playerId,
      was_correct: wasCorrect,
    });

    // Update player score and turn status
    if (wasCorrect) {
      const player = players.find(p => p.id === playerId);
      if (player) {
        await supabase.from('players')
          .update({ score: player.score + 1 })
          .eq('id', playerId);

        // Update team score if applicable
        if (player.team_id) {
          const team = teams.find(t => t.id === player.team_id);
          if (team) {
            await supabase.from('teams')
              .update({ score: team.score + 1 })
              .eq('id', player.team_id);
          }
        }
      }
    }

    // Mark player as having played this round
    await supabase.from('players')
      .update({ has_played_this_round: true })
      .eq('id', playerId);
  };

  const updateTicTacToeBoard = async (row: number, col: number, playerId: string) => {
    // Tictactoe not fully supported offline yet, return
    if (!isSupabaseConfigured) return;
    if (!ticTacToeState) return;

    const newBoard = ticTacToeState.board.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? playerId : c))
    );

    await supabase
      .from('tictactoe_state')
      .update({
        board: newBoard,
        current_player_index: (ticTacToeState.current_player_index + 1) % players.length
      })
      .eq('game_id', ticTacToeState.game_id);
  };

  const checkTicTacToeWinner = (): string | null => {
    if (!ticTacToeState) return null;
    const board = ticTacToeState.board;

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return null;
  };

  const nextTurn = async () => {
    if (!isSupabaseConfigured) {
      if (!game) return;
      const nextTurnIndex = (game.current_turn + 1) % players.length;
      const updatedGame = { ...game, current_turn: nextTurnIndex };
      setGame(updatedGame);
      localGameState.current.game = updatedGame;
      return;
    }

    if (!gameId || !game) return;

    const playersWhoHaventPlayed = players.filter(p => !p.has_played_this_round);

    if (playersWhoHaventPlayed.length === 0) {
      // End of round
      await supabase.from('games')
        .update({ status: 'round_end' })
        .eq('id', gameId);
    } else {
      const nextTurnIndex = (game.current_turn + 1) % players.length;
      await supabase.from('games')
        .update({ current_turn: nextTurnIndex })
        .eq('id', gameId);
    }
  };

  const startNextRound = async () => {
    if (!isSupabaseConfigured) {
      if (!game) return;
      const updatedGame = {
        ...game,
        current_round: game.current_round + 1,
        status: 'playing' as const,
        current_turn: 0
      };
      setGame(updatedGame);
      // Reset players round status locally
      const updatedPlayers = players.map(p => ({ ...p, has_played_this_round: false }));
      setPlayers(updatedPlayers);

      localGameState.current.game = updatedGame;
      localGameState.current.players = updatedPlayers;
      return;
    }

    if (!gameId || !game) return;

    // Reset all players' round status
    await supabase.from('players')
      .update({ has_played_this_round: false })
      .eq('game_id', gameId);

    // Increment round and set status to playing
    await supabase.from('games')
      .update({
        current_round: game.current_round + 1,
        status: 'playing',
        current_turn: 0
      })
      .eq('id', gameId);
  };

  const endGame = async () => {
    if (!isSupabaseConfigured) {
      if (!game) return;
      const updatedGame = { ...game, status: 'finished' as const };
      setGame(updatedGame);
      localGameState.current.game = updatedGame;
      return;
    }
    if (!gameId) return;
    await supabase.from('games').update({ status: 'finished' }).eq('id', gameId);
  };

  const getCurrentPlayer = (): Player | null => {
    if (!game || players.length === 0) return null;
    return players[game.current_turn % players.length] || null;
  };

  return {
    game,
    players,
    teams,
    ticTacToeState,
    currentQuestion,
    loading,
    error,
    createGame,
    addPlayer,
    removePlayer,
    createTeam,
    assignPlayerToTeam,
    startGame,
    getNextQuestion,
    answerQuestion,
    updateTicTacToeBoard,
    checkTicTacToeWinner,
    nextTurn,
    startNextRound,
    endGame,
    getCurrentPlayer,
    refetch: fetchGameData,
  };
}
