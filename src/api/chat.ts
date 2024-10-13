import { AxiosResponse } from "axios";
import {
  PrivateChatRequest,
  PrivateChatResponse,
  PublicChatRequest,
  PublicChatResponse,
  PrivateChatsFetch,
} from "../types";
import { axiosClient } from "../utils";

export const publicChat = async ({
  message,
}: PublicChatRequest): Promise<PublicChatResponse> => {
  const { data } = await axiosClient.post<PublicChatResponse>("chat/public", {
    message,
  });

  return data;
};

export const privateChat = async ({
  chatData,
  userId,
}: PrivateChatRequest): Promise<PrivateChatResponse> => {
  const { data } = await axiosClient.post<PrivateChatResponse>("chat/private", {
    chatData,
    userId,
  });

  return data;
};

export const fetchChatsByConversation = async (
  page: number,
  conversationId?: string,
): Promise<PrivateChatsFetch> => {
  const { data }: AxiosResponse = await axiosClient.get<PrivateChatsFetch>(
    "chat",
    { params: { conversationId, page: page } },
  );

  return data;
};
