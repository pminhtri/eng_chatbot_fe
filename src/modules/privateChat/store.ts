import { create } from "zustand";

type State = {
  pageCount: number;
  isSideBarOpen: boolean;
};
type Action = {
  increasePageCount: (totalPages: number) => void;
  resetPageCount: () => void;
  handleToggleDrawer: () => void;
};

type Store = {
  value: State;
  actions: Action;
};

const initialStateValue: State = { pageCount: 1, isSideBarOpen: true };

const useStore = create<Store>((set) => ({
  value: initialStateValue,
  actions: {
    increasePageCount: (totalPages) => {
      const limitedPageCount = (pageCount: number) =>
        Math.max(1, Math.min(++pageCount, totalPages));

      set((state) => ({
        value: {
          ...state.value,
          pageCount: limitedPageCount(state.value.pageCount),
        },
      }));
    },
    resetPageCount: () =>
      set((state) => ({
        value: { ...state.value, pageCount: initialStateValue.pageCount },
      })),
    handleToggleDrawer: () =>
      set((state) => ({
        value: { ...state.value, isSideBarOpen: !state.value.isSideBarOpen },
      })),
  },
}));

export const usePrivateChatStore = useStore;
