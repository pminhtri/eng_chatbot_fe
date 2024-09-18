import { create } from "zustand";
import { Theme } from "./enums";
import { UserDetails } from "./types";
import { fetchCurrentUser } from "./api";

type State = {
  theme: Theme;
  currentUser: UserDetails | null;
};

type Actions = {
  setTheme: (theme: Theme) => void;
  setCurrentUser: (user: UserDetails) => void;
  fetchCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

type Store = {
  state: State;
  actions: Actions;
};

const defaultState: State = {
  theme: Theme.SYSTEM,
  currentUser: null,
};

const useStore = create<Store>((set) => ({
  state: defaultState,
  actions: {
    setTheme: (theme) => set((state) => ({ ...state, theme })),
    setCurrentUser: (user) =>
      set((state) => ({
        ...state,
        currentUser: user,
      })),
    fetchCurrentUser: async () => {
      const user = await fetchCurrentUser();

      set((state) => ({ ...state, currentUser: user }));
    },
    clearUser: () =>
      set((state) => ({
        ...state,
        currentUser: null,
      })),
  },
}));

export const useGlobalStore = useStore;
