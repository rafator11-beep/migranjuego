-- Create global player rankings table
CREATE TABLE public.player_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  avatar_url TEXT,
  total_score INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  games_won INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_name)
);

-- Enable RLS
ALTER TABLE public.player_rankings ENABLE ROW LEVEL SECURITY;

-- Rankings are publicly readable
CREATE POLICY "Rankings are publicly readable"
ON public.player_rankings
FOR SELECT
USING (true);

-- Anyone can insert/update rankings (no auth required for party game)
CREATE POLICY "Rankings are publicly writable"
ON public.player_rankings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Rankings are publicly updatable"
ON public.player_rankings
FOR UPDATE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_player_rankings_updated_at
BEFORE UPDATE ON public.player_rankings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();