import { create } from "zustand";

interface CurrentState {
  value: string;
  setValue: (newValue: string) => void;
}

const useCurrentStateStore = create<CurrentState>((set) => ({
  value: "",
  setValue: (newValue) => set({ value: newValue }),
}));

export default useCurrentStateStore;
