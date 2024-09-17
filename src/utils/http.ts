import axios from "axios";
import { AppError } from "../types";
import { ErrorCode } from "../enums";

const axiosClient = axios.create({
  baseURL: `http://localhost:5001/api`,
});

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
