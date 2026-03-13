import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { loadLocalRankings, saveLocalRankings } from '@/utils/localRanking';

interface UserProfile {
    id: string;
    username: string;
    coins: number;
    gems: number;
    avatar_url?: string | null;
    equipped_items?: Record<string, string>;
    total_xp?: number;
    games_played?: number;
    total_wins?: number;
}

interface AuthContextType {
    user: any | null;
    profile: UserProfile | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, username: string, avatarUrl?: string) => Promise<void>;
    signOut: () => Promise<void>;
    syncEconomy: (coins: number, gems: number) => Promise<void>;
    syncGameEnd: (xpGained: number, won: boolean) => Promise<void>;
    equipItem: (category: string, itemId: string) => Promise<void>;
    isAuthOverlayOpen: boolean;
    setAuthOverlayOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: false,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    syncEconomy: async () => { },
    syncGameEnd: async () => { },
    equipItem: async () => { },
    isAuthOverlayOpen: false,
    setAuthOverlayOpen: () => { },
});

export const useAuth = () => useContext(AuthContext);

// Timeout wrapper for Supabase calls to prevent infinite loading
async function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Tiempo de espera agotado. Comprueba tu conexión.')), ms)
        )
    ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Start false - don't block UI
    const [isAuthOverlayOpen, setAuthOverlayOpen] = useState(() => {
        // Only show if no local player name AND no cached session
        return !localStorage.getItem('fiesta_player_name');
    });

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        // Get initial session with timeout
        withTimeout(supabase.auth.getSession(), 5000)
            .then(({ data: { session } }: any) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                }
            })
            .catch(() => {
                // Timeout or error - just continue as guest
                setIsLoading(false);
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const result: any = await withTimeout(
                supabase.from('profiles').select('*').eq('id', userId).single(),
                5000
            );
            const { data, error } = result;

            if (error && error.code !== 'PGRST116') {
                console.warn("Profile fetch warning:", error.message);
            }

            if (data) {
                setProfile(data);
                // Sync local cache
                const rankings = loadLocalRankings();
                if (rankings.length > 0) {
                    rankings[0].coins = data.coins || 0;
                    rankings[0].gems = data.gems || 0;
                    saveLocalRankings(rankings);
                }
            } else {
                // Auto-create profile
                await createDefaultProfile(userId);
            }
        } catch (err: any) {
            console.warn("fetchProfile timeout/error:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultProfile = async (userId: string, username?: string, avatarUrl?: string) => {
        const initialLocal = loadLocalRankings()[0] || { coins: 100, gems: 10 };
        const newProfile: UserProfile = {
            id: userId,
            username: username || `Jugador-${Math.floor(Math.random() * 9999)}`,
            coins: initialLocal.coins || 100,
            gems: initialLocal.gems || 10,
            avatar_url: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
            equipped_items: {},
            total_xp: 0,
            games_played: 0,
            total_wins: 0,
        };

        try {
            const { error } = await supabase.from('profiles').upsert([newProfile], { onConflict: 'id' });
            if (!error) {
                setProfile(newProfile);
            }
        } catch (e) {
            // Silently set profile locally even if DB fails
            setProfile(newProfile);
        }
        return newProfile;
    };

    const syncEconomy = async (coins: number, gems: number) => {
        if (!user || !isSupabaseConfigured) return;
        try {
            await supabase.from('profiles').update({ coins, gems }).eq('id', user.id);
            if (profile) setProfile({ ...profile, coins, gems });
        } catch (err) {
            console.warn("syncEconomy error:", err);
        }
    };

    const syncGameEnd = async (xpGained: number, won: boolean) => {
        if (!user || !isSupabaseConfigured || !profile) return;
        try {
            const newXp = (profile.total_xp || 0) + xpGained;
            const newPlayed = (profile.games_played || 0) + 1;
            const newWins = (profile.total_wins || 0) + (won ? 1 : 0);
            const newLevel = Math.floor(newXp / 100) + 1;

            await supabase.from('profiles').update({
                total_xp: newXp,
                games_played: newPlayed,
                total_wins: newWins,
                level: newLevel,
            }).eq('id', user.id);

            setProfile(prev => prev ? {
                ...prev,
                total_xp: newXp,
                games_played: newPlayed,
                total_wins: newWins,
            } : null);
        } catch (err) {
            console.warn("syncGameEnd error:", err);
        }
    };

    const equipItem = async (category: string, itemId: string) => {
        if (profile) {
            const newEquip = { ...(profile.equipped_items || {}), [category]: itemId };
            setProfile(prev => prev ? { ...prev, equipped_items: newEquip } : null);
            if (isSupabaseConfigured && user) {
                try {
                    await supabase.from('profiles').update({ equipped_items: newEquip }).eq('id', user.id);
                } catch (e) {
                    console.warn("equipItem error:", e);
                }
            }
        }
    };

    const signIn = async (email: string, pass: string) => {
        if (!isSupabaseConfigured) {
            throw new Error('Supabase no está configurado. Juega como invitado.');
        }
        const result: any = await withTimeout(
            supabase.auth.signInWithPassword({ email, password: pass }),
            10000
        );
        if (result?.error) throw result.error;
    };

    const signUp = async (email: string, pass: string, username: string, avatarUrl?: string) => {
        if (!isSupabaseConfigured) {
            throw new Error('Supabase no está configurado. Juega como invitado.');
        }

        // Sign up without metadata to avoid 400 errors from strict Supabase configs
        const result: any = await withTimeout(
            supabase.auth.signUp({ email, password: pass }),
            10000
        );
        const { data, error } = result;

        if (error) throw error;

        // Create profile separately after signup
        if (data.user) {
            await createDefaultProfile(data.user.id, username, avatarUrl);
            // Save player name locally for guest fallback
            localStorage.setItem('fiesta_player_name', username || 'Jugador');
        }
    };

    const signOut = async () => {
        if (!isSupabaseConfigured) return;
        try {
            await supabase.auth.signOut();
        } catch { }
        setProfile(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, profile, isLoading, signIn, signUp, signOut,
            syncEconomy, syncGameEnd, equipItem,
            isAuthOverlayOpen, setAuthOverlayOpen,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
