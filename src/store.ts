import { create } from "zustand";

import { Theme } from "./enums";
import { UserDetails } from "./types";
import { fetchCurrentUser } from "./api";

type StateValue = {
  theme: Theme;
  currentUser: UserDetails | null;
};

type Action = {
  setTheme: (theme: Theme) => void;
  fetchCurrentUser: () => Promise<void>;
  clearStore: () => void;
};

type Store = {
  value: StateValue;
  actions: Action;
};

const initialStateValue: StateValue = {
  theme: Theme.SYSTEM,
  currentUser: null,
};

const useStore = create<Store>((set) => ({
  value: initialStateValue,
  actions: {
    setTheme: (theme: Theme) =>
      set((state) => ({ value: { ...state.value, theme } })),
    fetchCurrentUser: async () => {
      const currentUser = await fetchCurrentUser();

      set((state) => ({ value: { ...state.value, currentUser } }));
    },
    clearStore: () => set({ value: initialStateValue }),
  },
}));

export const useGlobalStore = useStore;
