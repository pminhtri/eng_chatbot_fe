import { create } from "zustand";
import { Theme } from "./enums";
import { UserDetails } from "./types";
import { fetchCurrentUser } from "./api";

type StateValue = {
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
  value: StateValue;
  actions: Actions;
};

const initialStateValue: StateValue = {
  theme: Theme.SYSTEM,
  currentUser: null,
};

const useStore = create<Store>((set) => ({
  value: initialStateValue,
  actions: {
    setTheme: (theme) => set((state) => ({ ...state, theme })),
    setCurrentUser: (user) =>
      set(({ value }) => ({
        value: {
          ...value,
          currentUser: user,
        },
      })),
    fetchCurrentUser: async () => {
      const user = await fetchCurrentUser();

      set(({ value }) => ({
        value: {
          ...value,
          currentUser: user,
        },
      }));
    },
    clearUser: () =>
      set(({ value }) => ({
        value: {
          ...value,
          currentUser: null,
        },
      })),
  },
}));

export const useGlobalStore = useStore;
