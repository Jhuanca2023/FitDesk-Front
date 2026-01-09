import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webSocketService } from '@/core/services/web-socket.service';
import { useAuthStore } from '@/core/store/auth.store';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { ChatMessage, Conversation, SendMessageRequest, CreateConversationRequest } from '../interfaces/chat.interface';

export function useChat(conversationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, isTrainer } = useAuthStore();
  const queryClient = useQueryClient();


  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const response = await fitdeskApi.get<Conversation[]>('/chat/conversations');
      return response.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: initialMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!conversationId) return [];
      const response = await fitdeskApi.get<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    },
    enabled: !!conversationId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
    queryClient.setQueryData<Conversation[] | undefined>(['conversations'], (old) => {
      if (!old) return old;

      return old.map(conv => {
        if (conv.id === message.roomId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount: message.fromId !== user?.id ? conv.unreadCount + 1 : conv.unreadCount,
          };
        }
        return conv;
      });
    });
  }, [queryClient, user?.id]);

  useEffect(() => {
    if (!conversationId || !user) return;

    setIsConnecting(true);

    const connectWebSocket = async () => {
      try {
        await webSocketService.connect(conversationId, handleNewMessage);
        setConnectionState(webSocketService.getConnectionState());
      } catch (error) {
        console.error('Error conectando WebSocket:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    connectWebSocket();

    const stateInterval = setInterval(() => {
      setConnectionState(webSocketService.getConnectionState());
    }, 1000);

    return () => {
      clearInterval(stateInterval);
      webSocketService.disconnect();
    };
  }, [conversationId, user, handleNewMessage]);

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else if (conversationId) {
      setMessages([]);
    }
  }, [initialMessages, conversationId]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ text }: SendMessageRequest) => {
      if (!conversationId) throw new Error('No hay conversación seleccionada');

      const userRole = isTrainer() ? 'TRAINER' : 'USER';

      const success = webSocketService.sendMessage({
        text,
        fromId: user?.id,
        fromRole: userRole
      });

      if (!success) {
        const response = await fitdeskApi.post<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
          text,
          fromId: user?.id,
          fromRole: userRole
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Error al enviar mensaje:', error);
    }
  });

  const createConversationMutation = useMutation({
    mutationFn: async ({ participantId, participantRole }: CreateConversationRequest) => {
      const response = await fitdeskApi.post('/chat/conversations', {
        participantId,
        participantRole
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await fitdeskApi.patch(`/chat/conversations/${conversationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    conversations,
    messages,

    conversationsLoading,
    messagesLoading,
    isConnecting,

    connectionState,
    isConnected: connectionState === 'CONNECTED',

    sendMessage: sendMessageMutation.mutate,
    createConversation: createConversationMutation.mutate,
    markAsRead: markAsReadMutation.mutate,

    isSendingMessage: sendMessageMutation.isPending,
    isCreatingConversation: createConversationMutation.isPending,

    messagesEndRef
  };
}