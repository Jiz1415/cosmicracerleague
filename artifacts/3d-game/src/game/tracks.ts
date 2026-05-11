import * as THREE from 'three';

export interface TrackDef {
  id: string;
  name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  laps: number;
  primaryColor: string;
  secondaryColor: string;
  fogColor: string;
  ambientColor: string;
  points: [number, number, number][];
  boostPads: [number, number, number][];
  startPos: [number, number, number];
  startYaw: number;
  flavor: string;
}

export const TRACKS: TrackDef[] = [
  {
    id: 'neon-circuit',
    name: 'Neon Circuit',
    difficulty: 'EASY',
    laps: 3,
    primaryColor: '#00ffff',
    secondaryColor: '#ff00ff',
    fogColor: '#050510',
    ambientColor: '#001a1a',
    points: [
      [0, 0, 100],
      [100, 0, 100],
      [150, 0, 50],
      [150, 0, -50],
      [100, 0, -100],
      [-100, 0, -100],
      [-150, 0, -50],
      [-150, 0, 50],
      [-100, 0, 100],
      [0, 0, 100],
    ],
    boostPads: [
      [100, 0, 100],
      [-100, 0, -100],
      [0, 0, -100],
    ],
    startPos: [0, 1, 100],
    startYaw: Math.PI / 2,
    flavor: 'A balanced track with wide turns. Perfect for beginners.',
  },
  {
    id: 'volcanic-rift',
    name: 'Volcanic Rift',
    difficulty: 'MEDIUM',
    laps: 3,
    primaryColor: '#ff4400',
    secondaryColor: '#ffaa00',
    fogColor: '#100505',
    ambientColor: '#1a0800',
    points: [
      [0, 0, 120],
      [120, 0, 120],
      [180, 0, 80],
      [150, 0, 0],
      [180, 0, -80],
      [120, 0, -120],
      [0, 0, -120],
      [-50, 0, -50],
      [-120, 0, -120],
      [-180, 0, -80],
      [-150, 0, 0],
      [-180, 0, 80],
      [-120, 0, 120],
      [0, 0, 120]
    ],
    boostPads: [
      [120, 0, 120],
      [-120, 0, -120],
      [150, 0, 0],
      [-150, 0, 0]
    ],
    startPos: [0, 1, 120],
    startYaw: Math.PI / 2,
    flavor: 'A twisting, fiery circuit with interior chicanes.',
  },
  {
    id: 'crystal-abyss',
    name: 'Crystal Abyss',
    difficulty: 'HARD',
    laps: 4,
    primaryColor: '#aa00ff',
    secondaryColor: '#ff00aa',
    fogColor: '#080010',
    ambientColor: '#0d001a',
    points: [
      [0, 0, 150],
      [80, 0, 150],
      [150, 0, 200],
      [200, 0, 100],
      [100, 0, 50],
      [200, 0, 0],
      [150, 0, -100],
      [200, 0, -200],
      [80, 0, -150],
      [0, 0, -100],
      [-80, 0, -150],
      [-200, 0, -200],
      [-150, 0, -100],
      [-200, 0, 0],
      [-100, 0, 50],
      [-200, 0, 100],
      [-150, 0, 200],
      [-80, 0, 150],
      [0, 0, 150]
    ],
    boostPads: [
      [100, 0, 50],
      [-100, 0, 50],
      [150, 0, -100],
      [-150, 0, -100],
      [0, 0, -100]
    ],
    startPos: [0, 1, 150],
    startYaw: Math.PI / 2,
    flavor: 'Complex flowing paths with tight corners in the deep.',
  }
];