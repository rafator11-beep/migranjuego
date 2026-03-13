-- Party Game / BRUTAL add-ons (teams + logros + hall of fame)
-- Run AFTER SUPABASE_SCHEMA.sql

create extension if not exists pgcrypto;

-- 1) Global per-player stats (Hall of Fame)
create table if not exists public.player_global_stats (
  player_name text primary key,
  avatar_url text,
  total_points integer not null default 0,
  games_played integer not null default 0,
  legendary_drops integer not null default 0,
  chaos_events integer not null default 0,
  cursed_events integer not null default 0,
  viruses_received integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_player_global_stats_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_player_global_stats_updated_at on public.player_global_stats;
create trigger trg_player_global_stats_updated_at before update on public.player_global_stats
for each row execute function public.touch_player_global_stats_updated_at();

-- 2) Achievements (persistentes)
create table if not exists public.player_achievements (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  achievement_key text not null,
  title text not null,
  icon text not null default '🏆',
  rarity text not null default 'common', -- common/rare/legendary/cursed/chaos
  count integer not null default 1,
  unlocked_at timestamptz not null default now(),
  unique (player_name, achievement_key)
);

-- 3) Event log (para “WTF moments” / analytics)
create table if not exists public.game_events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  mode text,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_events_game_id on public.game_events(game_id);
create index if not exists idx_game_events_type on public.game_events(event_type);

-- 4) Team rankings (all-time)
create table if not exists public.team_rankings (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  total_score integer not null default 0,
  games_played integer not null default 0,
  games_won integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (team_name)
);

drop trigger if exists trg_team_rankings_updated_at on public.team_rankings;
create trigger trg_team_rankings_updated_at before update on public.team_rankings
for each row execute function public.set_updated_at();

-- 5) Permissions (easy mode)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
