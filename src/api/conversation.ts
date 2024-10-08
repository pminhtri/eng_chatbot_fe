import {  ConversationResponse } from "../types";
import { axiosClient } from "../utils";

export const getConversations = async (): Promise<ConversationResponse> => {
  const { data } = await axiosClient.get<ConversationResponse>("/conversations");

  return data;
};