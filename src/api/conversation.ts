import { ConversationResponse, Conversation } from "../types";
import { axiosClient } from "../utils";

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await axiosClient.get<ConversationResponse>("/conversations");

  return data.conversations;
};