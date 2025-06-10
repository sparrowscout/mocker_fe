import { create } from 'zustand';

interface CurrentModel {
  model: string;
  setModel: (newValue: string) => void;
}

const useCurrentModelStore = create<CurrentModel>((set) => ({
  model: '',
  setModel: (newValue) => set({ model: newValue }),
}));

export default useCurrentModelStore;
