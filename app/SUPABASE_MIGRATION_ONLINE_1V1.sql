-- Online rooms / 1v1 / WebRTC support

create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id text primary key,
  host_id text not null,
  game_mode text not null,
  status text not null default 'setup',
  current_game_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_participants (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id) on delete cascade,
  player_id text not null,
  name text not null,
  avatar_url text,
  is_host boolean not null default false,
  created_at timestamptz not null default now(),
  unique (room_id, player_id)
);

create table if not exists public.webrtc_signals (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  sender_id text not null,
  receiver_id text not null,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.webrtc_signals enable row level security;

drop policy if exists "Rooms are public" on public.rooms;
create policy "Rooms are public"
on public.rooms
for all
using (true)
with check (true);

drop policy if exists "Room participants are public" on public.room_participants;
create policy "Room participants are public"
on public.room_participants
for all
using (true)
with check (true);

drop policy if exists "WebRTC signals are public" on public.webrtc_signals;
create policy "WebRTC signals are public"
on public.webrtc_signals
for all
using (true)
with check (true);

create or replace function public.update_room_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_rooms_updated_at on public.rooms;
create trigger update_rooms_updated_at
before update on public.rooms
for each row
execute function public.update_room_updated_at();

alter publication supabase_realtime add table public.room_participants;
alter publication supabase_realtime add table public.webrtc_signals;
