import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PageNotFound } from "./errors";
import configs from "./configs";
import { i18n } from "./utils";
import { useGlobalStore } from "./store";
import { Login, Register } from "./modules/auth";
import { useErrorHandler } from "./hooks";
import { AppError } from "./types";
import { LandingPage, PublicEChat } from "./modules/landingPage";

const parseJwt = (accessToken: string) => {
  try {
    return JSON.parse(atob(accessToken.split(".")[1]));
  } catch (e) {
    return <></>;
  }
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    value: { currentUser },
  } = useGlobalStore();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken") || "";

  const [isAccessTokenExpired, setIsAccessTokenExpired] = useState(false);

  useEffect(() => {
    const decodedJwt = parseJwt(accessToken);

    if (!decodedJwt || decodedJwt.exp * 1000 < Date.now()) {
      setIsAccessTokenExpired(true);
    }
  }, [accessToken, location]);

  if (isAccessTokenExpired) {
    localStorage.removeItem("accessToken");

    return <Navigate to="/auth/login" replace />;
  }

  if (!currentUser && !accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

function UnauthenticatedRoute({ children }: { children: React.ReactNode }) {
  const {
    value: { currentUser },
  } = useGlobalStore();
  const accessToken = localStorage.getItem("accessToken");

  if (currentUser && accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ReceiveThirdPartyTokenRoute() {
  const {
    actions: { fetchCurrentUser },
  } = useGlobalStore();

  const { handleError } = useErrorHandler();

  if (document.cookie && document.referrer === "https://accounts.google.com/") {
    localStorage.setItem("accessToken", document.cookie.split("=")[1]);

    fetchCurrentUser()
      .then(() => {
        return <Navigate to="/" replace />;
      })
      .catch((error) => {
        handleError(error as AppError);
      });
  }
  return <Navigate to="/auth/login" replace />;
}

function Router() {
  const {
    value: { currentUser },
  } = useGlobalStore();

  useEffect(() => {
    const loadLanguage = async () => {
      await i18n.changeLanguage(configs.DEFAULT_LANGUAGE_CODE);
    };

    loadLanguage();
  }, []);

  return (
    <Routes>
      <Route
        path="/auth/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <UnauthenticatedRoute>
            <Register />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/auth/third-party-token"
        element={<ReceiveThirdPartyTokenRoute />}
      />
      <Route
        path="/"
        element={
          <>
            {currentUser && localStorage.getItem("accessToken") ? (
              <AuthenticatedRoute>
                <LandingPage />
              </AuthenticatedRoute>
            ) : (
              <UnauthenticatedRoute>
                <PublicEChat />
              </UnauthenticatedRoute>
            )}
          </>
        }
      >
        <Route path="conversations/:conversationsId" element={<LandingPage />}/>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
