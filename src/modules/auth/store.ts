import { create } from "zustand";
import { login, register } from "../../api";

type StateValue = {};

type Actions = {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
    logout: () => {
      localStorage.removeItem("accessToken");
    },
  },
}));

export const useAuthStore = useStore;
