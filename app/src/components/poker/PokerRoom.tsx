import { useState, useEffect, useRef } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { PokerTable } from './PokerTable';
import { PokerControls } from './PokerControls';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

import { loadLocalRankings } from '@/utils/localRanking';
import { Player } from '@/types/game';

// --- MVP Authoritative Poker Engine Utilities ---
const SUITS = ['H', 'D', 'C', 'S'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const createDeck = () => {
    const deck: string[] = [];
    for (const suit of SUITS) {
        for (const value of VALUES) {
            deck.push(`${value}${suit}`);
        }
    }
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const getHandRank = (cards: string[]) => {
    if (!cards || cards.length < 2) return "Repartiendo...";

    const values = cards.map(c => c.slice(0, -1));
    const suits = cards.map(c => c.slice(-1));

    const valueCounts: Record<string, number> = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);

    const suitCounts: Record<string, number> = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const maxSuitCount = Math.max(...Object.values(suitCounts));

    // Simple ranking for UI display
    if (counts[0] === 4) return "Póker";
    if (counts[0] === 3 && counts[1] === 2) return "Full House";
    if (maxSuitCount >= 5) return "Color";
    // Straight detection simplified:
    const uniqueValues = Array.from(new Set(values.map(v => VALUES.indexOf(v)))).sort((a, b) => a - b);
    let isStraight = false;
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
        if (uniqueValues[i + 4] - uniqueValues[i] === 4) isStraight = true;
    }
    if (isStraight) return "Escalera";

    if (counts[0] === 3) return "Trío";
    if (counts[0] === 2 && counts[1] === 2) return "Doble Pareja";
    if (counts[0] === 2) return "Pareja";

    return "Carta Alta";
};

interface PokerRoomProps {
    onExit: () => void;
    roomId?: string | null;
    isHost?: boolean;
}

