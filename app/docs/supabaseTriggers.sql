-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR

-- 1. EVENT SOURCING PARA RANKING (Idempotente)
CREATE TABLE IF NOT EXISTS game_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL, 
    event_type TEXT NOT NULL, 
    actor_user_id TEXT NOT NULL, 
    tab_id TEXT NOT NULL,
    mode_id TEXT NOT NULL,
    play_mode TEXT NOT NULL,
    score INT DEFAULT 0,
    is_winner BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Constraint crítico de Idempotencia: No se puede emitir el mismo evento 2 veces para un jugador en una partida
    UNIQUE(game_id, event_type, actor_user_id) 
);

-- 2. ESTADÍSTICAS MATERIALIZADAS
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    name TEXT,
    avatar_url TEXT,
    -- General
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    -- Desglose
    fiesta_games_played INT DEFAULT 0,
    fiesta_games_won INT DEFAULT 0,
    juego_games_played INT DEFAULT 0,
    juego_games_won INT DEFAULT 0,
    -- Poker
    poker_chips_won BIGINT DEFAULT 0,
    poker_games_played INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_game_events_user ON game_events(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_won ON user_stats(games_won DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_poker ON user_stats(poker_chips_won DESC);

-- 3. POKER ONLINE STATE
CREATE TABLE IF NOT EXISTS poker_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id TEXT NOT NULL,
    status TEXT DEFAULT 'waiting', -- waiting, preflop, flop, turn, river, showdown, finished
    pot BIGINT DEFAULT 0,
    current_bet BIGINT DEFAULT 0,
    community_cards TEXT[] DEFAULT '{}',
    current_turn_player_id TEXT,
    dealer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poker_players (
    room_id UUID REFERENCES poker_rooms(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL, 
    name TEXT NOT NULL,
    avatar_url TEXT,
    chips BIGINT DEFAULT 1000,
    current_bet BIGINT DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, folded, all-in
    seat_index INT NOT NULL,
    is_host BOOLEAN DEFAULT false,
    PRIMARY KEY (room_id, player_id)
);

CREATE TABLE IF NOT EXISTS poker_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES poker_rooms(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL,
    action_type TEXT NOT NULL, -- fold, call, raise, check
    amount BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS BÁSICO Y SEGURIDAD
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE poker_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE poker_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE poker_actions ENABLE ROW LEVEL SECURITY;

-- Lectura pública para el ranking y eventos
DROP POLICY IF EXISTS "Ranking visible for everyone" ON user_stats;
CREATE POLICY "Ranking visible for everyone" ON user_stats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Events visible for everyone" ON game_events;
CREATE POLICY "Events visible for everyone" ON game_events FOR SELECT USING (true);
-- Escritura de eventos (Insert-only, sin Updates para evitar manipulación)
DROP POLICY IF EXISTS "Insert own events" ON game_events;
CREATE POLICY "Insert own events" ON game_events FOR INSERT WITH CHECK (true); 

-- Políticas de Poker: Todos pueden leer las salas públicas.
DROP POLICY IF EXISTS "Poker rooms visible" ON poker_rooms;
CREATE POLICY "Poker rooms visible" ON poker_rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Poker players visible" ON poker_players;
CREATE POLICY "Poker players visible" ON poker_players FOR SELECT USING (true);
DROP POLICY IF EXISTS "Poker actions visible" ON poker_actions;
CREATE POLICY "Poker actions visible" ON poker_actions FOR SELECT USING (true);
-- Permisos de Inserción
DROP POLICY IF EXISTS "Insert Actions" ON poker_actions;
CREATE POLICY "Insert Actions" ON poker_actions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Insert Players" ON poker_players;
CREATE POLICY "Insert Players" ON poker_players FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Update Room" ON poker_rooms;
CREATE POLICY "Update Room" ON poker_rooms FOR UPDATE USING (true);

-- 5. TRIGGER PARA ACTUALIZAR USER_STATS AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_user_stats_on_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id, games_played, games_won, fiesta_games_played, fiesta_games_won, juego_games_played, juego_games_won)
    VALUES (
        NEW.actor_user_id, 
        1, 
        CASE WHEN NEW.is_winner THEN 1 ELSE 0 END,
        CASE WHEN NEW.tab_id = 'fiesta' THEN 1 ELSE 0 END,
        CASE WHEN NEW.tab_id = 'fiesta' AND NEW.is_winner THEN 1 ELSE 0 END,
        CASE WHEN NEW.tab_id = 'juego' THEN 1 ELSE 0 END,
        CASE WHEN NEW.tab_id = 'juego' AND NEW.is_winner THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id) DO UPDATE SET
        games_played = user_stats.games_played + 1,
        games_won = user_stats.games_won + CASE WHEN NEW.is_winner THEN 1 ELSE 0 END,
        fiesta_games_played = user_stats.fiesta_games_played + CASE WHEN NEW.tab_id = 'fiesta' THEN 1 ELSE 0 END,
        fiesta_games_won = user_stats.fiesta_games_won + CASE WHEN NEW.tab_id = 'fiesta' AND NEW.is_winner THEN 1 ELSE 0 END,
        juego_games_played = user_stats.juego_games_played + CASE WHEN NEW.tab_id = 'juego' THEN 1 ELSE 0 END,
        juego_games_won = user_stats.juego_games_won + CASE WHEN NEW.tab_id = 'juego' AND NEW.is_winner THEN 1 ELSE 0 END,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stats ON game_events;
CREATE TRIGGER trigger_update_stats AFTER INSERT ON game_events FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_event();
-- 7. RPC PARA INVITADOS (Bypass RLS para usuarios no autenticados)
CREATE OR REPLACE FUNCTION register_guest_event(
    p_game_id TEXT,
    p_event_type TEXT,
    p_actor_user_id TEXT,
    p_tab_id TEXT,
    p_mode_id TEXT,
    p_play_mode TEXT,
    p_score INT,
    p_is_winner BOOLEAN,
    p_player_name TEXT,
    p_avatar_url TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO user_stats (user_id, name, avatar_url)
    VALUES (p_actor_user_id, p_player_name, p_avatar_url)
    ON CONFLICT (user_id) DO UPDATE SET 
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url;

    INSERT INTO game_events (
        game_id, event_type, actor_user_id, tab_id, mode_id, play_mode, score, is_winner
    ) VALUES (
        p_game_id, p_event_type, p_actor_user_id, p_tab_id, p_mode_id, p_play_mode, p_score, p_is_winner
    )
    ON CONFLICT (game_id, event_type, actor_user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
