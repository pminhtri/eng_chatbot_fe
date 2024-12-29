import { ConversationResponse, Conversation } from "../types";
import { axiosClient } from "../utils";

export const fetchConversation = async (): Promise<Conversation[]> => {
  const { data } =
    await axiosClient.get<ConversationResponse>("/conversations");

  return data.conversations;
};

export const updateConversationName = async (
  conversationId: string,
  name: string,
): Promise<Conversation> => {
  const { data } = await axiosClient.put(`/conversations/${conversationId}`, { name });

  return data.conversation;
}

export const deleteConversation = async (conversationId: string): Promise<void> => {
  await axiosClient.patch(`/conversations/delete/${conversationId}`);
}