export function PokerRoom({ onExit, roomId, isHost: isHostParam }: PokerRoomProps) {
    const { localPlayerId: contextPlayerId, players, addPlayer, remoteStreams, localStream } = useGameContext();
    // In local mode, if context hasn't set localPlayerId yet, assume the first human or first player.
    const localPlayerId = contextPlayerId || players.find(p => !p.name.includes('Bot'))?.id || players[0]?.id;
    const isHost = isHostParam || !roomId; // If no roomId, we are local host
    const { profile, syncEconomy } = useAuth();

    // Fix: Prevent duplicate joins by logging only unique players
    useEffect(() => {
        if (!isHost || !players.length) return;
        const names = players.map(p => p.name);
        const uniqueNames = new Set(names);
        if (uniqueNames.size < players.length) {
            console.warn("Duplicate player detected in Poker list.");
        }
    }, [players, isHost]);

    const [pokerState, setPokerState] = useState<any>({
        status: 'waiting',
        pot: 0,
        community_cards: [],
        current_turn: null,
        deck: [],
        current_bet: 0,
        player_bets: {}, // {playerId: amount}
        last_aggressive_player: null // To know when the betting round ends
    });

    const STARTING_CHIPS = 2000;

    // Load persisted chips from localStorage
    const loadPersistedChips = (): Record<string, number> => {
        try {
            const saved = localStorage.getItem('poker_chips');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    };

    const [localScores, setLocalScores] = useState<Record<string, number>>(() => {
        const persisted = loadPersistedChips();
        const initial: Record<string, number> = {};
        for (const p of players) {
            // Give priority to Auth profile for local player
            if (p.id === localPlayerId && profile) {
                initial[p.id] = profile.coins;
            } else {
                initial[p.id] = persisted[p.name] !== undefined ? persisted[p.name] : (p.score || STARTING_CHIPS);
            }
        }
        return initial;
    });
    const [myCards, setMyCards] = useState<string[]>([]);
    const [equippedCards, setEquippedCards] = useState<Record<string, string>>({});
    const channelRef = useRef<any>(null);
    const stateRef = useRef(pokerState);

    useEffect(() => {
        stateRef.current = pokerState;
    }, [pokerState]);

    useEffect(() => {
        const rankings = loadLocalRankings();
        const mePlayer = players.find(p => p.id === localPlayerId);
        if (mePlayer) {
            const meRanking = rankings.find(r => r.player_name.toLowerCase() === mePlayer.name.toLowerCase());
            if (meRanking?.equipped_items?.carta) {
                setEquippedCards({ [localPlayerId!]: meRanking.equipped_items.carta });
            }
        }
    }, [players, localPlayerId]);

    // Persist chips to localStorage by player name & Auth DB
    useEffect(() => {
        if (Object.keys(localScores).length === 0) return;
        const chipsByName: Record<string, number> = {};
        for (const p of players) {
            if (localScores[p.id] !== undefined) {
                chipsByName[p.name] = localScores[p.id];
            }
        }
        localStorage.setItem('poker_chips', JSON.stringify(chipsByName));

        // Sync localPlayer to auth
        if (localPlayerId && localScores[localPlayerId] !== undefined && profile) {
            // Only sync if there is a real difference
            if (localScores[localPlayerId] !== profile.coins) {
                syncEconomy(localScores[localPlayerId], profile.gems);
            }
        }
    }, [localScores, players, localPlayerId, profile, syncEconomy]);

    const broadcastState = (state: any) => {
        if (roomId && channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'poker_state',
                payload: { state: { ...state, deck: [] } }
            });
        }
    };

    // Heartbeat for Online Sync (Host only)
    useEffect(() => {
        if (!isHost || !roomId || pokerState.status === 'waiting') return;
        const interval = setInterval(() => {
            broadcastState(pokerState);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHost, roomId, pokerState]);

    // Bot AI Logic — with different difficulty levels
    useEffect(() => {
        if (!isHost || pokerState.status === 'waiting' || pokerState.status === 'finished') return;

        const currentTurnPlayer = players.find(p => p.id === pokerState.current_turn);
        if (currentTurnPlayer && currentTurnPlayer.name.includes('Bot')) {
            const timer = setTimeout(() => {
                const currentBet = pokerState.current_bet || 0;
                const myBet = pokerState.player_bets?.[currentTurnPlayer.id] || 0;
                const myChips = currentTurnPlayer.score || 0;
                const toCall = currentBet - myBet;
                const pot = pokerState.pot || 0;

                // Assign difficulty based on bot index (rotate Easy/Medium/Hard)
                const botIndex = players.filter(p => p.name.includes('Bot')).findIndex(b => b.id === currentTurnPlayer.id);
                const difficulties = ['easy', 'medium', 'hard'] as const;
                const difficulty = difficulties[botIndex % 3];

                const roll = Math.random();

                if (difficulty === 'easy') {
                    // Easy: folds 35% of the time when there's a bet, otherwise calls
                    if (toCall > 0 && roll < 0.35) {
                        handleAction('fold', 0, currentTurnPlayer.id);
                    } else if (toCall > 0) {
                        handleAction('call', toCall, currentTurnPlayer.id);
                    } else {
                        handleAction('check', 0, currentTurnPlayer.id);
                    }
                } else if (difficulty === 'medium') {
                    // Medium: sometimes raises, rarely folds
                    if (toCall > 0 && toCall > myChips * 0.5 && roll < 0.25) {
                        handleAction('fold', 0, currentTurnPlayer.id);
                    } else if (toCall > 0) {
                        handleAction('call', toCall, currentTurnPlayer.id);
                    } else if (roll < 0.25 && myChips > currentBet + 20) {
                        // Raise sometimes when no bet
                        const raiseAmt = Math.min(Math.floor(pot * 0.5) + 10, myChips);
                        handleAction('raise', raiseAmt, currentTurnPlayer.id);
                    } else {
                        handleAction('check', 0, currentTurnPlayer.id);
                    }
                } else {
                    // Hard: aggressive — raises often, bluffs, rarely folds
                    if (toCall > 0 && toCall > myChips * 0.7 && roll < 0.1) {
                        handleAction('fold', 0, currentTurnPlayer.id);
                    } else if (toCall > 0 && roll < 0.4 && myChips > toCall + 30) {
                        // Re-raise
                        const reRaise = toCall + Math.min(Math.floor(pot * 0.6) + 20, myChips - toCall);
                        handleAction('raise', reRaise, currentTurnPlayer.id);
                    } else if (toCall > 0) {
                        handleAction('call', toCall, currentTurnPlayer.id);
                    } else if (roll < 0.45 && myChips > 30) {
                        // Aggressive open raise
                        const raiseAmt = Math.min(Math.floor(pot * 0.75) + 15, myChips);
                        handleAction('raise', raiseAmt, currentTurnPlayer.id);
                    } else {
                        handleAction('check', 0, currentTurnPlayer.id);
                    }
                }
            }, 600 + Math.random() * 800); // SPED UP BOT THINKING
            return () => clearTimeout(timer);
        }
    }, [pokerState.current_turn, isHost, pokerState.status, pokerState.current_bet, players]);

    // Realtime Sync & Authoritative Host Loop
    useEffect(() => {
        if (!localPlayerId) return;

        if (roomId) {
            // Online Setup
            supabase.from('poker_hands')
                .select('cards')
                .eq('room_id', roomId)
                .eq('player_id', localPlayerId)
                .maybeSingle()
                .then(({ data }) => {
                    if (data?.cards) setMyCards(data.cards);
                });

            const channel = supabase.channel(`poker-game-${roomId}`);
            channelRef.current = channel;

            channel
                .on('broadcast', { event: 'poker_state' }, ({ payload }) => {
                    if (!isHost) {
                        setPokerState(payload.state);
                        if (payload.state.player_chips) {
                            setLocalScores(payload.state.player_chips);
                        }
                    }
                })
                .on('broadcast', { event: `private_hand_${localPlayerId}` }, ({ payload }) => {
                    setMyCards(payload.cards);
                })
                .on('broadcast', { event: 'poker_action' }, ({ payload }) => {
                    if (isHost) handleAction(payload.action, payload.amount, payload.playerId);
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, [roomId, localPlayerId, isHost]);

    const handleAction = (action: 'fold' | 'check' | 'call' | 'raise', amount: number = 0, playerId?: string) => {
        const actingId = playerId || localPlayerId;
        if (!actingId) return;

        if (!isHost && roomId) {
            channelRef.current?.send({
                type: 'broadcast',
                event: 'poker_action',
                payload: { action, amount, playerId: actingId }
            });
            return;
        }

        let nextScoresObj = { ...localScores };

        // Deduct chip bet from player's stack
        if (amount > 0 && isHost) {
            setLocalScores(prev => {
                const currentScore = prev[actingId] !== undefined ? prev[actingId] : (players.find(p => p.id === actingId)?.score || 1000);
                const newScore = Math.max(0, currentScore - amount); // Ensure non-negative
                if (roomId) supabase.from('players').update({ score: newScore }).eq('id', actingId).then();
                nextScoresObj = { ...prev, [actingId]: newScore };
                return nextScoresObj;
            });
        }

        setPokerState((prev: any) => {
            let nextStatus = prev.status;
            let nextCommunity = [...(prev.community_cards || [])];
            let nextDeck = [...(prev.deck || [])];
            let nextPot = prev.pot + amount;
            let nextPlayerBets = { ...prev.player_bets, [actingId]: (prev.player_bets[actingId] || 0) + amount };
            let nextCurrentBet = Math.max(prev.current_bet, nextPlayerBets[actingId]);
            let nextLastAggressive = (action === 'raise') ? actingId : prev.last_aggressive_player;

            // Simple Turn Rotation
            const activePlayers = players.filter(p => !prev.folded_players?.includes(p.id));
            const currentIndex = activePlayers.findIndex(p => p.id === actingId);

            // Handle fold
            let nextFolded = prev.folded_players || [];
            if (action === 'fold') {
                nextFolded = [...nextFolded, actingId];
            }

            const remainingActive = activePlayers.filter(p => !nextFolded.includes(p.id));

            // Check win by folds
            if (remainingActive.length === 1) {
                const winnerId = remainingActive[0].id;
                // Immediate win logic could go here, for now we let it flow or handle in resolveShowdown
                // Actually, if everyone else folded, we should auto-resolve
                setTimeout(() => {
                    resolveShowdown({ ...prev, status: 'showdown', folded_players: nextFolded }, winnerId);
                }, 1000);
            }

            let nextIndex = (currentIndex + 1) % remainingActive.length;
            let nextTurnId = remainingActive[nextIndex]?.id || null;

            // Check if betting round is over
            const allMatched = remainingActive.every(p => {
                const bet = nextPlayerBets[p.id] || 0;
                return bet === nextCurrentBet;
            });
            const everyoneActed = remainingActive.every(p => nextPlayerBets[p.id] !== undefined);

            // If we are back to the last aggressive player (or everyone matched if no raise), next phase
            if (everyoneActed && allMatched && (nextTurnId === nextLastAggressive || !nextLastAggressive || remainingActive.length === 1)) {
                if (nextStatus === 'preflop') {
                    nextStatus = 'flop';
                    if (nextDeck.length >= 3) nextCommunity = [nextDeck.pop()!, nextDeck.pop()!, nextDeck.pop()!];
                } else if (nextStatus === 'flop') {
                    nextStatus = 'turn';
                    if (nextDeck.length >= 1) nextCommunity.push(nextDeck.pop()!);
                } else if (nextStatus === 'turn') {
                    nextStatus = 'river';
                    if (nextDeck.length >= 1) nextCommunity.push(nextDeck.pop()!);
                } else if (nextStatus === 'river' || remainingActive.length === 1) {
                    nextStatus = 'showdown';
                } else {
                    nextStatus = 'waiting'; // Restart on finish for now
                }

                // Reset bets for next round
                nextCurrentBet = 0;
                nextPlayerBets = {};
                nextLastAggressive = null;
                nextTurnId = remainingActive[0]?.id; // Re-start turn order for next round
            }

            const newStateTemplate = {
                ...prev,
                status: nextStatus,
                community_cards: nextCommunity,
                deck: nextDeck,
                pot: nextPot,
                current_turn: nextTurnId,
                player_bets: nextPlayerBets,
                current_bet: nextCurrentBet,
                last_aggressive_player: nextLastAggressive,
                folded_players: nextFolded,
                player_chips: nextScoresObj // Sync latest chips to clients
            };

            const newState = newStateTemplate;

            if (nextStatus === 'showdown' && remainingActive.length > 1) {
                // Determine winner and update persistent scores
                setTimeout(() => {
                    resolveShowdown(newState);
                }, 3000);
            }

            if (roomId) broadcastState(newState);
            return newState;
        });
    };

    const resolveShowdown = (state: any, forcedWinnerId?: string) => {
        if (!isHost) return;

        // MVP: Random winner logic if complex evaluation is too long, 
        // or just the first player who didn't fold for now.
        // In a real app, we'd use getHandRank compare.
        const activePlayers = players.filter(p => !state.folded_players?.includes(p.id));
        const winner = forcedWinnerId
            ? players.find(p => p.id === forcedWinnerId)
            : (activePlayers.length > 0 ? activePlayers[Math.floor(Math.random() * activePlayers.length)] : players[0]);

        const winAmount = state.pot;

        if (!winner) return;

        // Update local state scores first for immediate feedback
        setPokerState(prev => ({
            ...prev,
            status: 'finished',
            winner: winner.id,
            community_cards: prev.deck.length >= 5 ? prev.deck.slice(-5) : prev.community_cards // Show all cards
        }));

        // Give pot to the winner
        let finalScoresObj = { ...localScores };
        setLocalScores(prev => {
            const currentScore = prev[winner.id] !== undefined ? prev[winner.id] : (winner.score || 1000);
            const newScore = currentScore + winAmount;
            if (roomId) supabase.from('players').update({ score: newScore }).eq('id', winner.id).then();
            finalScoresObj = { ...prev, [winner.id]: newScore };
            return finalScoresObj;
        });

        // Broadcast the final scores immediately so clients see winner chips
        if (roomId) {
            broadcastState({
                ...state,
                status: 'finished',
                winner: winner.id,
                community_cards: state.deck.length >= 5 ? state.deck.slice(-5) : state.community_cards,
                player_chips: finalScoresObj
            });
        }

        // Auto-restart next hand directly (Sped up from 6s to 3.5s)
        setTimeout(() => {
            startGame();
        }, 3500);
    };

    const startGame = async () => {
        // Re-up bankrupted players
        if (isHost) {
            setLocalScores(prev => {
                const nextScores = { ...prev };
                for (const p of players) {
                    const s = nextScores[p.id] !== undefined ? nextScores[p.id] : (p.score || STARTING_CHIPS);
                    if (s <= 0) {
                        nextScores[p.id] = STARTING_CHIPS;
                        if (roomId) supabase.from('players').update({ score: STARTING_CHIPS }).eq('id', p.id).then();
                    } else {
                        nextScores[p.id] = s;
                    }
                }
                return nextScores;
            });
        }

        const deck = createDeck();
        const hands: Record<string, string[]> = {};
        players.forEach(p => hands[p.id] = [deck.pop()!, deck.pop()!]);

        const newState = {
            status: 'preflop',
            pot: 0,
            community_cards: [],
            current_turn: players[0]?.id,
            deck,
            current_bet: 0,
            player_bets: {},
            last_aggressive_player: null,
            winner: null,
            folded_players: []
        };

        setPokerState(newState);
        setMyCards(hands[localPlayerId!] || []);

        if (roomId) {
            broadcastState(newState);
            // Firebase-style private distribution
            players.forEach(p => {
                channelRef.current?.send({
                    type: 'broadcast',
                    event: `private_hand_${p.id}`,
                    payload: { cards: hands[p.id] }
                });
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden text-white font-sans">
            <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
                <button onClick={onExit} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md">
                    <ArrowLeft size={20} />
                </button>
                <span className="font-bold text-lg tracking-wider opacity-80">POKER {roomId ? 'ONLINE' : 'LOCAL'}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 pt-[10vh] pb-2 relative">
                <PokerTable
                    players={players.map(p => ({
                        ...p,
                        score: localScores[p.id] !== undefined ? localScores[p.id] : (p.score || STARTING_CHIPS)
                    }))}
                    gameState={pokerState}
                    localPlayerId={localPlayerId}
                    myCards={myCards}
                    remoteStreams={remoteStreams}
                    localStream={localStream}
                    equippedCards={equippedCards}
                />

                {/* Local Waiting Overlay */}
                {pokerState.status === 'waiting' && isHost && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="bg-black/90 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center flex flex-col items-center gap-6 shadow-2xl">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
                                <Users className="text-primary" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black mb-2 tracking-tighter">SALA DE ESPERA</h2>
                                <p className="text-white/50 max-w-[200px]">Prepara a tus jugadores o bots antes de empezar.</p>
                            </div>
                            <Button
                                onClick={startGame}
                                size="lg"
                                disabled={players.length < 2}
                                className="w-full rounded-full h-14 text-xl font-bold bg-primary hover:bg-primary/80 neon-border"
                            >
                                Empezar Partida ({players.length})
                            </Button>
                        </div>
                    </div>
                )}

                {/* Guest Waiting Overlay */}
                {pokerState.status === 'waiting' && !isHost && roomId && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center animate-pulse">
                            <h2 className="text-xl font-bold">ESPERANDO AL ANFITRIÓN...</h2>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 pb-8 z-50 relative">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
                    {/* Hand Ranking Status */}
                    {pokerState.status !== 'waiting' && myCards.length > 0 && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-primary/10 border border-primary/30 px-6 py-2 rounded-full"
                        >
                            <span className="text-primary font-black tracking-widest text-sm uppercase">
                                TU MANO: {getHandRank([...myCards, ...pokerState.community_cards])}
                            </span>
                        </motion.div>
                    )}

                    <PokerControls
                        onAction={(a, am) => handleAction(a, am)}
                        isActive={pokerState.status !== 'waiting' && pokerState.current_turn === localPlayerId}
                        currentBetToMatch={pokerState.current_bet - (pokerState.player_bets?.[localPlayerId || ''] || 0)}
                        myChips={localScores[localPlayerId || ''] || 0}
                        pot={pokerState.pot || 0}
                    />
                </div>
            </div>
        </div>
    );
}
