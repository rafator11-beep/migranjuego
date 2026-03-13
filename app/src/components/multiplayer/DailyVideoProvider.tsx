import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import Daily, { DailyCall, DailyParticipant } from '@daily-co/daily-js';

interface VideoParticipant {
    sessionId: string;
    userName: string;
    videoTrack: MediaStreamTrack | null;
    audioTrack: MediaStreamTrack | null;
    isLocal: boolean;
}

interface DailyVideoContextType {
    participants: VideoParticipant[];
    joinRoom: (roomUrl: string, userName: string) => Promise<void>;
    leaveRoom: () => void;
    isJoined: boolean;
    error: string | null;
}

const DailyVideoContext = createContext<DailyVideoContextType>({
    participants: [],
    joinRoom: async () => { },
    leaveRoom: () => { },
    isJoined: false,
    error: null,
});

export const useDailyVideo = () => useContext(DailyVideoContext);

// Create a Daily room — tries Netlify function first, falls back to direct API call
export async function createDailyRoom(roomName: string): Promise<{ url: string; name: string } | null> {
    // Method 1: Try Netlify function (works if deployed via git/CLI)
    try {
        const res = await fetch('/.netlify/functions/create-daily-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomName }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log('[Daily] Room created via Netlify function:', data);
            return data;
        }
        console.warn('[Daily] Netlify function failed (status:', res.status, '), trying direct API...');
    } catch {
        console.warn('[Daily] Netlify function not available, trying direct API...');
    }

    // Method 2: Direct API call using VITE env var
    const apiKey = (import.meta as any).env?.VITE_DAILY_API_KEY;
    if (!apiKey) {
        console.error('[Daily] No DAILY_API_KEY available (set VITE_DAILY_API_KEY in Netlify env vars)');
        return null;
    }

    try {
        // Try to create the room
        const createRes = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                name: roomName,
                privacy: 'public'
            }),
        });

        if (createRes.ok) {
            const room = await createRes.json();
            console.log('[Daily] Room created via direct API:', room.url);
            return { url: room.url, name: room.name };
        }

        // Room might already exist
        const errText = await createRes.text();
        if (createRes.status === 400 && errText.includes('already exists')) {
            const getRes = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
                headers: { Authorization: `Bearer ${apiKey}` },
            });
            if (getRes.ok) {
                const existingRoom = await getRes.json();
                console.log('[Daily] Room already exists:', existingRoom.url);
                return { url: existingRoom.url, name: existingRoom.name };
            }
        }

        console.error('[Daily] API error:', createRes.status, errText);
        return null;
    } catch (err) {
        console.error('[Daily] Failed to create room via direct API:', err);
        return null;
    }
}

function extractParticipant(p: DailyParticipant, isLocal: boolean): VideoParticipant {
    const videoTrack = p.tracks?.video?.persistentTrack || null;
    const audioTrack = p.tracks?.audio?.persistentTrack || null;
    return {
        sessionId: p.session_id,
        userName: p.user_name || 'Anónimo',
        videoTrack,
        audioTrack,
        isLocal,
    };
}

export function DailyVideoProvider({ children }: { children: ReactNode }) {
    const callRef = useRef<DailyCall | null>(null);
    const [participants, setParticipants] = useState<VideoParticipant[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateParticipants = useCallback(() => {
        const call = callRef.current;
        if (!call) return;
        try {
            const ps = call.participants();
            const list: VideoParticipant[] = [];
            if (ps.local) {
                list.push(extractParticipant(ps.local, true));
            }
            Object.values(ps).forEach((p: any) => {
                if (p.local) return;
                list.push(extractParticipant(p, false));
            });
            console.log('[Daily] Participants:', list.map(p => `${p.userName}(${p.isLocal ? 'local' : 'remote'}, v:${!!p.videoTrack}, a:${!!p.audioTrack})`).join(', '));
            setParticipants(list);
        } catch (err) {
            console.error('[Daily] Error updating participants:', err);
        }
    }, []);

    const joinRoom = useCallback(async (roomUrl: string, userName: string) => {
        try {
            console.log('[Daily] Joining:', roomUrl, 'as', userName);

            if (callRef.current) {
                try { await callRef.current.destroy(); } catch { /* */ }
                callRef.current = null;
            }

            const call = Daily.createCallObject({
                videoSource: true,
                audioSource: true,
            });
            callRef.current = call;

            call.on('joined-meeting', () => { console.log('[Daily] ✅ Joined meeting!'); updateParticipants(); });
            call.on('participant-joined', (e) => { console.log('[Daily] + Participant joined:', e?.participant?.user_name); updateParticipants(); });
            call.on('participant-left', () => { updateParticipants(); });
            call.on('participant-updated', () => { updateParticipants(); });
            call.on('track-started', (e) => { console.log('[Daily] 🎥 Track started:', e?.participant?.user_name, e?.track?.kind); updateParticipants(); });
            call.on('track-stopped', () => { updateParticipants(); });
            call.on('error', (e) => { console.error('[Daily] ❌ Error:', e); setError(e?.errorMsg || 'Video error'); });
            call.on('camera-error', (e) => { console.error('[Daily] 📷 Camera error:', e); });

            await call.join({ url: roomUrl, userName });
            console.log('[Daily] ✅ Join succeeded!');
            setIsJoined(true);
            setError(null);
            updateParticipants();
        } catch (err: any) {
            console.error('[Daily] ❌ Join failed:', err);
            setError(err?.message || 'Failed to join video call');
        }
    }, [updateParticipants]);

    const leaveRoom = useCallback(() => {
        if (callRef.current) {
            try { callRef.current.destroy(); } catch { /* */ }
            callRef.current = null;
        }
        setParticipants([]);
        setIsJoined(false);
    }, []);

    useEffect(() => {
        return () => {
            if (callRef.current) {
                try { callRef.current.destroy(); } catch { /* */ }
                callRef.current = null;
            }
        };
    }, []);

    return (
        <DailyVideoContext.Provider value={{ participants, joinRoom, leaveRoom, isJoined, error }}>
            {children}
        </DailyVideoContext.Provider>
    );
}
