import { create } from "zustand";
import { Theme } from "./enums";

type State = {
    theme: Theme
};

type Store = {
    value: State;
    actions: {
        setThemeMode: (theme: Theme) => void;
        clearStore: () => void;
    };
};

const defaultState: State = {
    theme: Theme.LIGHT
};

const useStore = create<Store>((set) => ({
    value: defaultState,
    actions: {
        setThemeMode: (theme) => {
            set(() => ({
                value: {
                    theme
                }
            }));
        },
        clearStore() {
            set(() => ({
                value: defaultState,
            }));
        },
    },
}));

export const useGlobalStore = useStore;