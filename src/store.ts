import { create } from "zustand";

import { Theme } from "./enums";
import { Conversation, UserDetails } from "./types";
import { fetchCurrentUser, getConversations } from "./api";

type StateValue = {
  theme: Theme;
  currentUser: UserDetails | null;
  conversations: Conversation[];
};

type Action = {
  setTheme: (theme: Theme) => void;
  fetchCurrentUser: () => Promise<void>;
  fetchConversations: () => Promise<Conversation[]>;
  clearStore: () => void;
};

type Store = {
  value: StateValue;
  actions: Action;
};

const initialStateValue: StateValue = {
  theme: Theme.SYSTEM,
  currentUser: null,
  conversations: [],
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
    fetchConversations: async () => {
      const conversations = await getConversations();

      set((state) => ({ value: { ...state.value, conversations } }));

      return conversations;
    },
    clearStore: () => set({ value: initialStateValue }),
  },
}));

export const useGlobalStore = useStore;
