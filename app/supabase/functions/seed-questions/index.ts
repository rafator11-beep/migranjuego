import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const body = await req.json().catch(() => ({} as any));
  const mode = (body?.mode as string | undefined) ?? 'futbol';

  // Seed questions (idempotent): insert only missing by question text
  const { data: existing, error: existingErr } = await supabase
    .from('questions')
    .select('question')
    .eq('mode', mode)
    .limit(1000);

  if (existingErr) {
    return new Response(JSON.stringify({ error: existingErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const existingSet = new Set((existing || []).map((r: any) => r.question));

  // Import extra set (user-provided) and seed for futbol mode
  // Note: This function focuses on futbol questions for Tic Tac Toe.
  const { extraFootballSeedQuestions } = await import('./extraFootballQuestions.ts');

  const seedPool = mode === 'futbol' ? extraFootballSeedQuestions : [];
  const toInsert = seedPool.filter((q: any) => !existingSet.has(q.question));

  if (toInsert.length === 0) {
    return new Response(JSON.stringify({ message: `No new questions to seed for mode=${mode}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error: insertErr } = await supabase.from('questions').insert(toInsert);

  if (insertErr) {
    return new Response(JSON.stringify({ error: insertErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: `Seeded ${toInsert.length} questions for mode=${mode}` }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
