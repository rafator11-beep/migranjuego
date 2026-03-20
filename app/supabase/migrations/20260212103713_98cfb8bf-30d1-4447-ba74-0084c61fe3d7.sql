
-- Feedback messages table for the buzón
CREATE TABLE public.feedback_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  message_text TEXT NOT NULL,
  game_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
ON public.feedback_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Feedback is publicly readable"
ON public.feedback_messages FOR SELECT
USING (true);

-- Question votes table
CREATE TABLE public.question_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_category TEXT NOT NULL DEFAULT 'general',
  vote_positive BOOLEAN NOT NULL,
  voter_name TEXT,
  game_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(question_text, voter_name, game_id)
);

ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can vote on questions"
ON public.question_votes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Votes are publicly readable"
ON public.question_votes FOR SELECT
USING (true);
