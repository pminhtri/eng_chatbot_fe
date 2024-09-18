import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "./useAlert";
import { AppError } from "../types";
import { ErrorCode } from "../enums";

type ReturnType = {
  handleError: (error: Error) => void;
};

export const useErrorHandler = (): ReturnType => {
  const { t } = useTranslation();
  const { showErrorMessage } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error: Error) => {
    if (error instanceof AppError) {
      if (error.code === ErrorCode.UNAUTHORIZED) {
        return navigate("/auth/logout", { replace: true });
      }

      if (error.code === ErrorCode.RESOURCE_NOT_FOUND) {
        return navigate("/page-not-found", {
          replace: true,
          state: { prevRoute: location },
        });
      }

      if (error.code === ErrorCode.PERMISSION_DENIED) {
        return navigate("/permission-denied", {
          replace: true,
          state: { prevRoute: location },
        });
      }
    }

    return showErrorMessage(t("error.internal"));
  };

  return { handleError };
};
