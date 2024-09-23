import { PublicChatRequest, PublicChatResponse } from "../types";
import { axiosClient } from "../utils";

export const publicChat = async ({
  message,
}: PublicChatRequest): Promise<PublicChatResponse> => {
  const { data } = await axiosClient.post<PublicChatResponse>("chat/public", {
    message,
  });

  return data;
};
