import { useState, useEffect } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PeerBubbles } from './PeerBubbles';
import { useGameContext } from '@/contexts/GameContext';

interface VideoChatProps {
    roomId: string;
    playerId: string;
}

export function VideoChatComponent({ roomId, playerId }: VideoChatProps) {
    const { setRemoteStreams, setLocalStream } = useGameContext();
    const [isUIVisible, setIsUIVisible] = useState(false);

    if (!roomId || !playerId) return null;

    return (
        <>
            {/* Toggle Button */}
            {/* Toggle Button */}
            {!isUIVisible && (
                <div className="fixed top-4 right-20 z-[9990]">
                    <Button
                        size="sm"
                        variant={"secondary"}
                        className="rounded-full shadow-lg border border-white/20 bg-background/80 backdrop-blur"
                        onClick={() => setIsUIVisible(true)}
                    >
                        <Video className="w-4 h-4 mr-1 text-primary" />
                        Ver Vídeos
                    </Button>
                </div>
            )}

            {/* Peer Bubbles Overlay - Always active to maintain mesh, but UI hidden by default */}
            <div className={isUIVisible ? "contents animate-in fade-in zoom-in duration-300" : "opacity-0 pointer-events-none absolute -inset-1 overflow-hidden h-0 w-0"}>
                <PeerBubbles
                    roomId={roomId}
                    playerId={playerId}
                    onClose={() => setIsUIVisible(false)}
                    onStreamsChange={setRemoteStreams}
                    onLocalStream={setLocalStream}
                />
            </div>
        </>
    );
}

