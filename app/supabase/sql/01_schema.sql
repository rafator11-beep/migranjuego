-- Party Game (Beep) - Supabase schema (minimal + permissive)

-- Needed for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Games
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  mode text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Teams (optional)
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Players
CREATE TABLE IF NOT EXISTS public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  name text NOT NULL,
  avatar_url text,
  is_host boolean NOT NULL DEFAULT false,
  score int NOT NULL DEFAULT 0,
  turns_played int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Player profiles (global)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  avatar_url text,
  city text,
  coins int NOT NULL DEFAULT 0,
  gems int NOT NULL DEFAULT 0,
  xp int NOT NULL DEFAULT 0,
  level int NOT NULL DEFAULT 1,
  poker_xp int NOT NULL DEFAULT 0,
  poker_level int NOT NULL DEFAULT 1,
  parchis_xp int NOT NULL DEFAULT 0,
  parchis_level int NOT NULL DEFAULT 1,
  win_streak int NOT NULL DEFAULT 0,
  unlocked_items text[] DEFAULT '{}',
  equipped_items jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Player rankings (per mode)
CREATE TABLE IF NOT EXISTS public.player_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL,
  player_name text NOT NULL,
  wins int NOT NULL DEFAULT 0,
  plays int NOT NULL DEFAULT 0,
  points int NOT NULL DEFAULT 0,
  last_played_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(mode, player_name)
);

-- TicTacToe state (football mode / tablero)
CREATE TABLE IF NOT EXISTS public.tictactoe_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid UNIQUE REFERENCES public.games(id) ON DELETE CASCADE,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers (drop + create to avoid "already exists")
DROP TRIGGER IF EXISTS trg_games_updated_at ON public.games;
CREATE TRIGGER trg_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams;
CREATE TRIGGER trg_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_players_updated_at ON public.players;
CREATE TRIGGER trg_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_player_rankings_updated_at ON public.player_rankings;
CREATE TRIGGER trg_player_rankings_updated_at
BEFORE UPDATE ON public.player_rankings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tictactoe_state_updated_at ON public.tictactoe_state;
CREATE TRIGGER trg_tictactoe_state_updated_at
BEFORE UPDATE ON public.tictactoe_state
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_players_game_id ON public.players(game_id);
CREATE INDEX IF NOT EXISTS idx_teams_game_id ON public.teams(game_id);
CREATE INDEX IF NOT EXISTS idx_rankings_mode_points ON public.player_rankings(mode, points DESC);
