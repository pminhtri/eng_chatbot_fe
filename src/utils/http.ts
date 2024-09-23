import axios from "axios";
import { AppError } from "../types";
import { ErrorCode } from "../enums";
import configs from "../../src/configs";

const axiosClient = axios.create({
  baseURL: configs.VITE_APP_API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (e) => {
    const error = new AppError(
      e.response?.status === 404
        ? ErrorCode.RESOURCE_NOT_FOUND
        : e.response?.status === 500
          ? ErrorCode.INTERNAL_ERROR
          : ErrorCode.UNKNOWN,
      e.response?.data?.message || e.message,
      {
        ...(e.response?.data?.details || e.details),
        data: e.response?.data?.data,
      },
    );

    throw error;
  },
);

export default axiosClient;
