/**
 * Netlify Function: generate-question
 *
 * Env vars required in Netlify:
 * - OPENAI_API_KEY
 * Optional:
 * - OPENAI_MODEL (default: gpt-4.1-mini)
 */

export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json' },
      });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY missing (set it in Netlify env vars).' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const mode = (body.mode || 'megamix').toString();
    const vibe = (body.vibe || 'fiesta').toString();
    const language = (body.language || 'es').toString();
    const avoid = Array.isArray(body.avoid) ? body.avoid.slice(0, 40) : [];

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const system =
      'Eres un generador de preguntas para un juego de fiesta. Devuelve SOLO un JSON válido, sin texto extra.';

    const user = {
      mode,
      vibe,
      language,
      rules: [
        'Devuelve un objeto JSON con {"text": string, "type": "pregunta"|"reto"|"afirmacion", "nsfw": boolean}.',
        'Máximo 160 caracteres en text.',
        'Nada de discurso de odio, nada ilegal, nada de menores.',
        'Evita repetir textos que estén en avoid.',
      ],
      avoid,
    };

    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        input: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) },
        ],
        // Keep it fast
        temperature: 0.9,
        max_output_tokens: 220,
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'OpenAI error', detail: text }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    const data = await resp.json();
    // Responses API returns output_text aggregated
    const outputText = data.output_text || '';
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = { text: outputText?.trim?.() || '', type: 'pregunta', nsfw: false };
    }

    if (!parsed || typeof parsed.text !== 'string') {
      parsed = { text: 'Di tu peor anécdota de fiesta en 10 segundos.', type: 'reto', nsfw: false };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Function crashed', detail: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
