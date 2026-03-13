import { useState, useRef, useEffect } from 'react';
import { Camera, Users, Plus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGameContext } from '@/contexts/GameContext';
import { useSavedPlayers } from '@/hooks/useSavedPlayers';
import { compressImageToDataUrl } from '@/utils/imageCompression';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { safeLower } from '@/utils/safeText';

interface GuestSetupProps {
    onJoin: (name: string, avatar: string) => void;
    onBack: () => void;
}

export function GuestSetup({ onJoin, onBack }: GuestSetupProps) {
    const { addPlayer, gameId, game, setLocalPlayerId, createTeam, assignPlayerToTeam } = useGameContext();
    const { savedPlayers, savePlayer } = useSavedPlayers();
    const [playerName, setPlayerName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profileSearch, setProfileSearch] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Team Extension
    const [detectedGameMode, setDetectedGameMode] = useState<string | null>(null);
    const isTeamMode = game?.mode === 'yo_nunca_equipos' || detectedGameMode === 'yo_nunca_equipos';
    const [teamMembers, setTeamMembers] = useState<{ name: string, id: number }[]>([]);
    const [newMemberName, setNewMemberName] = useState('');

    useEffect(() => {
        const detectMode = async () => {
            const params = new URLSearchParams(window.location.search);
            const roomParam = params.get('room');
            const storedRoom = sessionStorage.getItem('current_room_id');
            const roomToCheck = roomParam || storedRoom;
            if (!roomToCheck && !game?.mode) return;
            if (game?.mode) { setDetectedGameMode(game.mode); return; }
            if (roomToCheck) {
                const { data: roomData } = await supabase.from('rooms').select('game_mode').eq('id', roomToCheck).single();
                if (roomData?.game_mode) setDetectedGameMode(roomData.game_mode);
            }
        };
        detectMode();
    }, [game?.mode]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImageToDataUrl(file, 500, 0.70);
            setAvatarUrl(compressed);
        } catch (err) {
            console.error('Error compressing image:', err);
            toast.error('Error al procesar la imagen');
        }
    };

    const handleSelectProfile = (name: string, avatar: string | null) => {
        setPlayerName(name);
        setAvatarUrl(avatar);
        toast.success(`Perfil: ${name}`);
    };

    const handleAddTeamMember = () => {
        if (!newMemberName.trim()) return;
        setTeamMembers([...teamMembers, { name: newMemberName.trim(), id: Date.now() }]);
        setNewMemberName('');
    };

    const handleRemoveTeamMember = (id: number) => {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
    };

    const handleQuickJoin = () => {
        const randomNames = ['Ninja', 'Pirata', 'Astronauta', 'Mago', 'Robot', 'Dinosaurio', 'Unicornio', 'Fénix'];
        const randomAdjectives = ['Veloz', 'Astuto', 'Divertido', 'Valiente', 'Misterioso', 'Loco', 'Genial'];
        const name = `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)]}`;
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        setIsLoading(true);
        savePlayer(name, avatar);
        if (gameId) {
            addPlayer(name, avatar).then(newPlayer => {
                if (newPlayer && setLocalPlayerId) setLocalPlayerId(newPlayer.id);
            });
        } else {
            sessionStorage.setItem('pending_player_name', name);
            sessionStorage.setItem('pending_player_avatar', avatar);
            sessionStorage.setItem('guest_setup_completed', 'true');
        }
        onJoin(name, avatar);
    };

    const handleJoin = async () => {
        if (!playerName.trim()) { toast.error('Selecciona o escribe tu nombre'); return; }
        setIsLoading(true);
        try {
            savePlayer(playerName.trim(), avatarUrl);
            if (gameId) {
                const captain = await addPlayer(playerName.trim(), avatarUrl || undefined);
                if (captain && setLocalPlayerId) setLocalPlayerId(captain.id);
                if (isTeamMode && captain) {
                    const team = await createTeam(`Equipo de ${playerName.trim()}`, '#10b981');
                    await assignPlayerToTeam(captain.id, team.id);
                    for (const member of teamMembers) {
                        const mdp = await addPlayer(member.name);
                        await assignPlayerToTeam(mdp.id, team.id);
                    }
                    toast.success('¡Equipo unido con éxito!');
                } else {
                    toast.success('¡Te has unido a la partida!');
                }
            } else {
                sessionStorage.setItem('pending_player_name', playerName.trim());
                if (avatarUrl) sessionStorage.setItem('pending_player_avatar', avatarUrl);
                if (isTeamMode && teamMembers.length > 0) sessionStorage.setItem('pending_team_members', JSON.stringify(teamMembers));
                sessionStorage.setItem('pending_game_mode', detectedGameMode || game?.mode || '');
                sessionStorage.setItem('guest_setup_completed', 'true');
                toast.info('Perfil guardado. Esperando al anfitrión...');
            }
            onJoin(playerName.trim(), avatarUrl || '');
        } catch (err) {
            console.error('Error joining game:', err);
            toast.error('Error al unirse a la partida');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProfiles = savedPlayers.filter(p =>
        !profileSearch || safeLower(p.name).includes(safeLower(profileSearch))
    );

    return (
        <div className="min-h-screen bg-background bg-grid-pattern p-4 flex flex-col items-center justify-center pt-8 overflow-y-auto">
            <div className="max-w-md w-full bg-card/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-primary/20 my-auto pb-12">
                <h1 className="text-2xl font-bold text-center mb-6 neon-text text-primary">
                    {isTeamMode ? 'Únete y crea tu Equipo' : 'Únete a la Partida'}
                </h1>

                {/* Saved Profiles Picker */}
                {savedPlayers.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-muted-foreground mb-2">👤 Selecciona tu perfil:</p>
                        {savedPlayers.length > 6 && (
                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar..."
                                    value={profileSearch}
                                    onChange={e => setProfileSearch(e.target.value)}
                                    className="pl-9 bg-secondary/50 border-white/10 h-9 text-sm"
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto py-1">
                            {filteredProfiles.map((p, idx) => (
                                <button
                                    key={`${p.name}-${idx}`}
                                    onClick={() => handleSelectProfile(p.name, p.avatar_url)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm
                                        ${safeLower(playerName) === safeLower(p.name)
                                            ? 'bg-primary/20 border-primary text-primary shadow-md'
                                            : 'bg-secondary/30 border-white/10 hover:bg-secondary/60 hover:border-white/20 text-white'
                                        }`}
                                >
                                    <Avatar className="h-7 w-7">
                                        {p.avatar_url ? (
                                            <AvatarImage src={p.avatar_url} className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-muted text-xs">{p.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="font-medium truncate max-w-[100px]">{p.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-white/5 mt-4 pt-3">
                            <p className="text-xs text-muted-foreground text-center">O crea un perfil nuevo:</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center gap-6">
                    {/* Avatar upload */}
                    <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-24 w-24 border-4 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                            {avatarUrl ? (
                                <AvatarImage src={avatarUrl} className="object-cover" />
                            ) : (
                                <AvatarFallback className="bg-muted">
                                    <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            Cambiar Foto
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    {/* Name input */}
                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium ml-1">Tu Nombre {isTeamMode && '(Capitán)'}</label>
                        <Input
                            placeholder="Ej: El Rey de la Fiesta"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="bg-secondary/50 border-white/10 text-lg py-6"
                        />
                    </div>

                    {/* Team section */}
                    {isTeamMode && (
                        <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-white/10 space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <Users className="w-5 h-5" /> Añade a los que están contigo
                            </div>
                            <ul className="space-y-2">
                                {teamMembers.map((member) => (
                                    <li key={member.id} className="flex justify-between items-center bg-slate-800 p-2 rounded-lg">
                                        <span className="font-medium px-2">{member.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleRemoveTeamMember(member.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                <Input placeholder="Nombre..." value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTeamMember()} className="bg-black/50" />
                                <Button onClick={handleAddTeamMember} variant="secondary" className="px-3 shrink-0"><Plus className="w-4 h-4" /></Button>
                            </div>
                            {teamMembers.length === 0 && <p className="text-xs text-muted-foreground">Si estás solo, no hace falta añadir más.</p>}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 w-full mt-2">
                        <Button onClick={handleJoin} disabled={!playerName.trim() || isLoading}
                            className={`w-full hover:bg-primary/90 text-primary-foreground font-bold h-12 ${isTeamMode ? 'bg-green-600 hover:bg-green-700' : 'bg-primary'}`}>
                            {isLoading ? 'Uniéndose...' : (isTeamMode ? `¡Entrar con Equipo de ${teamMembers.length + 1}!` : '¡Listo, Entrar!')}
                        </Button>
                        {!isTeamMode && (
                            <>
                                <div className="relative flex justify-center text-xs uppercase my-1">
                                    <span className="bg-card px-2 text-muted-foreground">O también</span>
                                </div>
                                <Button variant="secondary" onClick={handleQuickJoin} disabled={isLoading} className="w-full h-12 border-primary/20 hover:border-primary/50">
                                    Unirse Rápido (Nombre azar)
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" onClick={onBack} disabled={isLoading} className="w-full text-xs text-muted-foreground mt-2">Atrás</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
