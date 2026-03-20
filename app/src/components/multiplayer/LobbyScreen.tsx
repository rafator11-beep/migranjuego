import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, LogIn, Plus, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LobbyScreenProps {
    onJoin: (roomId: string, isHost: boolean, mode?: string) => void;
    onBack: () => void;
    initialMode?: string;
    initialWaiting?: boolean;
    currentPlayer?: { name: string, avatar: string };
    roomId?: string | null;
}

export function LobbyScreen({ onJoin, onBack, initialMode, initialWaiting = false, currentPlayer, roomId }: LobbyScreenProps) {
    const [roomCode, setRoomCode] = useState(roomId || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isWaiting, setIsWaiting] = useState(initialWaiting);
    const [onlinePlayers, setOnlinePlayers] = useState<{ name: string, avatar: string, id: string }[]>([]);
    const [joinTimeout, setJoinTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');

        if (initialMode && !isWaiting) {
            window.history.replaceState({}, '', window.location.pathname);
            createRoom();
            return;
        }

        if (roomParam && roomParam.length === 4 && !isWaiting && !loading) {
            setRoomCode(roomParam.toUpperCase());

            // Critical fix: Consume the URL immediately to prevent infinite React loops
            window.history.replaceState({}, '', window.location.pathname);

            // If we don't have a player name, we need to go to guest setup first
            if (!currentPlayer) {
                onJoin(roomParam.toUpperCase(), false); // This will trigger guest setup in Index.tsx
            } else {
                handleJoinSubmit(roomParam.toUpperCase());
            }
        }
    }, [initialMode, currentPlayer, isWaiting, loading]);

    // Presence & Game State Listener
    useEffect(() => {
        if (!isWaiting || !roomCode) return;

        const channel = supabase.channel(`room:${roomCode}`, {
            config: {
                presence: {
                    key: currentPlayer?.name || 'guest'
                }
            }
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const presenceList: any[] = [];
                Object.values(state).forEach((presences: any) => {
                    presenceList.push(...presences);
                });
                setOnlinePlayers(presenceList.map(p => ({
                    name: p.name,
                    avatar: p.avatar,
                    id: p.id || Math.random().toString()
                })));
            })
            .on('broadcast', { event: 'game_start' }, ({ payload }) => {
                console.log("Game started broadcast received in Lobby");
                // The main Index.tsx handles routing if needed, or we force it here
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    if (joinTimeout) {
                        clearTimeout(joinTimeout);
                        setJoinTimeout(null);
                    }
                    if (currentPlayer) {
                        await channel.track({
                            id: Math.random().toString(36).substring(2, 9),
                            name: currentPlayer.name,
                            avatar: currentPlayer.avatar,
                            online_at: new Date().toISOString(),
                        });
                        console.log("Successfully joined and tracking presence in Lobby");
                    }
                } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
                    console.error("Channel error joining room");
                    toast.error("Error conectando a la sala. Reintentando...");
                }
            });

        return () => {
            supabase.removeChannel(channel);
            if (joinTimeout) clearTimeout(joinTimeout);
        };
    }, [isWaiting, roomCode, currentPlayer]);

    const createRoom = async () => {
        setLoading(true);
        setError('');
        const code = Math.random().toString(36).substring(2, 6).toUpperCase();
        onJoin(code, true, initialMode);
    };

    const copyInviteLink = () => {
        const url = `${window.location.origin}?room=${roomCode}`;
        navigator.clipboard.writeText(url);
        toast.success('Enlace copiado al portapapeles');
    };

    const handleJoinSubmit = async (codeOverride?: string) => {
        const codeToJoin = codeOverride || roomCode;
        if (codeToJoin.length < 4) {
            setError('Código inválido');
            return;
        }
        setLoading(true);
        setError('');

        // Timeout to prevent infinite waiting
        const timeout = setTimeout(() => {
            if (onlinePlayers.length === 0) {
                setError('No se pudo conectar a la sala o está vacía.');
                setIsWaiting(false);
                setLoading(false);
            }
        }, 10000);
        setJoinTimeout(timeout);

        onJoin(codeToJoin.toUpperCase(), false);
        setIsWaiting(true);
    };

    return (
        <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/90 backdrop-blur" aria-describedby="lobby-desc">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-black neon-text">Multijugador</CardTitle>
                    <p id="lobby-desc" className="sr-only">Pantalla de creación y unión a salas</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isWaiting ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">CÓDIGO DE SALA</p>
                                <p className="text-4xl font-mono font-black text-white tracking-widest">{roomCode}</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Jugadores en Sala ({onlinePlayers.length})
                                </h3>

                                {onlinePlayers.length === 0 && currentPlayer ? (
                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-1 animate-pulse">
                                            <Avatar className="h-12 w-12 border-2 border-dashed border-white/20">
                                                <AvatarImage src={currentPlayer.avatar} />
                                                <AvatarFallback>{currentPlayer.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium text-white/50">{currentPlayer.name} (Tú)</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-4 min-h-[80px]">
                                        {onlinePlayers.map((p, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex flex-col items-center gap-1"
                                            >
                                                <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                                                    <AvatarImage src={p.avatar} />
                                                    <AvatarFallback>{p.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-medium">{p.name}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="animate-pulse text-sm text-primary font-medium pt-2 text-center">
                                Esperando al anfitrión para iniciar...
                                {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
                            </div>

                            <div className="flex justify-center gap-2 pt-4">
                                <Button variant="outline" size="sm" onClick={copyInviteLink}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Invitar
                                </Button>
                            </div>
                            <Button variant="ghost" className="w-full text-red-400 hover:text-red-300" onClick={() => { setIsWaiting(false); setLoading(false); }}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* ... Existing Lobby Create/Join UI ... */}
                            <div className="space-y-2">
                                <Button className="w-full h-16 text-lg" onClick={createRoom} disabled={loading}>
                                    <Plus className="mr-2 h-6 w-6" />
                                    {initialMode ? 'Crear Sala para Jugar' : 'Crear Sala (Host)'}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    {initialMode ? 'La partida comenzará con el modo seleccionado' : 'Tú controlarás la partida.'}
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">O únete a una</span>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <Input
                                    placeholder="CÓDIGO DE SALA"
                                    className="text-center text-2xl tracking-widest uppercase font-mono h-14 pr-12"
                                    maxLength={4}
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                />
                                <div className="absolute right-2 top-0 h-full flex items-center">
                                    <Button variant="ghost" size="icon" onClick={() => copyInviteLink()} title="Copiar enlace">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="secondary" className="w-full h-12" onClick={() => handleJoinSubmit()} disabled={loading || roomCode.length < 4}>
                                    <LogIn className="mr-2" /> Unirse
                                </Button>
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            </div>

                            <Button variant="ghost" className="w-full" onClick={onBack}>Volver</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
