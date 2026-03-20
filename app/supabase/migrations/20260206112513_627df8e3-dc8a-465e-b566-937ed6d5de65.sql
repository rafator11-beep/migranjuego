
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  submitted_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suggestions are publicly readable" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Anyone can submit suggestions" ON public.suggestions FOR INSERT WITH CHECK (true);
