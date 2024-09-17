import { UserDetails } from "../types";
import { axiosClient } from "../utils";

export const fetchCurrentUser = async () => {
  const response = await axiosClient.get<UserDetails>("/user/profile");

  return response.data;
};
