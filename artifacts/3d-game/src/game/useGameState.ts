import { create } from 'zustand';

interface GameState {
  state: 'MENU' | 'RACING' | 'FINISHED';
  lap: number;
  maxLaps: number;
  speed: number;
  timeMs: number;
  boostActive: boolean;
  startTime: number | null;
  endTime: number | null;
  setState: (state: 'MENU' | 'RACING' | 'FINISHED') => void;
  setLap: (lap: number) => void;
  setSpeed: (speed: number) => void;
  setTimeMs: (time: number) => void;
  setBoostActive: (active: boolean) => void;
  startGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>((set) => ({
  state: 'MENU',
  lap: 1,
  maxLaps: 3,
  speed: 0,
  timeMs: 0,
  boostActive: false,
  startTime: null,
  endTime: null,
  setState: (state) => set({ state }),
  setLap: (lap) => set({ lap }),
  setSpeed: (speed) => set({ speed }),
  setTimeMs: (timeMs) => set({ timeMs }),
  setBoostActive: (boostActive) => set({ boostActive }),
  startGame: () => set({ state: 'RACING', lap: 1, speed: 0, timeMs: 0, startTime: Date.now(), endTime: null, boostActive: false }),
  finishGame: () => set((state) => ({ state: 'FINISHED', endTime: Date.now() })),
  resetGame: () => set({ state: 'MENU', lap: 1, speed: 0, timeMs: 0, startTime: null, endTime: null, boostActive: false }),
}));
