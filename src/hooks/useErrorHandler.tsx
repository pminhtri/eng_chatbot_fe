import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "./useAlert";
import { AppError } from "../types";
import { ErrorCode } from "../enums";
import { Path } from "../Router";

type ReturnType = {
  handleError: (error: Error) => void;
};

export const useErrorHandler = (): ReturnType => {
  const { showErrorMessage } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error: Error) => {
    if (error instanceof AppError) {
      if (error.code === ErrorCode.UNAUTHORIZED) {
        return navigate(Path["Login"], { replace: true });
      }
      
      if (error.code === ErrorCode.PERMISSION_DENIED) {
        return navigate(Path["PermissionDenied"], {
          replace: true,
          state: { prevRoute: location },
        });
      }
    }

    return showErrorMessage(error.message);
  };

  return { handleError };
};
