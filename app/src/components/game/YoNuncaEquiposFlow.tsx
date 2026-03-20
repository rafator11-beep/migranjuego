import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldQuestion, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Player, Team } from '@/types/game';
import { GameState } from '@/hooks/game/useGameEngine';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/sfx';

interface YoNuncaEquiposFlowProps {
    questionText: string;
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    players: Player[];
    teams: Team[];
    onNext: () => void;
    localPlayerId: string | undefined;
    isHost: boolean;
    isMultiplayer?: boolean; // Added for Captain panel check
    addScore: (playerId: string, points: number) => void;
    sendActionToHost?: (action: any) => void;
}

export function YoNuncaEquiposFlow({
    questionText,
    gameState,
    setGameState,
    players,
    teams,
    onNext,
    localPlayerId,
    isHost,
    isMultiplayer, // Extracted
    addScore,
    sendActionToHost
}: YoNuncaEquiposFlowProps) {
    const [currentTruthPlayerIndex, setCurrentTruthPlayerIndex] = useState(0);
    const [showPassScreen, setShowPassScreen] = useState(true);

    const phase = gameState.yoNuncaEquiposPhase;
    const targetTeamId = gameState.yoNuncaTargetTeamId;

    const targetTeam = teams.find(t => t.id === targetTeamId);
    const targetPlayers = players.filter(p => p.team_id === targetTeamId);

    // The guessing team is ideally any team that is NOT the target team.
    // For 2 teams, it's straightforward.
    const guessTeams = teams.filter(t => t.id !== targetTeamId);

    const localPlayer = players.find(p => p.id === localPlayerId);
    const isLocalInTargetTeam = localPlayer?.team_id === targetTeamId;

    // Clean question text (remove emojis usually at start)
    const cleanQuestion = questionText.replace(/^(🙈\s*|🌶️\s*|🇪🇸\s*)/, '');

    const handleTruthPlayerVote = (playerId: string, didIt: boolean) => {
        if (localPlayerId && !isLocalInTargetTeam && !isHost) return;

        sfx.click();
        setGameState(prev => ({
            ...prev,
            yoNuncaTruthVotes: {
                ...prev.yoNuncaTruthVotes,
                [playerId]: didIt
            }
        }));
        if (!isHost && sendActionToHost) {
            sendActionToHost({ type: 'YO_NUNCA_VOTE', payload: { phase: 'truth_phase', votes: { [playerId]: didIt } } });
        }

        setCurrentTruthPlayerIndex(prev => prev + 1);
        setShowPassScreen(true);
    };

    const handleGuessVote = (playerId: string) => {
        // Only non-target team members (or host if local) can guess
        if (localPlayerId && isLocalInTargetTeam && !isHost) return;

        sfx.click();
        const newVal = !gameState.yoNuncaGuessVotes?.[playerId];
        setGameState(prev => ({
            ...prev,
            yoNuncaGuessVotes: {
                ...prev.yoNuncaGuessVotes,
                [playerId]: newVal
            }
        }));
        if (!isHost && sendActionToHost) {
            sendActionToHost({ type: 'YO_NUNCA_VOTE', payload: { phase: 'guess_phase', votes: { [playerId]: newVal } } });
        }
    };

    const confirmTruth = () => {
        if (localPlayerId && !isLocalInTargetTeam && !isHost) return;
        sfx.click();
        setGameState(prev => ({
            ...prev,
            yoNuncaEquiposPhase: 'guess_phase'
        }));
        if (!isHost && sendActionToHost) {
            sendActionToHost({ type: 'YO_NUNCA_PHASE_CHANGE', payload: { phase: 'guess_phase' } });
        }
    };

    const confirmGuess = () => {
        if (localPlayerId && isLocalInTargetTeam && !isHost) return;
        sfx.click();

        // Calculate Score Here or in display?
        const truthMap = gameState.yoNuncaTruthVotes || {};
        const guessMap = gameState.yoNuncaGuessVotes || {};

        // How many did it?
        const actualDoersIds = targetPlayers.filter(p => truthMap[p.id]).map(p => p.id);
        const guessedDoersIds = targetPlayers.filter(p => guessMap[p.id]).map(p => p.id);

        // Exact match?
        let correctStrokes = 0;
        targetPlayers.forEach(p => {
            if (!!truthMap[p.id] === !!guessMap[p.id]) correctStrokes++;
        });

        const mistakes = targetPlayers.length - correctStrokes;

        if (mistakes === 0) {
            // Perfect
            confetti();
            sfx.legendary();
            // Give points to all players in the guessing team
            const guessingPlayers = players.filter(p => p.team_id !== targetTeamId);
            guessingPlayers.forEach(p => addScore(p.id, 5));
        } else if (mistakes === 1 && targetPlayers.length > 1) {
            // Off by 1
            const guessingPlayers = players.filter(p => p.team_id !== targetTeamId);
            guessingPlayers.forEach(p => addScore(p.id, 2));
        } else {
            sfx.chaos();
        }

        setGameState(prev => ({
            ...prev,
            yoNuncaEquiposPhase: 'result_phase'
        }));
        if (!isHost && sendActionToHost) {
            sendActionToHost({ type: 'YO_NUNCA_PHASE_CHANGE', payload: { phase: 'result_phase' } });
        }
    };

    const finishFlow = () => {
        sfx.click();
        setGameState(prev => ({
            ...prev,
            yoNuncaEquiposPhase: 'idle',
            yoNuncaTruthVotes: {},
            yoNuncaGuessVotes: {},
            yoNuncaTargetTeamId: null
        }));
        setCurrentTruthPlayerIndex(0);
        setShowPassScreen(true);
        onNext();
    };

    if (phase === 'idle' || !targetTeam) return null;

    const totalWhoDidIt = targetPlayers.filter(p => gameState.yoNuncaTruthVotes?.[p.id]).length;

    const canInteractTruth = !localPlayerId || isLocalInTargetTeam || isHost;
    const canInteractGuess = !localPlayerId || !isLocalInTargetTeam || isHost;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-background/95 backdrop-blur-md p-4 flex flex-col items-center justify-center overflow-y-auto"
        >
            <div className="max-w-2xl w-full bg-card/80 border border-primary/20 rounded-3xl p-6 shadow-2xl relative mt-16 md:mt-0">

                {/* CAPTAIN ACTION PANEL (MINI) */}
                <div className="w-full flex flex-col items-center mb-6 pt-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2 opacity-70">Panel del Capitán (+XP)</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {players.map(p => (
                            <motion.button
                                key={`captain-${p.id}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    if (isMultiplayer && !isHost) return;
                                    addScore(p.id, 10);
                                    // Normally we also increment games_won but we don't have the setter here. 
                                    // Score alone is fine for immediate feedback in this sub-view.
                                    sfx.click();
                                }}
                                className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity bg-slate-800"
                            >
                                {p.avatar_url ? (
                                    <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-white/90">
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-green-400 font-black text-xs">+</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Main Question Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold mb-4 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                        <ShieldQuestion className="w-5 h-5" />
                        Yo Nunca Equipos
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black neon-text text-white leading-tight">
                        "{cleanQuestion}"
                    </h2>
                </div>

                {/* Phase 1: TRUTH PHASE */}
                {phase === 'truth_phase' && (
                    <div className="space-y-6">
                        {!canInteractTruth ? (
                            <div className="text-center pt-8 pb-8 text-muted-foreground animate-pulse font-medium">
                                Esperando a que el <span className="text-white font-bold">{targetTeam.name}</span> confirme la verdad...
                            </div>
                        ) : (
                            // Interactive flow for the Target Team
                            currentTruthPlayerIndex < targetPlayers.length ? (
                                // Sequential Voting
                                showPassScreen ? (
                                    <div className="flex flex-col items-center justify-center p-8 bg-blue-500/10 border border-blue-500/30 rounded-3xl mt-4">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                            {targetPlayers[currentTruthPlayerIndex].avatar_url ? (
                                                <img src={targetPlayers[currentTruthPlayerIndex].avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl font-bold text-white">
                                                    {targetPlayers[currentTruthPlayerIndex].name.substring(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-white text-center mb-2">
                                            Pasa el dispositivo a<br />
                                            <span className="text-4xl text-blue-400 capitalize">{targetPlayers[currentTruthPlayerIndex].name}</span>
                                        </h3>
                                        <p className="text-muted-foreground text-center mb-8">Nadie más debe mirar la pantalla.</p>

                                        <Button size="lg" className="w-full text-xl h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl" onClick={() => setShowPassScreen(false)}>
                                            Soy {targetPlayers[currentTruthPlayerIndex].name}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-white/10 rounded-3xl mt-4 relative overflow-hidden">
                                        <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
                                        <div className="mb-8 text-center">
                                            <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Tu Turno</p>
                                            <p className="text-3xl font-black text-white capitalize">{targetPlayers[currentTruthPlayerIndex].name}</p>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 leading-tight">
                                            ¿Has hecho esto alguna vez?
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <Button
                                                className="h-24 md:h-32 rounded-2xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 flex flex-col items-center justify-center gap-2 group"
                                                onClick={() => handleTruthPlayerVote(targetPlayers[currentTruthPlayerIndex].id, true)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Check className="w-6 h-6" />
                                                </div>
                                                <span className="font-bold text-green-100 text-lg">SÍ, lo he hecho</span>
                                            </Button>

                                            <Button
                                                className="h-24 md:h-32 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 flex flex-col items-center justify-center gap-2 group"
                                                onClick={() => handleTruthPlayerVote(targetPlayers[currentTruthPlayerIndex].id, false)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <X className="w-6 h-6" />
                                                </div>
                                                <span className="font-bold text-red-100 text-lg">NO lo he hecho</span>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // All players voted
                                <div className="text-center p-8 bg-blue-500/10 border border-blue-500/30 rounded-3xl mt-4">
                                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                                        <ShieldQuestion className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">¡Todos han votado!</h3>
                                    <p className="text-blue-200 mb-8">
                                        El equipo ha respondido. Han sido <span className="font-black text-white">{totalWhoDidIt}</span> personas.
                                    </p>

                                    <Button size="lg" className="w-full text-xl h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl" onClick={confirmTruth}>
                                        Bloquear Respuestas y Continuar
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                )}


                {/* Phase 2: GUESS PHASE */}
                {phase === 'guess_phase' && (
                    <div className="space-y-6">
                        <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                            <h3 className="text-xl font-bold text-purple-400 mb-2">
                                Fase 2: La Adivinanza
                            </h3>
                            <p className="text-sm text-purple-200/80 mb-3">
                                Turno de adivinar.<br />
                                El equipo rival ha confirmado que del <span className="font-bold text-white capitalize">{targetTeam.name}</span>:
                            </p>
                            <div className="inline-flex items-center justify-center px-6 py-3 bg-purple-600/30 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-2xl">
                                <span className="text-4xl font-black text-white">{totalWhoDidIt}</span>
                                <span className="ml-2 text-lg font-bold text-purple-200 leading-tight text-left">
                                    PERSONAS<br />LO HAN HECHO
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {targetPlayers.map(p => {
                                const isSelected = !!gameState.yoNuncaGuessVotes?.[p.id];
                                return (
                                    <motion.button
                                        key={p.id}
                                        whileHover={canInteractGuess ? { scale: 1.05 } : {}}
                                        whileTap={canInteractGuess ? { scale: 0.95 } : {}}
                                        onClick={() => handleGuessVote(p.id)}
                                        disabled={!canInteractGuess}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isSelected ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800/50 border-white/5'
                                            } ${!canInteractGuess ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isSelected ? 'border-purple-400' : 'border-white/20'}`}>
                                            {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xl font-bold">{p.name.substring(0, 2)}</div>}
                                        </div>
                                        <span className="font-bold text-sm">{p.name}</span>
                                        <div className={`w-full text-xs font-bold text-center py-1 rounded ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            {isSelected ? 'Culpable' : 'Inocente'}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {canInteractGuess && (
                            <div className="pt-4">
                                <Button size="lg" className="w-full text-lg h-14 bg-purple-600 hover:bg-purple-500 text-white" onClick={confirmGuess}>
                                    Bloquear Respuesta ({(Object.values(gameState.yoNuncaGuessVotes || {}).filter(Boolean).length)} seleccionados)
                                </Button>
                            </div>
                        )}
                        {!canInteractGuess && (
                            <div className="text-center pt-4 text-muted-foreground animate-pulse font-medium">
                                Esperando a que adivinen...
                            </div>
                        )}
                    </div>
                )}

                {/* Phase 3: RESULT PHASE */}
                {phase === 'result_phase' && (
                    <div className="space-y-6">
                        <div className="text-center p-4 bg-card rounded-xl border border-white/10 shadow-lg">
                            <h3 className="text-2xl font-black text-primary mb-2 flex justify-center items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                Resultados
                            </h3>

                            {/* Calculate results locally for display */}
                            {(() => {
                                const truthMap = gameState.yoNuncaTruthVotes || {};
                                const guessMap = gameState.yoNuncaGuessVotes || {};
                                let correct = 0;
                                targetPlayers.forEach(p => { if (!!truthMap[p.id] === !!guessMap[p.id]) correct++; });
                                const mistakes = targetPlayers.length - correct;

                                return (
                                    <div className="mb-6 mt-4">
                                        {mistakes === 0 ? (
                                            <div className="text-green-400 font-bold text-xl animate-pulse">¡Adivinadores Acertaron TODO! (+5 pts)</div>
                                        ) : mistakes === 1 && targetPlayers.length > 1 ? (
                                            <div className="text-yellow-400 font-bold text-xl">¡Casi Perfecto! 1Fallo (+2 pts)</div>
                                        ) : (
                                            <div className="text-red-400 font-bold text-xl">Fallaron por {mistakes}. (0 pts)</div>
                                        )}
                                    </div>
                                );
                            })()}

                            <div className="grid gap-3">
                                {targetPlayers.map(p => {
                                    const didIt = !!gameState.yoNuncaTruthVotes?.[p.id];
                                    const guessedIt = !!gameState.yoNuncaGuessVotes?.[p.id];
                                    const isCorrectMatch = didIt === guessedIt;

                                    return (
                                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border-l-4 ${isCorrectMatch ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-700 flex justify-center items-center text-xs">{p.name.substring(0, 2)}</div>}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-sm leading-tight">{p.name}</p>
                                                    <p className="text-xs text-muted-foreground">{didIt ? 'Lo hizo' : 'No lo hizo'}</p>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-bold px-2 py-1 rounded ${isCorrectMatch ? 'text-green-400 bg-green-950' : 'text-red-400 bg-red-950'}`}>
                                                {isCorrectMatch ? 'Acertado' : 'Fallado'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button size="lg" className="w-full text-lg h-14" onClick={finishFlow}>
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
}
