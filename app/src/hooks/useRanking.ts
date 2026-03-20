import { useState, useEffect, useCallback } from 'react';
import { safeLower } from '@/utils/safeText';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { loadLocalRankings, upsertLocalRanking, PlayerRanking } from '@/utils/localRanking';
import { TAB_MAPPING, TabId, GameMode } from '@/types/game';

export interface PlayerStats {
  user_id: string;
  name: string;
  avatar_url: string | null;
  games_played: number;
  games_won: number;
  fiesta_games_played: number;
  fiesta_games_won: number;
  juego_games_played: number;
  juego_games_won: number;
  poker_chips_won: number;
  poker_games_played: number;
  megamix_games_played: number;
  megamix_games_won: number;
  clasico_games_played: number;
  clasico_games_won: number;
  picante_games_played: number;
  picante_games_won: number;
  parchis_games_played: number;
  parchis_games_won: number;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  poker_xp: number;
  poker_level: number;
  parchis_xp: number;
  parchis_level: number;
  unlocked_items: string[];
  equipped_items?: { avatar?: string; ficha?: string; carta?: string };
  updated_at: string;
}

export type BrutalMeta = {
  legendaryDrops?: number;
  chaosEvents?: number;
  cursedEvents?: number;
  virusesReceived?: number;
};

// Convert local ranking to PlayerStats format for unified display
function localToPlayerStats(lr: PlayerRanking): PlayerStats {
  return {
    user_id: lr.id,
    name: lr.player_name,
    avatar_url: lr.avatar_url,
    games_played: lr.games_played,
    games_won: lr.games_won,
    fiesta_games_played: lr.games_played,
    fiesta_games_won: lr.games_won,
    juego_games_played: (lr.football_games || 0) + (lr.culture_games || 0),
    juego_games_won: (lr.football_wins || 0) + (lr.culture_wins || 0),
    poker_chips_won: lr.poker_score || 0,
    poker_games_played: lr.poker_games || 0,
    megamix_games_played: lr.megamix_games || 0,
    megamix_games_won: lr.megamix_wins || 0,
    clasico_games_played: lr.clasico_games || 0,
    clasico_games_won: lr.clasico_wins || 0,
    picante_games_played: lr.picante_games || 0,
    picante_games_won: lr.picante_wins || 0,
    parchis_games_played: lr.parchis_games || 0,
    parchis_games_won: lr.parchis_wins || 0,
    coins: lr.coins || 0,
    gems: lr.gems || 0,
    level: lr.level || 1,
    xp: lr.xp || 0,
    poker_xp: lr.poker_xp || 0,
    poker_level: lr.poker_level || 1,
    parchis_xp: lr.parchis_xp || 0,
    parchis_level: lr.parchis_level || 1,
    unlocked_items: lr.unlocked_items || [],
    equipped_items: lr.equipped_items || {},
    updated_at: lr.updated_at,
  };
}

export function useRanking() {
  const [rankings, setRankings] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = useCallback(async () => {
    try {
      setLoading(true);

      // Always load local rankings first
      const localData = loadLocalRankings();
      const localStats = localData.map(localToPlayerStats);

      if (!isSupabaseConfigured) {
        // Use local data only
        setRankings(localStats);
        setError(null);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .order('games_won', { ascending: false })
          .limit(100);

        if (fetchError) throw fetchError;

        const cloudStats = (data as PlayerStats[]) || [];

        // Merge: cloud + local (prefer cloud if name matches, add local-only entries)
        const merged = [...cloudStats];
        for (const ls of localStats) {
          const exists = merged.some(cs => safeLower(cs.name) === safeLower(ls.name));
          if (!exists) {
            merged.push(ls);
          } else {
            // Update cloud entry with any higher local stats
            const idx = merged.findIndex(cs => safeLower(cs.name) === safeLower(ls.name));
            if (idx >= 0) {
              const cloud = merged[idx];
              merged[idx] = {
                ...cloud,
                games_played: Math.max(cloud.games_played, ls.games_played),
                games_won: Math.max(cloud.games_won, ls.games_won),
              };
            }
          }
        }

        merged.sort((a, b) => b.games_won - a.games_won);
        setRankings(merged);
        setError(null);
      } catch (err) {
        // Supabase failed, use local data as fallback
        console.warn('Supabase fetch failed, using local rankings:', err);
        setRankings(localStats);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el ranking');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('user_stats_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_stats' },
        () => {
          fetchRankings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRankings]);

  const updatePlayerScore = async (
    playerName: string,
    scoreToAdd: number,
    won: boolean = false,
    avatarUrl?: string,
    city?: string,
    gameMode: string = 'megamix',
    brutalMeta?: BrutalMeta,
    gameId?: string
  ) => {
    try {
      // ALWAYS save locally first — this is the guaranteed persistence layer
      upsertLocalRanking({
        playerName,
        scoreToAdd,
        won,
        avatarUrl,
        city,
        gameMode,
        brutalMeta,
      });

      // Then try Supabase as cloud backup
      if (isSupabaseConfigured) {
        const actGameId = gameId || `local-${Date.now()}-${Math.random()}`;
        const tabId = TAB_MAPPING.fiesta.includes(gameMode as GameMode) ? 'fiesta' : 'juego';

        console.log(`Saving stats for ${playerName}, won: ${won}, score: ${scoreToAdd}`);

        try {
          const { error: insertError } = await supabase
            .rpc('register_guest_event', {
              p_game_id: actGameId,
              p_event_type: 'game_finish',
              p_actor_user_id: playerName,
              p_tab_id: tabId,
              p_mode_id: gameMode,
              p_play_mode: 'local',
              p_score: scoreToAdd,
              p_is_winner: !!won,
              p_player_name: playerName,
              p_avatar_url: avatarUrl || null
            });

          if (insertError) {
            console.warn("RPC register_guest_event error (local save was successful):", insertError.message);
          }
        } catch (rpcErr) {
          console.warn("Supabase RPC failed (local save was successful):", rpcErr);
        }
      }

      await fetchRankings();
    } catch (err) {
      console.error('Error updating player score:', err);
    }
  };

  const updatePlayerCity = async (playerName: string, city: string) => {
    // Not used in current iteration
  };

  const updateMultiplePlayers = async (
    players: Array<{ name: string; score: number; won: boolean; avatarUrl?: string; city?: string; gameMode?: string; brutalMeta?: BrutalMeta; gameId?: string }>
  ) => {
    try {
      for (const player of players) {
        await updatePlayerScore(player.name, player.score, player.won, player.avatarUrl, player.city, player.gameMode, player.brutalMeta, player.gameId);
      }
    } catch (err) {
      console.error('Error updating multiple players:', err);
    }
  };

  const getPlayerRank = (playerName: string): number => {
    const index = rankings.findIndex(r => safeLower(r.name) === safeLower(playerName));
    return index === -1 ? -1 : index + 1;
  };

  const getTopPlayers = (count: number = 10): PlayerStats[] => {
    return rankings.slice(0, count);
  };

  return {
    rankings,
    loading,
    error,
    fetchRankings,
    updatePlayerScore,
    updatePlayerCity,
    updateMultiplePlayers,
    getPlayerRank,
    getTopPlayers,
  };
}
