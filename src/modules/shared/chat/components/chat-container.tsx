import { useChat } from '@/core/hooks/useChat';
import type { Conversation } from '@/core/interfaces/chat.interface';
import { useState, useEffect } from 'react';
import { UserList } from './user-list';
import { ChatArea } from './chat-area';
import { ConversationsList } from './conversations-list';

interface ChatContainerProps {
  userRole: 'TRAINER' | 'USER';
}

export function ChatContainer({ userRole }: ChatContainerProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    conversations,
    messages,
    conversationsLoading,
    sendMessage,
    createConversation,
    markAsRead,
    connectionState,
    isConnected,
    messagesEndRef
  } = useChat(selectedConversation?.id);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    markAsRead(conversation.id);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedConversation || !text.trim()) return;

    sendMessage({
      text: text.trim(),
      toUserId: selectedConversation.participant.id
    });
  };

  const handleCreateConversation = (participantId: string, participantRole: 'TRAINER' | 'USER') => {
    createConversation({
      participantId,
      participantRole
    });
    setShowUserList(false);
  };

  // Vista móvil
  if (isMobile) {
    if (selectedConversation) {
      return (
        <div className="h-full bg-background">
          <ChatArea
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            connectionState={connectionState}
            isConnected={isConnected}
            messagesEndRef={messagesEndRef}
            isMobile
          />
        </div>
      );
    }

    if (showUserList) {
      return (
        <div className="h-full bg-background">
          <UserList
            targetRole={userRole === 'TRAINER' ? 'USER' : 'TRAINER'}
            onSelectUser={handleCreateConversation}
            onBack={() => setShowUserList(false)}
          />
        </div>
      );
    }

    return (
      <div className="h-full bg-background">
        <ConversationsList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => setShowUserList(true)}
          isLoading={conversationsLoading}
          userRole={userRole}
        />
      </div>
    );
  }

  // Vista desktop
  return (
    <div className="flex h-full bg-background">
      <div className="w-80 border-r border-border">
        {showUserList ? (
          <UserList
            targetRole={userRole === 'TRAINER' ? 'USER' : 'TRAINER'}
            onSelectUser={handleCreateConversation}
            onBack={() => setShowUserList(false)}
          />
        ) : (
          <ConversationsList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onNewChat={() => setShowUserList(true)}
            isLoading={conversationsLoading}
            userRole={userRole}
          />
        )}
      </div>

      <div className="flex-1">
        {selectedConversation ? (
          <ChatArea
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            connectionState={connectionState}
            isConnected={isConnected}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
              <p className="text-sm text-muted-foreground">
                Elige una conversación para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}