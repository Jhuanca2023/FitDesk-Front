import { useState } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import type { Conversation } from '@/core/interfaces/chat.interface';
import { formatUsername } from '@/core/utils/chat-helpers';

interface ConversationsListProps {
    conversations: Conversation[];
    selectedConversation?: Conversation | null;
    onSelectConversation: (conversation: Conversation) => void;
    onNewChat: () => void;
    isLoading: boolean;
    userRole: 'TRAINER' | 'USER';
}

export function ConversationsList({
    conversations,
    selectedConversation,
    onSelectConversation,
    onNewChat,
    isLoading,
    userRole
}: ConversationsListProps) {
    console.log("conversations", conversations);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(conv =>
        conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('es-ES', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit'
            });
        }
    };


    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-foreground">
                        {userRole === 'TRAINER' ? 'Mis Alumnos' : 'Mis Entrenadores'}
                    </h1>
                    <Button
                        onClick={onNewChat}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    {filteredConversations.length} conversación{filteredConversations.length !== 1 ? 'es' : ''}
                </p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Buscar ${userRole === 'TRAINER' ? 'alumnos' : 'entrenadores'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <>
                            <div key={i} className="flex items-center gap-3 p-3">
                                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                                <div className="flex-1">
                                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <MessageCircle className="h-16 w-16 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No hay conversaciones</h3>
                        <p className="text-center text-sm text-muted-foreground/70 mb-4">
                            {userRole === 'TRAINER'
                                ? 'Comienza a chatear con tus alumnos'
                                : 'Comienza a chatear con tus entrenadores'
                            }
                        </p>
                        <Button onClick={onNewChat} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Iniciar conversación
                        </Button>
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredConversations.map((conversation) => (
                            // biome-ignore lint/a11y/noStaticElementInteractions: <>
                            // biome-ignore lint/a11y/useKeyWithClickEvents: <>
                            <div
                                key={conversation.id}
                                onClick={() => onSelectConversation(conversation)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation?.id === conversation.id
                                    ? "bg-muted border-l-2 border-primary"
                                    : "hover:bg-muted/50"
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={conversation.participant.avatar} />
                                        <AvatarFallback>
                                            {conversation.participant.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conversation.connected && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-medium text-foreground truncate">
                                            {formatUsername(conversation.participant.name)}
                                        </h3>
                                        {conversation.lastMessage && (
                                            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                                {formatTime(conversation.lastMessageDate ?? '')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground truncate">
                                            {conversation.lastMessage?.text || 'Sin mensajes aún...'}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <Badge className="bg-destructive text-destructive-foreground text-xs min-w-[20px] h-5">
                                                {conversation.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}