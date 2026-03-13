-- Add city column to player_rankings
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS city TEXT DEFAULT NULL;

-- Add game_mode column to track scores per mode
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS football_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS football_games INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS football_wins INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS culture_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS culture_games INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.player_rankings ADD COLUMN IF NOT EXISTS culture_wins INTEGER NOT NULL DEFAULT 0;