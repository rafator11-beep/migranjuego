-- Tabla de partidas
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('futbol', 'espana', 'mix', 'cultura', 'social')),
  status TEXT NOT NULL DEFAULT 'setup' CHECK (status IN ('setup', 'playing', 'round_end', 'finished')),
  current_round INTEGER NOT NULL DEFAULT 1,
  current_turn INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de jugadores
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  team_id UUID,
  score INTEGER NOT NULL DEFAULT 0,
  has_played_this_round BOOLEAN NOT NULL DEFAULT false,
  turn_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de equipos
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Añadir referencia de team_id después de crear la tabla teams
ALTER TABLE public.players ADD CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Tabla de preguntas
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('futbol', 'espana', 'mix', 'cultura', 'social')),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('test', 'open', 'true_false', 'social')),
  options JSONB,
  correct_answer TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de preguntas usadas en partida (para evitar repeticiones)
CREATE TABLE public.used_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  answered_by UUID REFERENCES public.players(id) ON DELETE SET NULL,
  was_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(game_id, question_id)
);

-- Tabla para el estado del TicTacToe (modo fútbol)
CREATE TABLE public.tictactoe_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE UNIQUE,
  board JSONB NOT NULL DEFAULT '[[null,null,null],[null,null,null],[null,null,null]]',
  current_player_index INTEGER NOT NULL DEFAULT 0,
  winner_id UUID REFERENCES public.players(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de historial de rondas
CREATE TABLE public.round_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  winner_player_id UUID REFERENCES public.players(id),
  winner_team_id UUID REFERENCES public.teams(id),
  summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tictactoe_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_history ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para el juego (no requiere auth, es un juego de fiesta)
CREATE POLICY "Games are publicly accessible" ON public.games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Players are publicly accessible" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Teams are publicly accessible" ON public.teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Questions are publicly readable" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Used questions are publicly accessible" ON public.used_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "TicTacToe state is publicly accessible" ON public.tictactoe_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Round history is publicly accessible" ON public.round_history FOR ALL USING (true) WITH CHECK (true);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tictactoe_updated_at BEFORE UPDATE ON public.tictactoe_state FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX idx_players_game_id ON public.players(game_id);
CREATE INDEX idx_teams_game_id ON public.teams(game_id);
CREATE INDEX idx_questions_mode ON public.questions(mode);
CREATE INDEX idx_questions_mode_category ON public.questions(mode, category);
CREATE INDEX idx_used_questions_game_id ON public.used_questions(game_id);

-- Habilitar realtime para las tablas del juego
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tictactoe_state;