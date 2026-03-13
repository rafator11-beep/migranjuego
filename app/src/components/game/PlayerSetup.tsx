import { useState, useRef, useEffect, useMemo } from 'react';
import { safeLower, asString } from '@/utils/safeText';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Plus, X, Camera, Users, Play, ArrowLeft, History, Trash2, UserPlus, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGameContext } from '@/contexts/GameContext';
import { GAME_MODES, TEAM_COLORS } from '@/types/game';
import { useSavedPlayers } from '@/hooks/useSavedPlayers';
import { compressImageToDataUrl } from '@/utils/imageCompression';
import { useRanking } from '@/hooks/useRanking';
import { ChatComponent } from '@/components/multiplayer/ChatComponent';
import { supabase } from '@/integrations/supabase/client';
// Dialog imports removed (unused)

// Wrapper to avoid prop drilling issues or valid types
const ChatEmbed = ({ roomId, playerName }: { roomId: string, playerName: string }) => (
  <ChatComponent roomId={roomId} playerName={playerName} />
);

interface PlayerSetupProps {
  onStart: () => void;
  onBack: () => void;
  isTeamMode?: boolean;
  isMultiplayer?: boolean;
  roomId?: string | null;
}

export function PlayerSetup({ onStart, onBack, isTeamMode: forceTeamMode, isMultiplayer, roomId }: PlayerSetupProps) {
  const { game, players, teams, addPlayer, removePlayer, createTeam, assignPlayerToTeam, startGame } = useGameContext();
  const { savedPlayers, savePlayer, removeFromSaved } = useSavedPlayers();
  const { rankings } = useRanking();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const [showSavedPlayers, setShowSavedPlayers] = useState(true);
  const [savedSearch, setSavedSearch] = useState('');

  // Merge saved players with all DB rankings for a complete pool
  const allKnownPlayers = (() => {
    const merged = [...savedPlayers];
    for (const r of rankings) {
      if (!merged.some(p => safeLower(p.name) === safeLower(r.name))) {
        // If they have an equipped avatar, use it, otherwise fallback to avatar_url
        const effectiveAvatar = r.equipped_items?.avatar || r.avatar_url;
        merged.push({ name: asString(r.name), avatar_url: effectiveAvatar });
      }
    }
    return merged;
  })();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null);

  const modeInfo = GAME_MODES.find(m => m.id === game?.mode);
  // Fix: Prioritize the prop passed from Index.tsx (User selection). Fallback to mode config only if prop is undefined.
  const isTeamMode = forceTeamMode !== undefined ? forceTeamMode : (modeInfo?.teamBased || false);
  const minPlayers = isTeamMode ? 4 : 2;
  // New: Max players for 1vs1 modes in individual play
  const is1vs1 = !isTeamMode && (game?.mode === 'futbol' || game?.mode === 'cultura' || game?.mode === 'trivia_futbol' || game?.mode === 'tictactoe');
  const maxPlayers = is1vs1 ? 2 : 20;

  const handleAddPlayer = async (name?: string, avatarUrl?: string | null) => {
    const playerName = name || newPlayerName.trim();
    const playerAvatar = avatarUrl !== undefined ? avatarUrl : pendingAvatarUrl;

    if (!playerName) return;

    if (players.length >= maxPlayers) {
      toast.error(`Máximo ${maxPlayers} jugadores en este modo`);
      return;
    }

    setIsLoading(true);
    try {
      if (name?.toLowerCase().includes('bot')) {
        await addPlayer(name, avatarUrl || undefined);
      } else {
        await addPlayer(playerName, playerAvatar || undefined);
        savePlayer(playerName, playerAvatar); // Save to localStorage
      }
      setNewPlayerName('');
      setPendingAvatarUrl(null);
      // keep history open for faster adding
      setShowSavedPlayers(true);
    } catch (err) {
      console.error('Error adding player:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-add logged/saved player for ALL modes (local and multiplayer)
  useEffect(() => {
    if (players.length === 0 && !isLoading) {
      // Try localStorage profile first (set by AuthOverlay)
      const localName = localStorage.getItem('fiesta_player_name');
      const localAvatar = localStorage.getItem('fiesta_player_avatar');

      const candidate = localName
        ? { name: localName, avatar_url: localAvatar || '' }
        : (savedPlayers.length > 0 ? savedPlayers[0] : null);

      if (candidate) {
        const doAdd = async () => {
          setIsLoading(true);
          try {
            await addPlayer(candidate.name, candidate.avatar_url);
            toast.success(`${candidate.name} añadido automáticamente`);
          } catch (e) {
            console.error("Auto-add failed", e);
          } finally {
            setIsLoading(false);
          }
        };
        doAdd();
      }
    }
  }, [players.length, savedPlayers]);

  // BRIDGE: Listen for room_participants and auto-add them as Game Players
  useEffect(() => {
    if (!isMultiplayer || !roomId) return;

    console.log("Host listening for participants in room:", roomId);

    // Initial fetch to get any players who joined while we were transitioning
    const syncExistingParticipants = async () => {
      const { data: participants } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId);

      if (participants) {
        for (const p of participants) {
          if (!players.some(gp => gp.name.toLowerCase() === p.name.toLowerCase())) {
            console.log("Auto-adding existing participant:", p.name);
            addPlayer(p.name, p.avatar_url).catch(console.error);
          }
        }
      }
    };
    syncExistingParticipants();

    const channel = supabase
      .channel(`sync-participants-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      }, payload => {
        const newPart = payload.new;
        // Check if player already exists in the game to avoid duplicates
        if (!players.some(gp => gp.name.toLowerCase() === newPart.name.toLowerCase())) {
          console.log("New participant detected, auto-adding to game:", newPart.name);
          addPlayer(newPart.name, newPart.avatar_url).catch(console.error);
          toast.info(`${newPart.name} se ha unido a la sala`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMultiplayer, roomId, players, addPlayer]);

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayer(playerId);
      toast.success('Jugador eliminado');
    } catch (err) {
      console.error('Error removing player:', err);
      toast.error('No se pudo eliminar al jugador');
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    setIsLoading(true);
    try {
      await createTeam(newTeamName.trim(), TEAM_COLORS[selectedColorIndex]);
      setNewTeamName('');
      setShowTeamCreator(false);
      setSelectedColorIndex((selectedColorIndex + 1) % TEAM_COLORS.length);
    } catch (err) {
      console.error('Error creating team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToTeam = async (playerId: string, teamId: string | null) => {
    try {
      await assignPlayerToTeam(playerId, teamId);
    } catch (err) {
      console.error('Error assigning player:', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant preview while compressing (avoids perceived lag)
    const quickUrl = URL.createObjectURL(file);
    setPendingAvatarUrl(quickUrl);

    // Compress off the main flow
    setTimeout(async () => {
      try {
        // Increased quality for avatars
        const compressed = await compressImageToDataUrl(file, 800, 0.90);
        setPendingAvatarUrl(compressed);
      } catch (err) {
        console.error('Error compressing image:', err);
      } finally {
        URL.revokeObjectURL(quickUrl);
      }
    }, 0);
  };

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      await startGame();
      onStart();
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canStart = players.length >= minPlayers &&
    (!isTeamMode || (teams.length >= 2 && players.every(p => p.team_id)));

  // --- Lobby “zona baile” (solo modos NO equipo) ---
  const lobbyRef = useRef<HTMLDivElement | null>(null);
  const ballElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const ballsRef = useRef<Record<string, { x: number; y: number; vx: number; vy: number }>>({});

  const lobbyPlayers = useMemo(() => {
    return players.map(p => {
      // Find ranking to get equipped avatar
      const playerRanking = rankings.find(r => safeLower(r.name) === safeLower(p.name));
      const effectiveAvatar = playerRanking?.equipped_items?.avatar || p.avatar_url || null;
      return {
        id: p.id,
        name: p.name,
        avatar_url: effectiveAvatar,
      };
    });
  }, [players, rankings]);

  useEffect(() => {
    if (isTeamMode) return;
    const el = lobbyRef.current;
    if (!el) return;

    const size = 52; // avatar “bola”
    const seedBall = (id: string) => {
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      ballsRef.current[id] = {
        x: Math.random() * Math.max(1, w - size),
        y: Math.random() * Math.max(1, h - size),
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
      };
    };

    // Ensure balls exist for all players
    const nextIds = new Set(lobbyPlayers.map(p => p.id));
    for (const p of lobbyPlayers) {
      if (!ballsRef.current[p.id]) seedBall(p.id);
    }
    // Remove balls for players no longer present
    for (const id of Object.keys(ballsRef.current)) {
      if (!nextIds.has(id)) delete ballsRef.current[id];
    }

    let raf = 0;
    const tick = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      for (const id of Object.keys(ballsRef.current)) {
        const b = ballsRef.current[id];
        if (!b) continue;

        b.x += b.vx;
        b.y += b.vy;

        // bounce
        if (b.x <= 0 || b.x >= w - size) b.vx *= -1;
        if (b.y <= 0 || b.y >= h - size) b.vy *= -1;

        // clamp (avoid getting stuck outside)
        b.x = Math.min(Math.max(0, b.x), Math.max(0, w - size));
        b.y = Math.min(Math.max(0, b.y), Math.max(0, h - size));

        const node = ballElsRef.current[id];
        if (node) node.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isTeamMode, lobbyPlayers]);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern p-4 md:p-8 relative overflow-hidden">
      {/* Neon background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))] opacity-10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-blue))] opacity-10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:neon-box">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 neon-text text-[hsl(var(--primary))]">
              {modeInfo?.icon} {modeInfo?.name}
            </h1>
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground">Configura los jugadores</p>
              {isMultiplayer && roomId && (
                <div
                  className="mt-1 flex items-center gap-2 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => {
                    const url = `${window.location.origin}?room=${roomId}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Enlace de invitación copiado');
                  }}
                >
                  <span className="text-xs font-mono font-bold text-primary">SALA: {roomId}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Player Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg neon-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                Añadir Jugador
              </h2>
              {allKnownPlayers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSavedPlayers(!showSavedPlayers)}
                  className="text-xs hover:neon-box"
                >
                  <History className="h-4 w-4 mr-1" />
                  Jugadores ({allKnownPlayers.length})
                </Button>
              )}
            </div>

            {/* Saved Players Dropdown */}
            <AnimatePresence>
              {showSavedPlayers && allKnownPlayers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-secondary/30 rounded-xl border border-border/50 max-h-[200px] overflow-y-auto"
                >
                  <p className="text-xs text-muted-foreground mb-2">Historial (toca para añadir rápido):</p>
                  <Input
                    value={savedSearch}
                    onChange={(e) => setSavedSearch(e.target.value)}
                    placeholder="Buscar jugador..."
                    className="mb-2 h-8"
                  />
                  <div className="flex flex-wrap gap-2">
                    {allKnownPlayers
                      .filter(sp => !players.some(p => safeLower(p.name) === safeLower(sp.name)))
                      .filter(sp => safeLower(sp.name).includes(safeLower(savedSearch)))
                      .slice(0, 50)
                      .map((savedPlayer) => (
                        <div
                          key={savedPlayer.name}
                          className="flex items-center gap-2 bg-background/50 rounded-full pl-1 pr-2 py-1 border border-border/50 hover:neon-border transition-all cursor-pointer group"
                          onClick={() => handleAddPlayer(savedPlayer.name, savedPlayer.avatar_url)}
                        >
                          <Avatar className="h-6 w-6">
                            {savedPlayer.avatar_url ? (
                              <AvatarImage src={savedPlayer.avatar_url} />
                            ) : (
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {savedPlayer.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm">
                            {savedPlayer.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromSaved(savedPlayer.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mb-4">
              <div
                className="relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-14 w-14 border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                  {pendingAvatarUrl ? (
                    <AvatarImage src={pendingAvatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Nombre del jugador"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                  className="flex-1 bg-secondary/50 border-border/50"
                />

                {/* Chat Button removed - moved to Global Layout */}

                <Button onClick={() => handleAddPlayer()} disabled={!newPlayerName.trim() || isLoading} className="neon-border hover:neon-box">
                  <Plus className="h-4 w-4" />
                </Button>

                {(game?.mode === 'poker' || game?.mode === 'parchis') && (
                  <Button
                    onClick={() => handleAddPlayer(`Bot ${players.filter(p => p.name.includes('Bot')).length + 1}`, 'https://api.dicebear.com/7.x/bottts/svg?seed=' + Math.random())}
                    disabled={isLoading || players.length >= maxPlayers}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Bot
                  </Button>
                )}
              </div>
            </div>

              {/* Players List - Bubble Grid */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Jugadores ({players.length})</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Add a random bot
                      const botName = `Bot ${Math.floor(Math.random() * 999)}`;
                      handleAddPlayer(botName, 'https://api.dicebear.com/7.x/bottts/svg?seed=' + Math.random());
                    }}
                    className="text-xs hover:neon-box"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Bot
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Remove last player
                      if (players.length > 0) {
                        handleRemovePlayer(players[players.length - 1].id);
                      }
                    }}
                    className="text-xs hover:neon-box"
                  >
                    <UserX className="h-3 w-3 mr-1" />
                    Quitar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <AnimatePresence mode="popLayout">
                  {players.map((player) => {
                    const playerRanking = rankings.find(r => safeLower(r.name) === safeLower(player.name));
                    const effectiveAvatar = playerRanking?.equipped_items?.avatar || player.avatar_url;

                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm rounded-full p-3 border-2 border-white/20 hover:border-white/40 transition-all cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-14 w-14 ring-2 ring-white/30 group-hover:ring-white/60 transition-all">
                            {effectiveAvatar ? (
                              <AvatarImage src={effectiveAvatar} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/30 text-white font-medium text-lg">
                                {player.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm font-medium text-center truncate w-full text-white">
                            {player.name}
                          </span>
                        </div>
                        
                        {/* Selection state */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 text-red-400 hover:text-red-300 bg-gradient-to-br from-black/30 to-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePlayer(player.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {players.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-white/60 mb-2">No hay jugadores</div>
                  <div className="text-xs text-white/40">Añade al menos {minPlayers} para empezar</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Teams Section (for team-based modes) */}
          {isTeamMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 shadow-lg border"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                👥 Equipos
              </h2>

              {showTeamCreator ? (
                <div className="mb-4 p-4 bg-muted/50 rounded-xl">
                  <Input
                    placeholder="Nombre del equipo"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex gap-2 mb-3">
                    {TEAM_COLORS.map((color, idx) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`w-8 h-8 rounded-full transition-transform ${selectedColorIndex === idx ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || isLoading} className="flex-1">
                      Crear Equipo
                    </Button>
                    <Button variant="outline" onClick={() => setShowTeamCreator(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => setShowTeamCreator(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Equipo
                </Button>
              )}

              <div className="space-y-3">
                {teams.map((team) => {
                  const teamPlayers = players.filter(p => p.team_id === team.id);
                  return (
                    <div
                      key={team.id}
                      className="p-4 rounded-xl border-2"
                      style={{ borderColor: team.color }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-semibold">{team.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {teamPlayers.length} jugadores
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teamPlayers.map(p => (
                          <span
                            key={p.id}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {teams.length < 2 && (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  Crea al menos 2 equipos para este modo
                </p>
              )}
            </motion.div>
          )}

          {/* Start Game Section */}
          {!isTeamMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-4 shadow-lg border"
            >
              <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{modeInfo?.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">Sala de espera</h3>
                    <p className="text-xs text-muted-foreground">
                      {players.length} jugador{players.length === 1 ? '' : 'es'} listo{players.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {modeInfo?.name}
                </div>
              </div>

              {/* Zona baile */}
              <div
                ref={lobbyRef}
                className="relative w-full h-[320px] rounded-2xl overflow-hidden border bg-black/80"
              >
                {/* glow */}
                <div className="absolute inset-0 opacity-60 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 20%, rgba(168,85,247,0.25), transparent 35%), radial-gradient(circle at 80% 60%, rgba(236,72,153,0.20), transparent 45%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.14), transparent 45%)'
                  }}
                />

                {/* Avatares rebotando */}
                {lobbyPlayers.map((p) => (
                  <div
                    key={p.id}
                    ref={(node) => {
                      ballElsRef.current[p.id] = node;
                    }}
                    className="absolute top-0 left-0 w-[52px] h-[52px] rounded-full overflow-hidden border-2 shadow-[0_0_12px_rgba(168,85,247,0.45)]"
                    style={{ borderColor: 'rgba(168,85,247,0.9)' }}
                    title={p.name}
                  >
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                        <span className="font-black text-white">
                          {p.name?.trim()?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Botón central épico */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={!canStart || isLoading}
                    className="px-6 py-3 rounded-full font-extrabold text-white border border-white/10 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      animation: 'pulse-neon 1.9s ease-in-out infinite',
                    }}
                  >
                    ▶ Empezar partida
                  </button>
                </div>

                <style>{`
                  @keyframes pulse-neon {
                    0% { transform: translateZ(0) scale(1); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.55); }
                    70% { transform: translateZ(0) scale(1.04); box-shadow: 0 0 0 18px rgba(168, 85, 247, 0); }
                    100% { transform: translateZ(0) scale(1); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                  }
                `}</style>
              </div>

              <p className="mt-3 text-xs text-muted-foreground text-center px-2">
                Tip: si una foto se ve mal, usa una URL directa o súbela a Supabase Storage en <b>public</b>.
              </p>
            </motion.div>
          )}
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Button
            size="lg"
            onClick={handleStartGame}
            disabled={!canStart || isLoading}
            className="text-lg px-8 py-6 h-auto"
          >
            <Play className="h-5 w-5 mr-2" />
            {isLoading ? 'Iniciando...' : 'Empezar Partida'}
          </Button>

          {!canStart && (
            <p className="text-sm text-muted-foreground mt-2">
              {players.length < minPlayers
                ? `Añade al menos ${minPlayers - players.length} jugador(es) más`
                : isTeamMode && teams.length < 2
                  ? 'Crea al menos 2 equipos'
                  : isTeamMode && players.some(p => !p.team_id)
                    ? 'Asigna todos los jugadores a un equipo'
                    : ''}
            </p>
          )}
        </motion.div>
      </motion.div >
    </div >
  );
}