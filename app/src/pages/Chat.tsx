import { OnlineChat } from '@/components/chat/OnlineChat';

export function ChatPage() {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern pb-24 pt-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-black neon-text text-[hsl(var(--neon-purple))] mb-2">💬 Chat</h1>
        <p className="text-muted-foreground mb-4">Habla con la comunidad en tiempo real</p>
        <OnlineChat />
      </div>
    </div>
  );
}
