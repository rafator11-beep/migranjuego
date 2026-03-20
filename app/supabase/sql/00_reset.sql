-- Party Game (Beep) - Supabase reset (safe)
-- Run this ONLY if you want a clean slate.

-- Drop triggers first (ignore if they don't exist)
DO $$
BEGIN
  IF to_regclass('public.games') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_games_updated_at ON public.games';
  END IF;
  IF to_regclass('public.players') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_players_updated_at ON public.players';
  END IF;
  IF to_regclass('public.teams') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams';
  END IF;
  IF to_regclass('public.player_rankings') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_player_rankings_updated_at ON public.player_rankings';
  END IF;
  IF to_regclass('public.tictactoe_state') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_tictactoe_state_updated_at ON public.tictactoe_state';
  END IF;
END $$;

-- Drop tables
DROP TABLE IF EXISTS public.tictactoe_state CASCADE;
DROP TABLE IF EXISTS public.player_rankings CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;

-- Drop helper function
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
