import React, { useEffect, useState, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Users, Link, Shield, Swords, Coins, Gamepad2, Trophy, Crown, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRanking } from '@/hooks/useRanking';
import { getXPProgress } from '@/lib/playerEconomy';
import { classifyPlayer, BADGE_RARITY_STYLES } from '@/lib/playerClassification';
import { Button } from '@/components/ui/button';
import { loadLocalRankings } from '@/utils/localRanking';

export function GlobalPresence() {
    const { user, profile, setAuthOverlayOpen } = useAuth();
    const { rankings } = useRanking();
    const [onlineCount, setOnlineCount] = useState<number>(0);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const localPlayerName = localStorage.getItem('fiesta_player_name') || profile?.username || 'Invitado';
    const myProfile = rankings.find(r => r.name.toLowerCase() === localPlayerName.toLowerCase());
    const xpInfo = getXPProgress(myProfile?.xp || 0);

    const effectiveAvatar = myProfile?.equipped_items?.avatar || myProfile?.avatar_url || profile?.avatar_url || null;

    // Real-time classification
    const playerRanking = useMemo(() => {
        const all = loadLocalRankings();
        return all.find(r => r.player_name.toLowerCase() === localPlayerName.toLowerCase()) || null;
    }, [localPlayerName, myProfile]);

    const classification = useMemo(() => classifyPlayer(playerRanking), [playerRanking]);
    const earnedBadges = useMemo(() => classification.badges.filter(b => b.earned), [classification]);

    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const roomOne = supabase.channel('global:presence', {
            config: {
                presence: {
                    key: user?.id || `guest-${Math.floor(Math.random() * 99999)}`,
                },
            },
        });

        roomOne
            .on('presence', { event: 'sync' }, () => {
                const newState = roomOne.presenceState();
                const users = [];
                let count = 0;

                for (const id in newState) {
                    // @ts-ignore
                    const presenceArray = newState[id];
                    count += presenceArray.length;
                    if (presenceArray[0]) {
                        users.push({ ...presenceArray[0], presence_id: id });
                    }
                }

                setOnlineCount(count);
                setOnlineUsers(users);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const statusData = {
                        user_id: user?.id || 'guest',
                        username: localPlayerName,
                        avatar_url: effectiveAvatar,
                        is_registered: !!user,
                        online_at: new Date().toISOString(),
                    };
                    await roomOne.track(statusData);
                }
            });

        return () => {
            supabase.removeChannel(roomOne);
        };
    }, [user, localPlayerName, effectiveAvatar]);

    const handleCopyInvite = () => {
        const params = new URLSearchParams(window.location.search);
        let link = window.location.origin;
        if (params.get('room')) {
            link += `/?room=${params.get('room')}`;
        }
        navigator.clipboard.writeText(link);
        toast.success('¡Enlace copiado! Envíalo a un amigo para jugar.');
    };

    const handleInviteUser = (invitedUser: any) => {
        const params = new URLSearchParams(window.location.search);
        let link = window.location.origin;
        if (params.get('room')) {
            link += `/?room=${params.get('room')}`;
        }

        navigator.clipboard.writeText(link);
        toast.success(`Enlace copiado. Compártelo con ${invitedUser.username || 'ese jugador'} por mensaje.`);
    };

    if (!isSupabaseConfigured) return null;

    const registeredUsers = onlineUsers.filter(u => u.is_registered).sort((a, b) => a.username?.localeCompare(b.username));
    const guestUsers = onlineUsers.filter(u => !u.is_registered).sort((a, b) => a.username?.localeCompare(b.username));

    return (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
            <button
                onClick={handleCopyInvite}
                className="bg-blue-600/80 hover:bg-blue-500 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold font-sans shadow-lg transition-all"
            >
                <Link size={14} />
                <span className="hidden sm:inline">Invitar</span>
            </button>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button className="bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/50 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg transition-colors cursor-pointer group">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <Users size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                        <span className="text-xs font-bold font-mono">{onlineCount}</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[360px] p-0 border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden mt-2 z-[9999]" sideOffset={8}>
                    <Tabs defaultValue="online" className="w-full">
                        <div className="bg-slate-800/80 p-2 flex justify-center border-b border-slate-800">
                            <TabsList className="bg-slate-900/50 border border-slate-700/50 gap-1 rounded-xl w-full flex">
                                <TabsTrigger value="profile" className="flex-1 rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400">
                                    <Crown className="w-4 h-4 mr-2" /> Mi Perfil
                                </TabsTrigger>
                                <TabsTrigger value="online" className="flex-1 rounded-lg data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
                                    <Users className="w-4 h-4 mr-1" /> {onlineCount}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="profile" className="p-4 m-0 outline-none max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col items-center">
                                {/* Avatar + Name + Title */}
                                <Avatar className="h-20 w-20 ring-4 ring-purple-500/30 mb-2 shadow-xl">
                                    {effectiveAvatar ? <AvatarImage src={effectiveAvatar} className="object-cover" /> : null}
                                    <AvatarFallback className="bg-slate-800 text-xl uppercase">
                                        {localPlayerName.slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-black text-white">{localPlayerName}</h3>

                                {/* Main Title */}
                                <div className={`flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20`}>
                                    <span className="text-sm">{classification.mainEmoji}</span>
                                    <span className={`text-xs font-black ${classification.mainColor}`}>{classification.mainTitle}</span>
                                </div>

                                {/* Level Badge */}
                                <div className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-purple-500/20">
                                    Nivel {xpInfo.level}
                                </div>

                                {/* Personality Traits */}
                                <div className="flex flex-wrap gap-1 mt-3 justify-center">
                                    {classification.personalityTraits.map((trait, i) => (
                                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                                            {trait}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                                    <div className="bg-slate-800/60 p-2.5 rounded-xl text-center border border-slate-700/50">
                                        <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-0.5" />
                                        <p className="text-base font-bold text-white">{myProfile?.coins || 0}</p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Monedas</p>
                                    </div>
                                    <div className="bg-slate-800/60 p-2.5 rounded-xl text-center border border-slate-700/50">
                                        <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
                                        <p className="text-base font-bold text-white">{myProfile?.games_won || 0}</p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Victorias</p>
                                    </div>
                                </div>

                                {/* Stat Highlights */}
                                <div className="w-full mt-3 space-y-1.5">
                                    {classification.stats.map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg">
                                            <span className="text-[11px] text-slate-400">{stat.emoji} {stat.label}</span>
                                            <span className={`text-[11px] font-bold ${stat.color}`}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Earned Badges */}
                                {earnedBadges.length > 0 && (
                                    <div className="w-full mt-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">🏅 Insignias ({earnedBadges.length})</h4>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {earnedBadges.slice(0, 8).map(badge => {
                                                const style = BADGE_RARITY_STYLES[badge.rarity];
                                                return (
                                                    <div key={badge.id} className={`${style.bg} ${style.border} border rounded-lg p-1.5 text-center`} title={`${badge.name}: ${badge.description}`}>
                                                        <span className="text-lg">{badge.emoji}</span>
                                                        <p className={`text-[8px] font-bold ${style.text} truncate`}>{badge.name}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {earnedBadges.length > 8 && (
                                            <p className="text-[10px] text-slate-500 text-center mt-1">+{earnedBadges.length - 8} más</p>
                                        )}
                                    </div>
                                )}

                                {/* Fun Fact */}
                                <div className="mt-3 w-full p-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                                    <p className="text-[11px] text-slate-300 text-center italic">💡 {classification.funFact}</p>
                                </div>

                                {!user && (
                                    <Button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setAuthOverlayOpen(true);
                                        }}
                                        className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm"
                                    >
                                        Crear Cuenta para Guardar Progreso
                                    </Button>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="online" className="p-0 m-0 max-h-[400px] overflow-y-auto custom-scrollbar outline-none">
                            <div className="p-4 space-y-5">

                                {registeredUsers.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <Shield className="w-3.5 h-3.5 text-purple-400" />
                                            Registrados ({registeredUsers.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {registeredUsers.map((u, i) => (
                                                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition-colors group border border-transparent hover:border-slate-700/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Avatar className="h-10 w-10 ring-2 ring-purple-500/50 shadow-md">
                                                                {u.avatar_url ? <AvatarImage src={u.avatar_url} /> : null}
                                                                <AvatarFallback className="bg-slate-700 text-sm font-bold">{(u.username || '??').slice(0, 2).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                                        </div>
                                                        <span className="text-[15px] font-bold text-slate-100 truncate flex-1">{u.username}</span>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                                                            onClick={() => handleInviteUser(u)}
                                                            title="Copiar link para invitar a jugar"
                                                        >
                                                            <Swords className="w-3.5 h-3.5" />
                                                            <span className="text-xs hidden sm:inline">Invitar</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {guestUsers.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <Users className="w-3.5 h-3.5 text-slate-500" />
                                            Invitados ({guestUsers.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {guestUsers.map((u, i) => (
                                                <div key={i} className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-800/20 hover:bg-slate-800/50 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Avatar className="h-8 w-8 opacity-70 ring-1 ring-slate-600/50">
                                                                {u.avatar_url ? <AvatarImage src={u.avatar_url} /> : null}
                                                                <AvatarFallback className="bg-slate-800 text-[10px] font-medium text-slate-500">{(u.username || '??').slice(0, 2).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500/50 rounded-full border border-slate-900"></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-400 truncate flex-1">{u.username}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-slate-700/50 text-slate-300 hover:bg-slate-600 rounded-lg hover:text-white transition-all shadow-sm"
                                                            onClick={() => handleInviteUser(u)}
                                                            title="Copiar link para invitar a jugar"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {onlineUsers.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm">No hay nadie más online ahora.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    );
}
