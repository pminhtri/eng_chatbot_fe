import { AccessToken, UserCredentials } from "../types";
import { axiosClient } from "../utils";

export const login = async ({
  email,
  password,
}: UserCredentials): Promise<AccessToken> => {
  const { data } = await axiosClient.post<AccessToken>("/auth/login", {
    email,
    password,
  });

  return data;
};
