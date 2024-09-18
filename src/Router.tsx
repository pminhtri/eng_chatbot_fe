import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageNotFound } from "./errors";
import configs from "./configs";
import { i18n } from "./utils";
import { useGlobalStore } from "./store";
import { Login, Logout, Register } from "./modules/auth";
import { fetchCurrentUser } from "./api";

const parseJwt = (accessToken: string) => {
  try {
    return JSON.parse(atob(accessToken.split(".")[1]));
  } catch (e) {
    return <></>;
  }
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { currentUser },
    actions: { setCurrentUser },
  } = useGlobalStore();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken") || "";

  const [isAccessTokenExpired, setIsAccessTokenExpired] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (accessToken) {
        const user = await fetchCurrentUser();

        return user;
      }
    },
    enabled: !currentUser,
    initialData: null,
  });

  useEffect(() => {
    const decodedJwt = parseJwt(accessToken);

    if (user) {
      setCurrentUser(user);
    }

    if (!decodedJwt || decodedJwt.exp * 1000 < Date.now()) {
      setIsAccessTokenExpired(true);
    }
  }, [user, accessToken, location]);

  if (isAccessTokenExpired) {
    return <Navigate to="/auth/logout" replace />;
  }

  if (isLoading) {
    return <></>;
  }

  if (currentUser && !isAccessTokenExpired) {
    return children;
  }

  return <Navigate to="/auth/logout" replace />;
};

function UnauthenticatedRoute({ children }: { children: React.ReactNode }) {
  const {
    state: { currentUser },
  } = useGlobalStore();

  const accessToken = localStorage.getItem("accessToken");

  if (!currentUser && !accessToken) {
    return children;
  }

  return <Navigate to="/" replace />;
}

function Router() {
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
      <Route path="/auth/logout" element={<Logout />} />
      <Route
        path="/"
        element={<AuthenticatedRoute>Hello World</AuthenticatedRoute>}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
