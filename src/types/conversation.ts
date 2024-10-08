export type Conversation = {
  _id: string;
  userId: string;
  name?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationResponse = {
  conversations: Conversation[];
};

export type ConversationsData = {
  name: string | undefined;
  createdAt: Date;
  _id: string;
};

export type ConversationId = {
  conversationId: string;
};
