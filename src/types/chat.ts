import { Conversation } from "./conversation";

export type PublicChatRequest = {
  message: string;
};

export type PublicChatResponse = {
  response: string;
};

export type PrivateChat = {
  _id: string;
  message: string;
  response: string;
  conversationId?: string;
  updatedAt: Date;
};

export type PrivateChatRequest = {
  chatData: {
    conversationId?: string;
    message: string;
  };
  userId: string | undefined;
};

export type PrivateChatResponse = {
  response: {
    newChat: PrivateChat;
    newConversation: Conversation;
  };
};
