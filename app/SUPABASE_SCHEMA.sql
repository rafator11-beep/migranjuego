-- Party Game / Beep - Supabase schema (minimal, permissive)
-- Run in Supabase Dashboard -> SQL Editor

-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Helper trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;



-- 2) Drop wrong tables (optional). Uncomment if you created tables with wrong columns.
-- drop table if exists public.tictactoe_state cascade;
-- drop table if exists public.round_history cascade;
-- drop table if exists public.used_questions cascade;
-- drop table if exists public.players cascade;
-- drop table if exists public.teams cascade;
-- drop table if exists public.games cascade;
-- drop table if exists public.player_rankings cascade;
-- drop table if exists public.questions cascade;
-- drop table if exists public.feedback_messages cascade;
-- drop table if exists public.suggestions cascade;
-- drop table if exists public.question_votes cascade;

-- 3) Core tables
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  status text not null default 'active',
  current_round integer not null default 1,
  current_turn integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_games_updated_at on public.games;
create trigger trg_games_updated_at before update on public.games
for each row execute function public.set_updated_at();

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  color text not null default '#ffffff',
  score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  name text not null,
  avatar_url text,
  score integer not null default 0,
  turn_order integer not null default 0,
  has_played_this_round boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_players_game_id on public.players(game_id);
create index if not exists idx_players_team_id on public.players(team_id);

create table if not exists public.tictactoe_state (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null unique references public.games(id) on delete cascade,
  board jsonb not null default '[]'::jsonb,
  current_player_index integer not null default 0,
  winner_id uuid references public.players(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_ttt_updated_at on public.tictactoe_state;
create trigger trg_ttt_updated_at before update on public.tictactoe_state
for each row execute function public.set_updated_at();

-- 4) Rankings
create table if not exists public.player_rankings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  avatar_url text,
  city text,
  total_score integer not null default 0,
  games_played integer not null default 0,
  games_won integer not null default 0,
  football_score integer not null default 0,
  football_games integer not null default 0,
  football_wins integer not null default 0,
  culture_score integer not null default 0,
  culture_games integer not null default 0,
  culture_wins integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists uq_player_rankings_name on public.player_rankings(player_name);
drop trigger if exists trg_rankings_updated_at on public.player_rankings;
create trigger trg_rankings_updated_at before update on public.player_rankings
for each row execute function public.set_updated_at();

-- 5) Questions + usage history
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  category text not null,
  type text not null,
  question text not null,
  options jsonb,
  correct_answer text,
  difficulty integer not null default 1,
  created_at timestamptz not null default now()
);
create index if not exists idx_questions_mode on public.questions(mode);

create table if not exists public.used_questions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  round_number integer not null,
  answered_by uuid references public.players(id) on delete set null,
  was_correct boolean,
  created_at timestamptz not null default now()
);
create index if not exists idx_used_questions_game_round on public.used_questions(game_id, round_number);

create table if not exists public.round_history (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  round_number integer not null,
  summary jsonb,
  winner_player_id uuid references public.players(id) on delete set null,
  winner_team_id uuid references public.teams(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_round_history_game_round on public.round_history(game_id, round_number);

-- 6) Feedback / suggestions / votes (optional features)
create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  game_mode text,
  sender_name text,
  message_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  submitted_by text,
  suggestion_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_votes (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  question_category text not null default 'general',
  vote_positive boolean not null,
  voter_name text,
  game_id uuid,
  created_at timestamptz not null default now()
);

-- 7) Permissions: allow browser anon key to read/write without auth (easy mode)
-- If later you want security, enable RLS + policies. For now keep it simple.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on all tables in schema public to anon, authenticated;

-- Ensure future tables get same grants
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
