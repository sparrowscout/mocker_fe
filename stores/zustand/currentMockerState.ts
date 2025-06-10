import { create } from 'zustand';

type mockerState = 'IDLE' | 'EDIT_MESH';

interface CurrentState {
  mockerState: mockerState;
  setMockerState: (newValue: mockerState) => void;
}

const useCurrentMockerState = create<CurrentState>((set) => ({
  mockerState: 'IDLE',
  setMockerState: (newValue) => set({ mockerState: newValue }),
}));

export default useCurrentMockerState;
