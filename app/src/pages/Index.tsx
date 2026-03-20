import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { GameProvider, useGameContext } from '@/contexts/GameContext';
import { FiestaTab } from '@/components/game/FiestaTab';
import { JuegoTab } from '@/components/game/JuegoTab';
import { TeamModeSelector } from '@/components/game/TeamModeSelector';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import { GuestSetup } from '@/components/game/GuestSetup';
import { GamePlay } from '@/components/game/GamePlay';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { GlobalPresence } from '@/components/auth/GlobalPresence';
import { WelcomeScreen } from '@/components/auth/WelcomeScreen';
import { BottomNav } from '@/components/layout/BottomNav';
type AppTab = 'inicio' | 'perfiles' | 'jugar' | 'historial' | 'ajustes' | 'arcade' | 'hall';
import { VideoChatComponent } from '@/components/multiplayer/VideoChatComponent';
import { GameHistory } from '@/pages/GameHistory';
import { AppSettings } from '@/pages/AppSettings';
import { ArcadeTab } from '@/components/arcade/ArcadeTab';
import { LobbyScreen } from '@/components/multiplayer/LobbyScreen';
import { ChatComponent } from '@/components/multiplayer/ChatComponent';
import { GameMode, GAME_MODES, TabId, PlayMode } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';
import { DailyVideoProvider, useDailyVideo, createDailyRoom } from '@/components/multiplayer/DailyVideoProvider';
import { FloatingVideoBubbles } from '@/components/multiplayer/FloatingVideoBubbles';
import { ParchisGame } from '@/components/game/ParchisGame';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Lazy load heavy/non-critical pages to avoid circular dependencies and reduce bundle size
const Profiles = lazy(() => import('@/pages/Profiles'));
// HallOfFame is likely a named export "export function HallOfFame...". 
// We handle this by returning the named export as "default" for lazy().
const HallOfFame = lazy(() => import('@/pages/HallOfFame').then(module => ({ default: module.HallOfFame })));

export type GameScreen = 'mode-select' | 'team-mode-select' | 'player-setup' | 'playing' | 'lobby' | 'guest-setup';

// Modes that support team play
const TEAM_CAPABLE_MODES: GameMode[] = ['cultura', 'trivia_futbol', 'futbol'];

