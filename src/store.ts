import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

import { Theme } from "./enums";
import { UserDetails } from "./types";
import { fetchCurrentUser } from "./api";

type StateValue = {
  theme: Theme;
  currentUser: UserDetails | null;
};

type Actions = {
  setTheme: (theme: Theme) => void;
  fetchCurrentUser: () => Promise<void>;
  clearStore: () => void;
};

type Store = {
  value: StateValue;
  actions: Actions;
};

const initialStateValue: StateValue = {
  theme: Theme.SYSTEM,
  currentUser: null,
};

const useStore = create(
  persist<Store>(
    (set, get) => ({
      value: initialStateValue,
      actions: {
        setTheme: (theme) => set({ value: { ...get().value, theme } }),
        fetchCurrentUser: async () => {
          const currentUser = await fetchCurrentUser();

          set({ value: { ...get().value, currentUser } });
        },
        clearStore: () => { set({ value: initialStateValue }) },
      },
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await get(name);

          return value;
        },
        setItem: async (name: string, value: any) => {
          await set(name, value);
        },
        removeItem: async (name: string) => {
          await del(name);
        }
      })),
    }
  )
);

export const useGlobalStore = useStore;
