import { useState, useRef, useEffect } from 'react';
import { Camera, Users, Plus, X, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGameContext } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const { setAuthOverlayOpen, profile, user } = useAuth();
  const { savedPlayers, savePlayer } = useSavedPlayers();
  const [playerName, setPlayerName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.username && !playerName) {
       setPlayerName(profile.username);
    }
    if (profile?.avatar_url && !avatarUrl) {
       setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const [detectedGameMode, setDetectedGameMode] = useState<string | null>(null);
  const isTeamMode = game?.mode === 'yo_nunca_equipos' || detectedGameMode === 'yo_nunca_equipos';
  const [teamMembers, setTeamMembers] = useState<{ name: string; id: number }[]>([]);
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    const detectMode = async () => {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      const storedRoom = sessionStorage.getItem('current_room_id');
      const roomToCheck = roomParam || storedRoom;
      if (!roomToCheck && !game?.mode) return;
      if (game?.mode) {
        setDetectedGameMode(game.mode);
        return;
      }
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
      const compressed = await compressImageToDataUrl(file, 500, 0.7);
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
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleQuickJoin = () => {
    const randomNames = ['Ninja', 'Pirata', 'Astronauta', 'Mago', 'Robot', 'Dinosaurio', 'Unicornio', 'Fénix'];
    const randomAdjectives = ['Veloz', 'Astuto', 'Divertido', 'Valiente', 'Misterioso', 'Loco', 'Genial'];
    const name = `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)]}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
    setIsLoading(true);
    savePlayer(name, avatar);
    if (gameId) {
      addPlayer(name, avatar).then((newPlayer) => {
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
    if (!playerName.trim()) {
      toast.error('Selecciona o escribe tu nombre');
      return;
    }
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

  const filteredProfiles = savedPlayers.filter(
    (p) => !profileSearch || safeLower(p.name).includes(safeLower(profileSearch)),
  );

  return (
    <div className="min-h-screen bg-grid-pattern px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="surface-panel w-full max-w-4xl overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/8 p-6 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <span className="section-badge">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Perfil
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <h1 className="text-3xl font-black text-white md:text-4xl">
                  {isTeamMode ? 'Entra con tu equipo' : 'Prepara tu entrada'}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  Todo está más limpio para móvil: selecciona un perfil, añade foto y entra a la sala.
                </p>
              </div>

              {savedPlayers.length > 0 && (
                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">Perfiles guardados</p>
                    <p className="text-xs text-muted-foreground">Pulsa para reutilizar</p>
                  </div>
                  {savedPlayers.length > 6 && (
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar perfil"
                        value={profileSearch}
                        onChange={(e) => setProfileSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  )}
                  <div className="flex max-h-[220px] flex-wrap gap-2 overflow-y-auto pr-1">
                    {filteredProfiles.map((p, idx) => (
                      <button
                        key={`${p.name}-${idx}`}
                        onClick={() => handleSelectProfile(p.name, p.avatar_url)}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                          safeLower(playerName) === safeLower(p.name)
                            ? 'border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.16)] text-white'
                            : 'border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <Avatar className="h-7 w-7">
                          {p.avatar_url ? (
                            <AvatarImage src={p.avatar_url} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-muted text-xs">{p.name.charAt(0).toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="max-w-[110px] truncate font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {!user ? (
                <div className="mt-6 rounded-[24px] border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)] p-4 text-center">
                  <p className="text-sm font-semibold text-white mb-2">¿Juegas habitualmente?</p>
                  <Button onClick={() => setAuthOverlayOpen(true)} className="w-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-white font-bold rounded-xl h-11 border-none hover:opacity-90 transition-opacity shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Crear Cuenta Definitiva
                  </Button>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-green-500/30 bg-green-500/10 p-4 text-center">
                  <p className="text-sm font-semibold text-green-400">Sesión iniciada como {profile?.username || user.email}</p>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-3">
                  <button type="button" className="group relative" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="h-28 w-28 border-4 border-dashed border-white/15 transition group-hover:border-[hsl(var(--primary)/0.65)]">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-white/[0.05]">
                          <Camera className="h-8 w-8 text-muted-foreground transition group-hover:text-white" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground">
                      Añadir o cambiar foto
                    </span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Tu nombre {isTeamMode && '(capitán)'}</label>
                  <Input
                    placeholder="Ej. El Rey de la Fiesta"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="text-base"
                  />
                </div>

                {isTeamMode && (
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <Users className="h-4 w-4 text-[hsl(var(--accent))]" />
                      Añade a quienes van contigo
                    </div>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
                          <span className="text-sm text-white">{member.name}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-300" onClick={() => handleRemoveTeamMember(member.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        placeholder="Nombre del compañero"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTeamMember()}
                      />
                      <Button onClick={handleAddTeamMember} variant="secondary" className="px-4">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {teamMembers.length === 0 && <p className="mt-2 text-xs text-muted-foreground">Si juegas solo, puedes continuar sin añadir más nombres.</p>}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <Button onClick={handleJoin} disabled={!playerName.trim() || isLoading} className="h-12 w-full text-sm font-bold">
                    {isLoading ? 'Entrando...' : isTeamMode ? `Entrar con equipo (${teamMembers.length + 1})` : 'Entrar en la partida'}
                  </Button>
                  {!isTeamMode && (
                    <Button variant="secondary" onClick={handleQuickJoin} disabled={isLoading} className="h-12 w-full">
                      Nombre rápido aleatorio
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
