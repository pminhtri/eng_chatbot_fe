import { create } from "zustand";
import { login, register, logout } from "../../api";

type StateValue = {};

type Actions = {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthStore = {
  value: StateValue;
  actions: Actions;
};

const initialState: StateValue = {};

const useStore = create<AuthStore>(() => ({
  value: initialState,
  actions: {
    login: async (email: string, password: string) => {
      const { accessToken } = await login({ email, password });

      localStorage.setItem("accessToken", accessToken);
    },
    register: async (email: string, password: string) => {
      await register({ email, password });
    },
    logout: async () => {
      await logout();

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .trim()
          .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
      });

      localStorage.removeItem("accessToken");
    },
  },
}));

export const useAuthStore = useStore;
