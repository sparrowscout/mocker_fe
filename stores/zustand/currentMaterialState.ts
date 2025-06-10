import { create } from 'zustand';

interface CurrentMaterial {
  material: string;
  setMaterial: (newValue: string) => void;
}

const useCurrentMaterialStore = create<CurrentMaterial>((set) => ({
  material: '',
  setMaterial: (newValue) => set({ material: newValue }),
}));

export default useCurrentMaterialStore;
