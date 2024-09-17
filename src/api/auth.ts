import { AccessToken, UserCredentials } from "../types";
import { axiosClient } from "../utils";

export const login = async ({
  email,
  password,
}: UserCredentials): Promise<void> => {
  const { data } = await axiosClient.post<AccessToken>("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("accessToken", data.accessToken);
};
