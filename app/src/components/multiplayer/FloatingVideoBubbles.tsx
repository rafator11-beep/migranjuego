import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useDailyVideo } from './DailyVideoProvider';

interface FloatingVideoBubblesProps {
    playerName?: string;
}

function VideoTile({ videoTrack, audioTrack, userName, isLocal }: {
    videoTrack: MediaStreamTrack | null;
    audioTrack: MediaStreamTrack | null;
    userName: string;
    isLocal: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            videoRef.current.srcObject = new MediaStream([videoTrack]);
        }
    }, [videoTrack]);

    useEffect(() => {
        if (audioRef.current && audioTrack && !isLocal) {
            audioRef.current.srcObject = new MediaStream([audioTrack]);
        }
    }, [audioTrack, isLocal]);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 shadow-lg ${isLocal ? 'border-emerald-400 shadow-emerald-400/20' : 'border-white/30'
                }`}
        >
            {videoTrack ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className="w-full h-full object-cover"
                // NO mirror — user requested no espejo
                />
            ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-lg font-bold text-white/60">{userName.charAt(0).toUpperCase()}</span>
                </div>
            )}

            {/* Audio element for remote participants */}
            {!isLocal && audioTrack && (
                <audio ref={audioRef} autoPlay playsInline />
            )}

            {/* Name label */}
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-center py-0.5">
                <span className="text-[8px] md:text-[10px] font-bold text-white truncate block px-1">
                    {isLocal ? 'Tú' : userName}
                </span>
            </div>

            {/* No video indicator */}
            {!videoTrack && (
                <div className="absolute top-1 right-1">
                    <VideoOff size={10} className="text-red-400" />
                </div>
            )}
        </motion.div>
    );
}

export function FloatingVideoBubbles({ playerName }: FloatingVideoBubblesProps) {
    const { participants, isJoined, error } = useDailyVideo();
    const [collapsed, setCollapsed] = useState(false);

    // Show connection status even when not joined
    if (!isJoined && !error) return (
        <div className="fixed top-16 right-2 z-[100]">
            <div className="bg-yellow-500/80 text-black text-[10px] px-3 py-1 rounded-full font-bold animate-pulse">
                📹 Conectando video...
            </div>
        </div>
    );

    if (!isJoined && error) return (
        <div className="fixed top-16 right-2 z-[100]">
            <div className="bg-red-500/80 text-white text-[10px] px-3 py-1 rounded-full">
                ❌ {error}
            </div>
        </div>
    );

    return (
        <div className="fixed top-16 right-2 z-[100] flex flex-col items-end gap-1">
            {/* Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
                {collapsed ? <Video size={14} /> : <VideoOff size={14} />}
            </button>

            {/* Video bubbles */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-2 items-end"
                    >
                        {participants.map(p => (
                            <VideoTile
                                key={p.sessionId}
                                videoTrack={p.videoTrack}
                                audioTrack={p.audioTrack}
                                userName={p.userName}
                                isLocal={p.isLocal}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error indicator */}
            {error && (
                <div className="bg-red-500/80 text-white text-[9px] px-2 py-1 rounded-full mt-1 max-w-[120px] truncate">
                    {error}
                </div>
            )}
        </div>
    );
}
