import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sender_name, category, message_text, game_mode } = await req.json();

    if (!message_text?.trim()) {
      return new Response(
        JSON.stringify({ error: "message_text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("feedback_messages").insert({
      sender_name: sender_name || null,
      category: category || "general",
      message_text: message_text.trim(),
      game_mode: game_mode || null,
    });

    if (dbError) {
      console.error("DB insert error:", JSON.stringify(dbError));
    } else {
      console.log("DB insert OK");
    }

    // Send email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY present:", !!resendKey, "length:", resendKey?.length ?? 0);

    let emailSent = false;
    if (resendKey) {
      const categoryLabel = {
        general: "General",
        bug: "🐛 Bug/Error",
        pregunta_futbol: "⚽ Pregunta Fútbol",
        pregunta_cultura: "🧠 Pregunta Cultura",
        mimica: "🎭 Mímica",
        bocacerrada: "🤐 Boca Cerrada",
        mejora: "💡 Mejora de App",
        reto: "🎯 Nuevo Reto",
      }[category] || category;

      const emailPayload = {
        from: "Fitanox App <onboarding@resend.dev>",
        to: ["Rafator11@gmail.com"],
        subject: `[Fitanox] ${categoryLabel} - Nuevo feedback`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">📬 Nuevo Feedback en Fitanox</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Categoría:</td><td style="padding: 8px;">${categoryLabel}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">De:</td><td style="padding: 8px;">${sender_name || "Anónimo"}</td></tr>
              ${game_mode ? `<tr><td style="padding: 8px; font-weight: bold;">Modo:</td><td style="padding: 8px;">${game_mode}</td></tr>` : ""}
            </table>
            <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <p style="margin: 0; white-space: pre-wrap;">${message_text}</p>
            </div>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 16px;">Enviado desde Fitanox App</p>
          </div>
        `,
      };

      console.log("Sending email to:", emailPayload.to, "from:", emailPayload.from);

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      const resBody = await emailRes.text();
      console.log(`Resend response [${emailRes.status}]: ${resBody}`);

      if (emailRes.ok) {
        emailSent = true;
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email");
    }

    return new Response(
      JSON.stringify({ success: true, email_sent: emailSent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-feedback:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
