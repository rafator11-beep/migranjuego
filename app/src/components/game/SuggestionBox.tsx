import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquarePlus, Check, Bug, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface SuggestionBoxProps {
  onClose: () => void;
  gameMode?: string;
  senderName?: string;
}

export function SuggestionBox({ onClose, gameMode, senderName }: SuggestionBoxProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('general');
  const [name, setName] = useState(senderName || '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-feedback', {
        body: {
          sender_name: name.trim() || null,
          category,
          message_text: text.trim(),
          game_mode: gameMode || null,
        },
      });

      if (fnError) throw fnError;

      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Error al enviar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-8 text-center shadow-xl border"
      >
        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Gracias!</h2>
        <p className="text-muted-foreground">Tu mensaje ha sido enviado por email y guardado</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-xl border"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Buzón de Feedback</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Reporta errores, sugiere mejoras o envía nuevas preguntas. ¡Todo llega por email!
      </p>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tu nombre (opcional)"
        className="w-full mb-3 p-3 rounded-xl bg-secondary border border-border text-foreground"
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl bg-secondary border border-border text-foreground"
      >
        <option value="general">💬 Sugerencia general</option>
        <option value="bug">🐛 Reportar error/bug</option>
        <option value="pregunta_futbol">⚽ Pregunta de Fútbol</option>
        <option value="pregunta_cultura">🧠 Pregunta de Cultura</option>
        <option value="reto">🎯 Nuevo reto/prueba</option>
        <option value="mimica">🎭 Mímica</option>
        <option value="bocacerrada">🤐 Boca Cerrada</option>
        <option value="mejora">💡 Mejora de la app</option>
      </select>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        className="w-full h-32 p-3 rounded-xl bg-secondary border border-border text-foreground resize-none mb-2"
        maxLength={1000}
      />
      <p className="text-xs text-muted-foreground mb-4">{text.length}/1000</p>

      {error && (
        <p className="text-sm text-destructive mb-3">{error}</p>
      )}

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={!text.trim() || loading} className="flex-1">
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </motion.div>
  );
}
