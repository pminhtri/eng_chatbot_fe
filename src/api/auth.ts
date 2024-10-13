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

export const register = async ({
  email,
  password,
}: UserCredentials): Promise<void> => {
  await axiosClient.post("/auth/signup", {
    email,
    password,
  });
};

export const logout = async (): Promise<void> => {
  await axiosClient.get("/auth/logout");
};
