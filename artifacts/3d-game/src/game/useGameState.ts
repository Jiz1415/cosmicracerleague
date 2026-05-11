import { create } from 'zustand';
import { TRACKS } from './tracks';

interface GameState {
  state: 'MENU' | 'RACING' | 'FINISHED' | 'GARAGE';
  selectedTrackId: string;
  lapFlash: boolean;
  lap: number;
  maxLaps: number;
  speed: number;
  timeMs: number;
  boostActive: boolean;
  activeBoostTier: 'common' | 'rare' | 'legendary' | null;
  activeChests: string[];
  chestNotification: string | null;
  startTime: number | null;
  endTime: number | null;
  credits: number;
  ownedCars: string[];
  selectedCarId: string;
  creditsEarned: number;
  setState: (state: 'MENU' | 'RACING' | 'FINISHED' | 'GARAGE') => void;
  setSelectedTrackId: (id: string) => void;
  setLapFlash: (lapFlash: boolean) => void;
  setLap: (lap: number) => void;
  setSpeed: (speed: number) => void;
  setTimeMs: (time: number) => void;
  setBoostActive: (active: boolean) => void;
  setActiveBoostTier: (tier: 'common' | 'rare' | 'legendary' | null) => void;
  setActiveChests: (ids: string[]) => void;
  collectChest: (id: string) => void;
  setChestNotification: (msg: string | null) => void;
  startGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
  setSelectedCarId: (id: string) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  unlockCar: (carId: string) => void;
  setCreditsEarned: (n: number) => void;
}

let initCredits = 0;
let initOwnedCars = ['phantom-x1'];
let initSelectedCarId = 'phantom-x1';

try {
  initCredits = Number(localStorage.getItem('neon-credits')) || 0;
  const owned = localStorage.getItem('neon-owned');
  if (owned) initOwnedCars = JSON.parse(owned);
  const selected = localStorage.getItem('neon-selected-car');
  if (selected) initSelectedCarId = selected;
} catch (e) {
  console.warn('localStorage error', e);
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
  activeBoostTier: null,
  activeChests: [],
  chestNotification: null,
  startTime: null,
  endTime: null,
  credits: initCredits,
  ownedCars: initOwnedCars,
  selectedCarId: initSelectedCarId,
  creditsEarned: 0,
  setState: (state) => set({ state }),
  setSelectedTrackId: (id) => set({ selectedTrackId: id }),
  setLapFlash: (lapFlash) => set({ lapFlash }),
  setLap: (lap) => set((state) => {
    const isAlt = lap % 2 === 0;
    return { lap, activeChests: isAlt ? ["chest-1", "chest-3"] : ["chest-0", "chest-2"] };
  }),
  setSpeed: (speed) => set({ speed }),
  setTimeMs: (timeMs) => set({ timeMs }),
  setBoostActive: (boostActive) => set({ boostActive }),
  setActiveBoostTier: (tier) => set({ activeBoostTier: tier }),
  setActiveChests: (ids) => set({ activeChests: ids }),
  setChestNotification: (msg) => set({ chestNotification: msg }),
  collectChest: (id) => set(state => {
    const nextChests = state.activeChests.filter(c => c !== id);
    const mod = Date.now() % 4;
    let rewardMsg = "";
    let nextCredits = state.credits;
    if (mod === 0) { rewardMsg = "+250 CR"; nextCredits += 250; }
    else if (mod === 1) { rewardMsg = "+500 CR"; nextCredits += 500; }
    else if (mod === 2) { rewardMsg = "+1000 CR"; nextCredits += 1000; }
    else { rewardMsg = "+750 CR"; nextCredits += 750; }

    try { localStorage.setItem('neon-credits', String(nextCredits)); } catch (e) {}

    setTimeout(() => {
      useGameState.getState().setChestNotification(null);
    }, 2500);

    return { activeChests: nextChests, chestNotification: rewardMsg, credits: nextCredits };
  }),
  startGame: () => {
    const track = TRACKS.find(t => t.id === get().selectedTrackId) || TRACKS[0];
    set({ state: 'RACING', lap: 1, maxLaps: track.laps, speed: 0, timeMs: 0, startTime: Date.now(), endTime: null, boostActive: false, activeBoostTier: null, lapFlash: false, activeChests: ["chest-0", "chest-2"] });
  },
  finishGame: () => set((state) => ({ state: 'FINISHED', endTime: Date.now() })),
  resetGame: () => set({ state: 'MENU', lap: 1, speed: 0, timeMs: 0, startTime: null, endTime: null, boostActive: false, lapFlash: false }),
  setSelectedCarId: (id: string) => {
    try { localStorage.setItem('neon-selected-car', id); } catch (e) {}
    set({ selectedCarId: id });
  },
  addCredits: (amount: number) => set(state => {
    const next = state.credits + amount;
    try { localStorage.setItem('neon-credits', String(next)); } catch (e) {}
    return { credits: next };
  }),
  spendCredits: (amount: number) => {
    const { credits } = get();
    if (credits < amount) return false;
    const next = credits - amount;
    try { localStorage.setItem('neon-credits', String(next)); } catch (e) {}
    set({ credits: next });
    return true;
  },
  unlockCar: (carId: string) => set(state => {
    if (state.ownedCars.includes(carId)) return state;
    const next = [...state.ownedCars, carId];
    try { localStorage.setItem('neon-owned', JSON.stringify(next)); } catch (e) {}
    return { ownedCars: next };
  }),
  setCreditsEarned: (n: number) => set({ creditsEarned: n }),
}));