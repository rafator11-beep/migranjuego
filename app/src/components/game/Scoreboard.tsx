import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Player, Team } from '@/types/game';

interface ScoreboardProps {
  players: Player[];
  teams: Team[];
  showTeams?: boolean;
  currentPlayerId?: string | null;
  compact?: boolean;
}

export function Scoreboard({ players, teams, showTeams = false, currentPlayerId, compact = false }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1: return <Medal className="h-4 w-4 text-gray-400" />;
      case 2: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return null;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              player.id === currentPlayerId 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            {getPositionIcon(index)}
            <span className="font-medium">{player.name}</span>
            <span className="opacity-70">{player.score}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Puntuaciones
      </h3>

      {showTeams && teams.length > 0 ? (
        <div className="space-y-4">
          {/* Teams */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Equipos</h4>
            {sortedTeams.map((team, index) => {
              const teamPlayers = players.filter(p => p.team_id === team.id);
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  {getPositionIcon(index)}
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="font-medium flex-1">{team.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {teamPlayers.length} jugadores
                  </span>
                  <span className="font-bold text-lg text-primary">{team.score}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Individual within teams */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Jugadores</h4>
            {sortedPlayers.map((player, index) => {
              const team = teams.find(t => t.id === player.team_id);
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    player.id === currentPlayerId ? 'bg-primary/10 ring-1 ring-primary' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {player.avatar_url ? (
                      <AvatarImage src={player.avatar_url} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {player.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="flex-1 text-sm">{player.name}</span>
                  {team && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                  )}
                  <span className="font-medium">{player.score}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                player.id === currentPlayerId 
                  ? 'bg-primary/10 ring-2 ring-primary' 
                  : 'bg-muted/50'
              }`}
            >
              {getPositionIcon(index)}
              <Avatar className="h-10 w-10">
                {player.avatar_url ? (
                  <AvatarImage src={player.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {player.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium flex-1">{player.name}</span>
              <span className="font-bold text-xl text-primary">{player.score}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
