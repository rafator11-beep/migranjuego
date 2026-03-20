import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JitsiVideo({ roomId, playerId, onClose }: { roomId: string, playerId: string, onClose: () => void }) {
    // We use a specific room name
    const jitsiRoom = `fiestaparty-${roomId}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-4 z-[9998] w-64 h-48 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20"
            drag
            dragMomentum={false}
        >
            <div className="absolute top-2 right-2 z-10">
                <Button size="icon" variant="ghost" className="h-6 w-6 bg-black/50 hover:bg-black/80 text-white rounded-full" onClick={onClose}>
                    <X className="w-3 h-3" />
                </Button>
            </div>

            <iframe
                src={`https://meet.jit.si/${jitsiRoom}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName=${playerId}&config.prejoinPageEnabled=false`}
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
        </motion.div>
    );
}
