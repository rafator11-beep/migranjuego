-- Optional reset (recommended once) so Hall of Fame only counts the selected modes
-- Run this ONLY if you already had BRUTAL stats saved from other modes.

-- Clears global stats + achievements (keeps player_rankings intact)
truncate table public.player_global_stats;
truncate table public.player_achievements;
truncate table public.game_events;
truncate table public.team_rankings;

-- From now on, the app will ONLY write BRUTAL stats for:
-- megamix, cultura, futbol, trivia_futbol
