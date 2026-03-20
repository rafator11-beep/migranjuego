import { useState, useEffect, useCallback } from 'react';
import { safeLower, asString } from '@/utils/safeText';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export interface SavedPlayer {
  name: string;
  avatar_url: string | null;
}

const STORAGE_KEY = 'fiesta-party-saved-players';

export function useSavedPlayers() {
  const [savedPlayers, setSavedPlayers] = useState<SavedPlayer[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadPlayers = useCallback(async () => {
    // If Supabase is not configured, only use localStorage
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try { setSavedPlayers(JSON.parse(stored)); } catch { /* */ }
      }
      setLoaded(true);
      return;
    }

    // Supabase IS configured → always rebuild from DB (source of truth)
    const merged: SavedPlayer[] = [];

    // Load from players table (all historical game participants)
    try {
      const { data: gamePlayers } = await supabase
        .from('players')
        .select('name, avatar_url')
        .not('name', 'ilike', '%bot%')
        .order('created_at', { ascending: false })
        .limit(200);

      if (gamePlayers) {
        for (const gp of gamePlayers) {
          if (gp.name && !merged.some(p => safeLower(p.name) === safeLower(gp.name))) {
            merged.push({ name: asString(gp.name), avatar_url: gp.avatar_url });
          }
        }
      }
    } catch { /* table may not exist */ }

    // Also load from user_stats
    try {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('name, avatar_url')
        .not('name', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(100);

      if (stats) {
        for (const s of stats) {
          if (s.name && !merged.some(p => safeLower(p.name) === safeLower(s.name))) {
            merged.push({ name: asString(s.name), avatar_url: s.avatar_url });
          }
        }
      }
    } catch { /* table may not exist */ }

    // Also try player_rankings
    try {
      const { data: rankings } = await supabase
        .from('player_rankings')
        .select('player_name, avatar_url')
        .order('updated_at', { ascending: false })
        .limit(100);

      if (rankings) {
        for (const r of rankings) {
          if (r.player_name && !merged.some(p => safeLower(p.name) === safeLower(r.player_name))) {
            merged.push({ name: asString(r.player_name), avatar_url: r.avatar_url });
          }
        }
      }
    } catch { /* table may not exist */ }

    // Replace localStorage with fresh data
    setSavedPlayers(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const savePlayer = (name: string, avatar_url: string | null) => {
    const existingIndex = savedPlayers.findIndex(p => safeLower(p.name) === safeLower(name));
    let updated: SavedPlayer[];

    if (existingIndex >= 0) {
      updated = [...savedPlayers];
      updated[existingIndex] = { name: asString(name), avatar_url };
    } else {
      updated = [...savedPlayers, { name: asString(name), avatar_url }];
    }

    setSavedPlayers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeFromSaved = (name: string) => {
    const updated = savedPlayers.filter(p => safeLower(p.name) !== safeLower(name));
    setSavedPlayers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearSavedPlayers = () => {
    setSavedPlayers([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    savedPlayers,
    loaded,
    savePlayer,
    removeFromSaved,
    clearSavedPlayers,
    refreshPlayers: loadPlayers,
  };
}