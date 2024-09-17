import { create } from "zustand";
import { login } from "../../api";

type State = {};

type Actions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthStore = {
  state: State;
  actions: Actions;
};

const initialState: State = {};

const useStore = create<AuthStore>(() => ({
  state: initialState,
  actions: {
    login: async (email: string, password: string) =>
      await login({ email, password }),
    logout: () => {
      localStorage.removeItem("accessToken");
    },
  },
}));

export const useAuthStore = useStore;
