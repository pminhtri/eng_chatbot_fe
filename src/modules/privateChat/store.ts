import { create } from "zustand";
import { fetchChatsByConversation, getConversations } from "../../api";
import { Conversation, PrivateChat } from "../../types";
import { uniqBy } from "lodash";

export type AppMessage = {
  content: string;
  isBot: boolean;
};

type State = {
  messages: AppMessage[];
  conversations: Conversation[];
  pageCount: number;
  totalPage: number;
  isSideBarOpen: boolean;
};

type Action = {
  increasePageCount: (totalPages: number) => void;
  resetPageCount: () => void;
  handleToggleDrawer: () => void;
  fetchMessages: (conversationId: string) => Promise<PrivateChat[]>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  fetchConversations: () => Promise<Conversation[]>;
  appendMessages: (messages: AppMessage[]) => void;
};

type Store = {
  value: State;
  actions: Action;
};

const initialStateValue: State = {
  messages: [],
  conversations: [],
  pageCount: 1,
  totalPage: 1,
  isSideBarOpen: true,
};

const useStore = create<Store>((set, get) => ({
  value: initialStateValue,
  actions: {
    increasePageCount: (totalPages) => {
      set((state) => ({
        value: {
          ...state.value,
          pageCount: Math.min(state.value.pageCount + 1, totalPages),
        },
      }));
    },
    resetPageCount: () =>
      set(() => ({
        value: { ...initialStateValue, pageCount: 1 },
      })),
    handleToggleDrawer: () =>
      set((state) => ({
        value: { ...state.value, isSideBarOpen: !state.value.isSideBarOpen },
      })),
    appendMessages: (newMessages: AppMessage[]) => {
      set((state) => ({
        value: {
          ...state.value,
          messages: uniqBy(
            [...state.value.messages, ...newMessages],
            "content",
          ),
        },
      }));
    },
    fetchMessages: async (conversationId: string) => {
      const { docs, totalPages } = await fetchChatsByConversation(
        1,
        conversationId,
      );

      const newMessages = docs
        .map((data: PrivateChat) => [
          { content: data.message, isBot: false },
          { content: data.response, isBot: true },
        ])
        .flat();

      set((state) => ({
        value: {
          ...state.value,
          messages: newMessages,
          totalPage: totalPages,
        },
      }));

      return docs;
    },
    fetchConversations: async () => {
      const conversations = await getConversations();

      set((state) => ({
        value: { ...state.value, conversations },
      }));

      return conversations;
    },
    loadMoreMessages: async (conversationId) => {
      const { pageCount, totalPage } = get().value;

      if (pageCount < totalPage) {
        const { docs } = await fetchChatsByConversation(
          pageCount + 1,
          conversationId,
        );

        const moreMessages = docs
          .map((data: PrivateChat) => [
            { content: data.message, isBot: false },
            { content: data.response, isBot: true },
          ])
          .flat();

        set((state) => ({
          value: {
            ...state.value,
            messages: uniqBy(
              [...moreMessages, ...state.value.messages],
              "content",
            ),
          },
        }));

        get().actions.increasePageCount(totalPage);
      }
    },
  },
}));

export const usePrivateChatStore = useStore;
