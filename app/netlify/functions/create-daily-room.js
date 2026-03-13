// Netlify Function: Creates a Daily.co room for video calls
// Env: DAILY_API_KEY must be set in Netlify
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    if (!DAILY_API_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'DAILY_API_KEY not configured' }),
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const roomName = body.roomName || `game-${Date.now()}`;

        const res = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DAILY_API_KEY}`,
            },
            body: JSON.stringify({
                name: roomName,
                privacy: 'public',
                properties: {
                    exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
                    enable_chat: false,
                    enable_knocking: false,
                    start_video_off: false,
                    start_audio_off: false,
                },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            // Room might already exist, try to fetch it
            if (res.status === 400 && errText.includes('already exists')) {
                const getRes = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
                    headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
                });
                if (getRes.ok) {
                    const existingRoom = await getRes.json();
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ url: existingRoom.url, name: existingRoom.name, reused: true }),
                    };
                }
            }
            throw new Error(`Daily API error: ${res.status} ${errText}`);
        }

        const room = await res.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ url: room.url, name: room.name }),
        };
    } catch (err) {
        console.error('Create room error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
