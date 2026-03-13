import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useMultiplayer(roomId: string | null, isHost: boolean, playerName: string, onGameStateUpdate: (state: any) => void, onGuestAction?: (action: any) => void) {
    const [players, setPlayers] = useState<any[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        if (!roomId || !playerName) return;

        const channel = supabase.channel(`room:${roomId}`, {
            config: {
                presence: {
                    key: playerName, // Use name as key for simplicity, ideally ID
                },
            },
        });

        channel
            .on('broadcast', { event: 'game_state' }, ({ payload }) => {
                if (!isHost) {
                    onGameStateUpdate(payload);
                }
            })
            .on('broadcast', { event: 'guest_action' }, ({ payload }) => {
                if (isHost && onGuestAction) {
                    onGuestAction(payload);
                }
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const users = Object.keys(state).map(key => ({
                    name: key, // simplistic
                    ...state[key][0] // grab first instance metadata
                }));
                setPlayers(users);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ online_at: new Date().toISOString(), isHost });
                }
            });

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, playerName, isHost]);

    const broadcastState = (newState: any) => {
        if (isHost && channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'game_state',
                payload: newState,
            });
        }
    };

    const sendActionToHost = (action: any) => {
        if (!isHost && channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'guest_action',
                payload: action,
            });
        }
    };

    return { players, broadcastState, sendActionToHost };
}
