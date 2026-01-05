import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Smile } from 'lucide-react'; // Importa el ícono de emoji
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { useAuthStore } from '@/core/store/auth.store';
import type { ChatMessage, Conversation } from '@/core/interfaces/chat.interface';
import { MessageBubble } from '@/modules/shared/chat/components/message-bubble';
import Picker from '@emoji-mart/react'; // Importa el selector de emojis
import data from '@emoji-mart/data'; // Importa los datos de emojis

export function ChatArea({
    conversation,
    messages,
    onSendMessage,
    onBack,
    connectionState,
    isConnected,
    messagesEndRef,
    isMobile = false
}: ChatAreaProps) {
    const [messageText, setMessageText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Estado para mostrar/ocultar el selector de emojis
    const { user } = useAuthStore();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messagesEndRef]);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        onSendMessage(messageText);
        setMessageText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessageText((prev) => prev + emoji.native); // Agrega el emoji al texto del mensaje
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    {isMobile && onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback>
                            {getInitials(conversation.participant.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h3 className="font-medium text-foreground">
                            {conversation.participant.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isConnected ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {connectionState === 'CONNECTED' ? 'En línea' : 'Desconectado'}
                            </Badge>
                            {conversation.participant.isOnline && (
                                <span className="text-xs text-green-600">• Activo</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-medium mb-2">Inicia la conversación</h3>
                        <p className="text-center text-sm">
                            Envía un mensaje para comenzar a chatear con {conversation.participant.name}
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => {
                            const isCurrentUser = message.fromId === user?.id;
                            const showAvatar = !isCurrentUser && (
                                index === 0 ||
                                messages[index - 1]?.fromId !== message.fromId
                            );

                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isCurrentUser={isCurrentUser}
                                    showAvatar={showAvatar}
                                    participant={conversation.participant}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input de mensajes */}
            <div className="p-4 border-t border-border bg-card relative">
                {showEmojiPicker && (
                    <div className="absolute bottom-16 left-4 z-10">
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Smile className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <Textarea
                            placeholder="Escribe un mensaje..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="min-h-[40px] max-h-[120px] resize-none"
                            disabled={!isConnected}
                        />
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || !isConnected}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                {!isConnected && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Conexión perdida. Reintentando...
                    </p>
                )}
            </div>
        </div>
    );
}