function GameAppInner() {
  const [screen, setScreen] = useState<GameScreen>('mode-select');
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [mainTab, setMainTab] = useState<TabId>('fiesta');
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);

  // Multiplayer State
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [pendingTeamMembers, setPendingTeamMembers] = useState<any[]>([]);

  // We need auth context for economy checks
  const { profile } = useAuth();

  const [pendingPlayer, setPendingPlayer] = useState<{ name: string, avatar: string } | null>(null);

  // New state for Mode Options (Local vs Online)
  const [selectedModeForOptions, setSelectedModeForOptions] = useState<GameMode | null>(null);
  const [pendingHostMode, setPendingHostMode] = useState<GameMode | null>(null);

  // Game Context
  const { createGame, setGameId, players, localPlayerId, gameId, addPlayer, game, createTeam, assignPlayerToTeam, setLocalPlayerId } = useGameContext();
  const { joinRoom, leaveRoom, isJoined } = useDailyVideo();

  // Auto-join Daily.co video when online (roomId exists)
  useEffect(() => {
    if (!roomId) return;
    const playerName = pendingPlayer?.name || players.find(p => p.id === localPlayerId)?.name || 'Jugador';

    const joinVideo = async () => {
      if (isJoined) {
        console.log('[Daily] Already joined, skipping');
        return;
      }
      try {
        const dailyRoomName = `game-${roomId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30)}`;
        console.log('[Daily] Creating room:', dailyRoomName, 'for player:', playerName);
        const room = await createDailyRoom(dailyRoomName);
        console.log('[Daily] Room response:', room);
        if (room?.url) {
          console.log('[Daily] Joining room URL:', room.url);
          await joinRoom(room.url, playerName);
          console.log('[Daily] Joined successfully!');
        } else {
          console.error('[Daily] No room URL returned');
        }
      } catch (err) {
        console.error('[Daily] Error joining video:', err);
      }
    };
    joinVideo();
  }, [roomId, isJoined, pendingPlayer, players, localPlayerId, joinRoom]);

  // Auto-detect Join URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('room')) {
      setScreen('lobby');
    }
  }, []);

  // Auto-Join when Game Starts (if pending data exists)
  useEffect(() => {
    const checkPendingJoin = async () => {
      if (gameId && !isHost && !localPlayerId) {
        const pendingName = sessionStorage.getItem('pending_player_name');
        const pendingAvatar = sessionStorage.getItem('pending_player_avatar');
        const setupCompleted = sessionStorage.getItem('guest_setup_completed');
        const pendingTeamMembers = sessionStorage.getItem('pending_team_members');
        const pendingGameMode = sessionStorage.getItem('pending_game_mode');

        if (pendingName && setupCompleted) {
          try {
            console.log("Auto-joining pending player:", pendingName);
            const captain = await addPlayer(pendingName, pendingAvatar || undefined);
            if (captain && setLocalPlayerId) {
              setLocalPlayerId(captain.id);
            }

            // Handle team creation for yo_nunca_equipos
            if (pendingGameMode === 'yo_nunca_equipos' && captain) {
              const teamColor = '#10b981';
              const team = await createTeam(`Equipo de ${pendingName}`, teamColor);
              await assignPlayerToTeam(captain.id, team.id);

              if (pendingTeamMembers) {
                try {
                  const members = JSON.parse(pendingTeamMembers);
                  for (const member of members) {
                    const mdp = await addPlayer(member.name);
                    if (mdp) await assignPlayerToTeam(mdp.id, team.id);
                  }
                } catch (e) {
                  console.error("Error adding team members:", e);
                }
              }
              toast.success('¡Equipo creado y unido con éxito!');
            } else {
              toast.success('¡Te has unido automáticamente a la partida!');
            }

            sessionStorage.removeItem('guest_setup_completed');
            sessionStorage.removeItem('pending_player_name');
            sessionStorage.removeItem('pending_player_avatar');
            sessionStorage.removeItem('pending_team_members');
            sessionStorage.removeItem('pending_game_mode');
          } catch (e) {
            console.error("Auto-join error:", e);
          }
        }
      }
    };
    checkPendingJoin();
  }, [gameId, isHost, localPlayerId, addPlayer, createTeam, assignPlayerToTeam, setLocalPlayerId]);

  const handleModeClick = (mode: GameMode) => {
    setSelectedModeForOptions(mode);
  };

  const handleJuegoTabSelect = (mode: GameMode, playMode: PlayMode) => {
    if (playMode === 'online') {
      setPendingHostMode(mode);
      setScreen('lobby');
    } else {
      handleSelectMode(mode);
    }
  };

  const confirmModeSelection = async (isOnline: boolean) => {
    if (!selectedModeForOptions) return;

    // Entry Cost Checks
    if (selectedModeForOptions === 'poker' && (profile?.coins || 0) < 50) {
      toast.error("Necesitas al menos 50 monedas para jugar al Poker.");
      setSelectedModeForOptions(null);
      return;
    }
    if (selectedModeForOptions === 'parchis' && (profile?.coins || 0) < 20) {
      toast.error("Necesitas al menos 20 monedas para jugar al Parchís.");
      setSelectedModeForOptions(null);
      return;
    }

    try {
      if (isOnline) {
        // ONLINE: Set pending mode and go to Lobby.
        // LobbyScreen will see "initialMode" and auto-trigger "Create Room".
        setPendingHostMode(selectedModeForOptions);
        setScreen('lobby');
      } else {
        // LOCAL: Create game immediately
        await handleSelectMode(selectedModeForOptions);
      }
    } catch (error) {
      console.error("Error confirming mode selection:", error);
      toast.error("Hubo un error al iniciar el modo. Inténtalo de nuevo.");
    } finally {
      setSelectedModeForOptions(null);
    }
  };

  const handleSelectMode = async (mode: GameMode) => {
    // Quick entry cost check for local play (though poker/parchis are usually online, just in case)
    if (mode === 'poker' && (profile?.coins || 0) < 50) {
      toast.error("Necesitas al menos 50 monedas para jugar al Poker.");
      return;
    }
    if (mode === 'parchis' && (profile?.coins || 0) < 20) {
      toast.error("Necesitas al menos 20 monedas para jugar al Parchís.");
      return;
    }

    if (TEAM_CAPABLE_MODES.includes(mode)) {
      setPendingMode(mode);
      setScreen('team-mode-select');
      return;
    }

    try {
      const newGame = await createGame(mode);
      setGameId(newGame.id);
      setIsTeamMode(mode === 'yo_nunca_equipos');
      setScreen('player-setup');
    } catch (err) {
      console.error('Error creating game:', err);
    }
  };

  const handleEnterLobby = () => {
    setScreen('lobby');
  };

  const handleTeamModeSelect = async (teamPlay: boolean) => {
    if (!pendingMode) return;
    try {
      const newGame = await createGame(pendingMode);
      setGameId(newGame.id);
      setIsTeamMode(teamPlay);
      setScreen('player-setup');
    } catch (err) {
      console.error('Error creating game:', err);
    }
  };

  const handleStartGame = async () => {
    if (isHost && roomId) {
      try {
        await supabase.from('rooms').update({ status: 'playing' }).eq('id', roomId);
      } catch (err) {
        console.error('Failed to update room status:', err);
      }
    }
    setScreen('playing');
  };

  const handleBack = () => {
    if (screen === 'team-mode-select') {
      setScreen('mode-select');
      setPendingMode(null);
    } else if (screen === 'lobby') {
      setScreen('mode-select');
      setSelectedModeForOptions(null);
      setPendingHostMode(null);
    } else {
      setScreen('mode-select');
      setGameId(null);
    }
  };

  const handleExit = async () => {
    if (isHost && roomId) {
      try {
        await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomId);
      } catch (e) {
        console.error(e);
      }
    }
    setScreen('mode-select');
    setActiveTab('inicio');
    setGameId(null);
    setRoomId(null);
    setIsHost(false);
    setIsTeamMode(false);
    setSelectedModeForOptions(null);
    setPendingPlayer(null);
  };

  const handleRejoinGame = async (gameId: string, mode: string) => {
    try {
      const { data: gameData } = await supabase
        .from('games')
        .select('status')
        .eq('id', gameId)
        .single();

      if (gameData?.status === 'finished') {
        await supabase
          .from('games')
          .update({ status: 'playing' })
          .eq('id', gameId);
      }

      setGameId(gameId);
      setIsTeamMode(false);
      setActiveTab('inicio');
      setScreen('playing');
    } catch (err) {
      console.error('Error rejoining game:', err);
    }
  };

  const handleTabChange = (tab: AppTab) => {
    if (tab === 'jugar') {
      setActiveTab('inicio');
      setScreen('mode-select');
    } else {
      setActiveTab(tab);
      if (screen !== 'mode-select') {
        setScreen('mode-select');
        setGameId(null);
      }
    }
  };

  // MULTIPLAYER LISTENER FOR GUESTS
  useEffect(() => {
    if (!roomId || isHost) return;

    // Helper: check if guest already completed setup
    const hasCompletedSetup = () => !!pendingPlayer || !!sessionStorage.getItem('guest_setup_completed');

    // Hard Sync: Fetch current room state immediately upon joining
    const syncCurrentState = async () => {
      const { data: roomData } = await supabase
        .from('rooms')
        .select('game_mode, status, current_game_id')
        .eq('id', roomId)
        .single();

      if (roomData) {
        if (roomData.current_game_id) setGameId(roomData.current_game_id);

        // If game is already playing, jump in if we have profile
        if (roomData.status === 'playing' && localPlayerId) {
          setScreen('playing');
        } else if (roomData.status === 'setup' && !localPlayerId && screen !== 'guest-setup' && !hasCompletedSetup()) {
          // Only redirect to guest-setup if guest hasn't completed it yet
          setScreen('guest-setup');
        }
      }
    };
    syncCurrentState();

    const channel = supabase.channel(`room:${roomId}`);
    channel
      .on('broadcast', { event: 'game_state' }, async ({ payload }) => {
        if (payload.mode && payload.gameId) {
          console.log("Host broadcasted state:", payload);
          try {
            setGameId(payload.gameId);

            if (payload.status === 'setup' || !localPlayerId) {
              // Only redirect to guest-setup if guest hasn't completed it yet
              if (!localPlayerId && screen !== 'guest-setup' && !hasCompletedSetup()) {
                setScreen('guest-setup');
              }
              // Don't return early if guest has completed setup - let auto-join handle it
              if (!hasCompletedSetup()) return;
            }

            if (payload.status === 'playing' || payload.event === 'poker_state' || screen === 'lobby') {
              setScreen('playing');
            }
          } catch (e) {
            console.error("Error joining game:", e);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, screen, setGameId, isHost, localPlayerId, pendingPlayer]);

  // MULTIPLAYER BROADCAST FOR HOST (Keep Alive for late joiners)
  useEffect(() => {
    // Run as long as the host has a room and gameId, even during 'playing'
    if (isHost && roomId && gameId) {
      const channel = supabase.channel(`room:${roomId}`);
      let interval: NodeJS.Timeout;

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Broadcast state every 2 seconds for late joiners
          const broadcastSetup = () => {
            channel.send({
              type: 'broadcast',
              event: 'game_state',
              payload: {
                mode: game?.mode || pendingHostMode,
                gameId: gameId,
                status: screen === 'player-setup' ? 'setup' : 'playing'
              }
            });
          };

          broadcastSetup(); // initial
          interval = setInterval(broadcastSetup, 2000);
        }
      });

      return () => {
        if (interval) clearInterval(interval);
        supabase.removeChannel(channel);
      };
    }
  }, [isHost, roomId, screen, gameId, game?.mode, pendingHostMode]);


  const getScreenContent = () => {
    switch (screen) {
      case 'playing':
        return <GamePlay onExit={handleExit} isTeamMode={isTeamMode} roomId={roomId} isHost={isHost} />;

      case 'lobby':
        return (
          <LobbyScreen
            initialMode={pendingHostMode || undefined}
            initialWaiting={!!roomId && !isHost}
            roomId={roomId}
            currentPlayer={pendingPlayer || undefined}
            onJoin={async (code, host, mode) => {
              setRoomId(code);
              setIsHost(host);
              setPendingHostMode(null);
              // Store roomId in sessionStorage so GuestSetup can detect game mode
              sessionStorage.setItem('current_room_id', code);

              if (host && mode) {
                try {
                  const validMode = GAME_MODES.find(m => m.id === mode)?.id;
                  if (validMode) {
                    const hostId = localPlayerId || Math.random().toString(36).substring(2, 9);

                    // 1. Create robust Room in DB
                    await supabase.from('rooms').upsert({
                      id: code,
                      host_id: hostId,
                      game_mode: validMode,
                      status: 'setup'
                    });

                    // 2. Insert host into participants
                    const hPlayer = players.find(p => p.id === localPlayerId);
                    if (hPlayer || localPlayerId) {
                      await supabase.from('room_participants').upsert({
                        room_id: code,
                        player_id: hPlayer?.id || hostId,
                        name: hPlayer?.name || 'Host',
                        avatar_url: hPlayer?.avatar_url || '',
                        is_host: true
                      }).catch(console.error);
                    }

                    const newGame = await createGame(validMode);
                    setGameId(newGame.id);
                    setIsTeamMode(validMode === 'yo_nunca_equipos');

                    // Save current_game_id to rooms table so guests can fetch it
                    await supabase.from('rooms').update({ current_game_id: newGame.id }).eq('id', code);

                    setScreen('player-setup');
                  }
                } catch (e) {
                  console.error("Error creating game as host:", e);
                }
              } else {
                if (!pendingPlayer) {
                  setScreen('guest-setup');
                } else {
                  // We already have their info, let's insert them and wait in lobby
                  const guestId = localPlayerId || Math.random().toString(36).substring(2, 9);
                  await supabase.from('room_participants').upsert({
                    room_id: code,
                    player_id: guestId,
                    name: pendingPlayer.name,
                    avatar_url: pendingPlayer.avatar || '',
                    is_host: false
                  }).catch(console.error);
                  setScreen('lobby');
                }
              }
            }}
            onBack={handleBack}
          />
        );

      case 'team-mode-select':
        if (pendingMode) {
          const modeInfo = GAME_MODES.find(m => m.id === pendingMode);
          return (
            <TeamModeSelector
              modeName={modeInfo?.name || ''}
              modeIcon={modeInfo?.icon || '🎮'}
              onSelect={handleTeamModeSelect}
            />
          );
        }
        return null;

      case 'player-setup':
        return <PlayerSetup onStart={handleStartGame} onBack={handleBack} isTeamMode={isTeamMode} isMultiplayer={!!roomId} roomId={roomId} />;

      case 'guest-setup':
        return (
          <GuestSetup
            onJoin={async (name, avatar) => {
              setPendingPlayer({ name, avatar });

              // If we already have a room selected, insert the guest into the DB now
              if (roomId && !isHost) {
                const guestId = localPlayerId || Math.random().toString(36).substring(2, 9);
                await supabase.from('room_participants').upsert({
                  room_id: roomId,
                  player_id: guestId,
                  name: name,
                  avatar_url: avatar || '',
                  is_host: false
                }).catch(console.error);
              }

              setScreen('lobby');
            }}
            onBack={handleExit}
          />
        );

      default:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${screen}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'inicio' && (
                <>
                  {roomId && (
                    <div className="mx-4 mt-4 p-4 bg-primary/20 border border-primary/50 rounded-xl flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Sala Activa</p>
                      <p className="text-4xl font-mono font-black text-white tracking-widest mb-2">{roomId}</p>
                      <p className="text-sm text-muted-foreground text-center mb-3">Elige un juego para empezar</p>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => {
                        setRoomId(null);
                        setIsHost(false);
                      }}>
                        Cancelar Sala
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-center gap-4 mt-2">
                    <button
                      onClick={() => setMainTab('fiesta')}
                      className={`px-8 py-3 rounded-full font-black tracking-widest text-sm transition-all ${mainTab === 'fiesta' ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                    >
                      FIESTA
                    </button>
                    <button
                      onClick={() => setMainTab('juego')}
                      className={`px-8 py-3 rounded-full font-black tracking-widest text-sm transition-all ${mainTab === 'juego' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                    >
                      JUEGO
                    </button>
                  </div>

                  {mainTab === 'fiesta' ? (
                    <FiestaTab onSelectMode={handleModeClick} />
                  ) : (
                    <JuegoTab onSelectMode={handleJuegoTabSelect} />
                  )}

                  {!selectedModeForOptions && mainTab === 'fiesta' && (
                    <p className="text-center text-xs text-muted-foreground">Selecciona un juego para ver opciones</p>
                  )}
                </>
              )}
              {activeTab === 'perfiles' && (
                <Suspense fallback={<div className="p-8 text-center">Cargando perfiles...</div>}>
                  <Profiles />
                </Suspense>
              )}
              {activeTab === 'historial' && <GameHistory onRejoinGame={handleRejoinGame} />}
              {activeTab === 'hall' && (
                <Suspense fallback={<div className="p-8 text-center">Cargando salón de la fama...</div>}>
                  <HallOfFame />
                </Suspense>
              )}
              {activeTab === 'ajustes' && <AppSettings />}
              {activeTab === 'arcade' && (
                <Suspense fallback={<div className="p-8 text-center">Cargando Arcade...</div>}>
                  <ArcadeTab />
                </Suspense>
              )}

            </motion.div>
          </AnimatePresence>
        );
    }
  };

  const { isAuthOverlayOpen } = useAuth();

  return (
    <>
      {isAuthOverlayOpen && <WelcomeScreen />}
      <AuthOverlay />
      <GlobalPresence />
      {getScreenContent()}

      {/* MODE OPTIONS DIALOG (Local vs Online) */}
      <Dialog open={!!selectedModeForOptions} onOpenChange={(o) => !o && setSelectedModeForOptions(null)}>
        <DialogContent className="sm:max-w-md bg-slate-900/95 border-primary/20" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {selectedModeForOptions && GAME_MODES.find(m => m.id === selectedModeForOptions)?.icon}
              <span>{selectedModeForOptions && GAME_MODES.find(m => m.id === selectedModeForOptions)?.name}</span>
            </DialogTitle>
            <DialogDescription id="mode-options-desc">¿Cómo quieres jugar?</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col gap-3 hover:border-primary hover:bg-primary/10 transition-all group"
              onClick={() => confirmModeSelection(false)}
            >
              <div className="p-3 bg-secondary rounded-full group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <span className="font-bold text-lg">Local</span>
              <span className="text-xs text-muted-foreground text-center px-1">Todos en el mismo dispositivo</span>
            </Button>

            <Button
              variant="outline"
              className="h-32 flex flex-col gap-3 hover:border-purple-500 hover:bg-purple-500/10 transition-all group"
              onClick={() => confirmModeSelection(true)}
            >
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-full group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <span className="font-bold text-lg">Online</span>
              <span className="text-xs text-muted-foreground text-center px-1">Con amigos en otros móviles</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Only show BottomNav on main screens (mode-select) */}
      {screen === 'mode-select' && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Global Video Chat - Persists across screens */}
      {roomId && localPlayerId && (
        <VideoChatComponent
          roomId={roomId}
          playerId={localPlayerId}
        />
      )}

      {/* Global Chat Bubble - Always visible */}
      <ChatComponent
        roomId={roomId || 'global_lobby'}
        playerName={
          // Try to find name in established players
          players.find(p => p.id === localPlayerId)?.name
          // Fallback for Host/Guest
          || (roomId ? (isHost ? 'Anfitrión' : 'Invitado') : `Usuario ${localPlayerId?.slice(0, 4) || Math.floor(Math.random() * 9000) + 1000}`)
        }
      />
      {/* Floating Video Bubbles (online only) */}
      {roomId && <FloatingVideoBubbles />}
    </>
  );
}

const Index = () => {
  return (
    <GameProvider>
      <DailyVideoProvider>
        <GameAppInner />
      </DailyVideoProvider>
    </GameProvider>
  );
};

export default Index;
