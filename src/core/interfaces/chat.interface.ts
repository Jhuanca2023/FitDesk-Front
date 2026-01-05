export interface ChatMessage {
  id: string;
  roomId: string;
  fromId: string;
  fromRole: "TRAINER" | "USER";
  text: string;
  createdAt: string;
}

export interface SendMessageData {
  text: string;
  fromId?: string;
  fromRole?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "TRAINER" | "USER";
  isOnline?: boolean;
  initials: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  connected: boolean;
  lastMessageDate?: string;

}

export interface SendMessageRequest {
  text: string;
  toUserId: string;
}

export interface CreateConversationRequest {
  participantId: string;
  participantRole: "TRAINER" | "USER";
}