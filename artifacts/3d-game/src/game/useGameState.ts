import { create } from 'zustand';
import { TRACKS } from './tracks';

interface GameState {
  state: 'MENU' | 'RACING' | 'FINISHED';
  selectedTrackId: string;
  lapFlash: boolean;
  lap: number;
  maxLaps: number;
  speed: number;
  timeMs: number;
  boostActive: boolean;
  startTime: number | null;
  endTime: number | null;
  setState: (state: 'MENU' | 'RACING' | 'FINISHED') => void;
  setSelectedTrackId: (id: string) => void;
  setLapFlash: (lapFlash: boolean) => void;
  setLap: (lap: number) => void;
  setSpeed: (speed: number) => void;
  setTimeMs: (time: number) => void;
  setBoostActive: (active: boolean) => void;
  startGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  state: 'MENU',
  selectedTrackId: 'neon-circuit',
  lapFlash: false,
  lap: 1,
  maxLaps: 3,
  speed: 0,
  timeMs: 0,
  boostActive: false,
  startTime: null,
  endTime: null,
  setState: (state) => set({ state }),
  setSelectedTrackId: (id) => set({ selectedTrackId: id }),
  setLapFlash: (lapFlash) => set({ lapFlash }),
  setLap: (lap) => set({ lap }),
  setSpeed: (speed) => set({ speed }),
  setTimeMs: (timeMs) => set({ timeMs }),
  setBoostActive: (boostActive) => set({ boostActive }),
  startGame: () => {
    const track = TRACKS.find(t => t.id === get().selectedTrackId) || TRACKS[0];
    set({ state: 'RACING', lap: 1, maxLaps: track.laps, speed: 0, timeMs: 0, startTime: Date.now(), endTime: null, boostActive: false, lapFlash: false });
  },
  finishGame: () => set((state) => ({ state: 'FINISHED', endTime: Date.now() })),
  resetGame: () => set({ state: 'MENU', lap: 1, speed: 0, timeMs: 0, startTime: null, endTime: null, boostActive: false, lapFlash: false }),
}));
