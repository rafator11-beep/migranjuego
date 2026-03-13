import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    isSystem?: boolean;
}

export function ChatComponent({ roomId, playerName }: { roomId: string, playerName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Identity state
    const [localNickname, setLocalNickname] = useState(() => localStorage.getItem('chat_nickname') || playerName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('chat_nickname')) {
            // First time sync
            setLocalNickname(playerName);
        }
    }, [playerName]);

    const saveName = () => {
        if (tempName.trim()) {
            const finalName = tempName.trim();
            setLocalNickname(finalName);
            localStorage.setItem('chat_nickname', finalName);
            setIsEditingName(false);
        }
    };

    useEffect(() => {
        if (!roomId || !isSupabaseConfigured) return;

        const channel = supabase.channel(`room:${roomId}`);

        channel
            .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
                setMessages(prev => [...prev, payload]);
                if (!isOpen) setHasUnread(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [isOpen, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            sender: roomId === 'global_lobby' ? localNickname : playerName,
            text: newMessage.trim(),
            timestamp: Date.now()
        };

        // Optimistic update
        setMessages(prev => [...prev, msg]);
        setNewMessage('');

        if (isSupabaseConfigured) {
            await supabase.channel(`room:${roomId}`).send({
                type: 'broadcast',
                event: 'chat_message',
                payload: msg
            });
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.div
                className="fixed bottom-24 right-4 z-[99999]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <Button
                    size="icon"
                    className={`rounded-full h-14 w-14 shadow-2xl border-2 ${hasUnread ? 'bg-red-500 hover:bg-red-600 animate-bounce' : 'bg-primary hover:bg-primary/90'}`}
                    onClick={() => setIsOpen(true)}
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                    {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />}
                </Button>
            </motion.div>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-40 right-4 w-80 h-96 bg-black/95 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl z-[99999] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-3 border-b border-white/10 flex justify-between items-center ${roomId === 'global_lobby' ? 'bg-purple-500/10' : 'bg-white/5'}`}>
                            {roomId === 'global_lobby' && isEditingName ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                    <Input
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="h-7 text-xs bg-black/50 border-white/20"
                                        placeholder="Tu nombre..."
                                        maxLength={12}
                                    />
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveName}>
                                        <div className="text-green-400">✓</div>
                                    </Button>
                                </div>
                            ) : (
                                <h3 className="font-bold flex items-center gap-2" onClick={() => roomId === 'global_lobby' && setIsEditingName(true)}>
                                    <MessageCircle className={`w-4 h-4 ${roomId === 'global_lobby' ? 'text-purple-400' : 'text-blue-400'}`} />
                                    {roomId === 'global_lobby' ? 'Chat Global' : `Sala ${roomId}`}
                                    {roomId === 'global_lobby' && <span className="text-[10px] bg-white/10 px-1 rounded ml-2 cursor-pointer border border-white/5 hover:bg-white/20" title="Cambiar nombre">✏️ {localNickname}</span>}
                                </h3>
                            )}

                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground text-xs py-10 opacity-50">
                                    ¡Di hola a los demás jugadores!
                                </div>
                            )}
                            {messages.map((msg) => {
                                const isMe = msg.sender === playerName;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && <span className="text-[10px] text-muted-foreground ml-1">{msg.sender}</span>}
                                        <div
                                            className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-secondary text-secondary-foreground rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10 flex gap-2 bg-white/5">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Escribe un mensaje..."
                                className="h-10 bg-transparent border-white/20"
                            />
                            <Button size="icon" className="h-10 w-10 shrink-0" onClick={sendMessage}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
