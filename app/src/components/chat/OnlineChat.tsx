import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ChatMsg = { id: string; name: string; text: string; ts: number };

function safeId() {
  // Safari / iOS can fail on crypto.randomUUID in some contexts.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = globalThis.crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getRoomId() {
  const key = 'fiesta-party-chat-room';
  let v = localStorage.getItem(key);
  if (!v) {
    v = 'global';
    localStorage.setItem(key, v);
  }
  return v;
}

export function OnlineChat() {
  const roomId = useMemo(() => getRoomId(), []);
  const [name, setName] = useState(() => localStorage.getItem('fiesta-party-chat-name') || '');
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fiesta-party-chat-cache') || '[]');
    } catch { return []; }
  });
  const listRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // If Supabase is not configured, keep an offline local cache (no crash).
    if (!isSupabaseConfigured) return;

    const channel = supabase.channel(`party_chat:${roomId}`, {
      config: { broadcast: { self: true } },
    });
    channelRef.current = channel;

    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      const m = payload as ChatMsg;
      setMsgs(prev => {
        const next = [...prev, m].slice(-80); // limit for performance
        localStorage.setItem('fiesta-party-chat-cache', JSON.stringify(next));
        return next;
      });
    });

    channel.subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } finally {
        if (channelRef.current === channel) channelRef.current = null;
      }
    };
  }, [roomId]);

  useEffect(() => {
    // autoscroll
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, [msgs.length]);

  const send = async () => {
    const n = name.trim() || 'Anónimo';
    const t = text.trim();
    if (!t) return;

    localStorage.setItem('fiesta-party-chat-name', n);

    const msg: ChatMsg = { id: safeId(), name: n, text: t, ts: Date.now() };
    setText('');

    // If online isn't ready, still show it locally.
    if (!isSupabaseConfigured || !channelRef.current) {
      setMsgs(prev => {
        const next = [...prev, msg].slice(-80);
        localStorage.setItem('fiesta-party-chat-cache', JSON.stringify(next));
        return next;
      });
      return;
    }

    await channelRef.current.send({
      type: 'broadcast',
      event: 'message',
      payload: msg,
    });
  };

  return (
    <div className="mt-8 bg-card/60 backdrop-blur-sm border border-border/30 rounded-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold">💬 Chat online</p>
        <p className="text-xs text-muted-foreground">Sala: {roomId}</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-3 text-xs text-muted-foreground bg-secondary/30 border border-border/40 rounded-xl p-2">
          Estás en modo <b>offline</b>. Para activar el chat online, configura en Netlify: <b>VITE_SUPABASE_URL</b> y <b>VITE_SUPABASE_PUBLISHABLE_KEY</b>.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="h-9" />
        <div className="md:col-span-2 flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje..." className="h-9" onKeyDown={(e) => e.key === 'Enter' && send()} />
          <Button onClick={send} className="h-9 px-3"><Send className="h-4 w-4" /></Button>
        </div>
      </div>

      <div ref={listRef} className="max-h-56 overflow-y-auto space-y-1 pr-1">
        {msgs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Nadie ha escrito aún…</p>
        ) : (
          msgs.map(m => (
            <div key={m.id} className="text-sm">
              <span className="font-semibold">{m.name}:</span> <span className="opacity-90">{m.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
