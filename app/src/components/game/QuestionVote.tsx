import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

interface QuestionVoteProps {
  questionText: string;
  questionCategory: string;
  voterName?: string;
  gameId?: string;
  players?: { id: string; name: string; avatar_url: string | null }[];
}

export function QuestionVote({ questionText, questionCategory, voterName, gameId, players = [] }: QuestionVoteProps) {
  const [voted, setVoted] = useState<boolean | string | null>(null);

  const bumpLocalVote = (key: string, delta: number) => {
    try {
      const raw = localStorage.getItem('fiesta-party-votes');
      const data = raw ? JSON.parse(raw) : {};
      data[questionCategory] = data[questionCategory] || {};
      const target = key === 'positive' ? `${questionText}_YES` : key === 'negative' ? `${questionText}_NO` : `${questionText}_${key}`;
      data[questionCategory][target] = (data[questionCategory][target] || 0) + delta;
      localStorage.setItem('fiesta-party-votes', JSON.stringify(data));
    } catch { }
  };

  const handleVote = async (value: boolean | string) => {
    if (voted !== null) return;
    setVoted(value);

    const voteKey = typeof value === 'boolean' ? (value ? 'positive' : 'negative') : value;
    bumpLocalVote(voteKey, 1);

    if (!isSupabaseConfigured) return;

    try {
      // If value is string, it's a player ID. current schema might need adjustment or we store in metadata?
      // actually the prompt implies we vote FOR a person. 
      // The current table `question_votes` has `vote_positive` boolean.
      // We might need to store `vote_target` (string).
      // For now, let's just log it or try to upsert if the column exists.
      // If simple boolean schema, we can't store person ID easily without schema change.
      // Assuming we just want visual feedback for now or local storage.
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  if (voted !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-1"
      >
        ✅ ¡Votado!
      </motion.div>
    );
  }

  // If players are provided, show them as options (for "Who is most likely")
  if (players && players.length > 0) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <span className="text-xs text-muted-foreground text-center">¿Quién es más probable?</span>
        <div className="flex flex-wrap justify-center gap-2">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => handleVote(p.name)} // Vote for Name
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 border border-transparent hover:border-primary/50 transition-all text-xs"
            >
              {p.avatar_url && <img src={p.avatar_url} className="w-5 h-5 rounded-full object-cover" />}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 py-1">
      <span className="text-xs text-muted-foreground">¿Buena pregunta?</span>
      <button
        onClick={() => handleVote(true)}
        className="p-2 rounded-full hover:bg-green-500/20 transition-colors"
      >
        <ThumbsUp className="w-4 h-4 text-green-500" />
      </button>
      <button
        onClick={() => handleVote(false)}
        className="p-2 rounded-full hover:bg-red-500/20 transition-colors"
      >
        <ThumbsDown className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}
