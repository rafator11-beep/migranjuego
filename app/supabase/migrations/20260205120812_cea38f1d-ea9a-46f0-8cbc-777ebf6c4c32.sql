-- First drop the old constraint
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_mode_check;

-- Update any 'mix' values to 'megamix'
UPDATE public.games SET mode = 'megamix' WHERE mode = 'mix';

-- Now add the new constraint with all game modes
ALTER TABLE public.games ADD CONSTRAINT games_mode_check 
CHECK (mode IN ('futbol', 'espana', 'megamix', 'clasico', 'yo_nunca', 'picante', 'votacion', 'pacovers', 'trivia_futbol', 'cultura'));