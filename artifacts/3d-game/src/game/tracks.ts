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
  rareBoostPads?: [number, number, number][];
  legendaryBoostPad?: [number, number, number];
  chestSpots?: [number, number, number][];
  coinSpots?: [number, number, number][];
  startPos: [number, number, number];
  startYaw: number;
  flavor: string;
}

export function onTrackPositions(
  trackPoints: [number, number, number][],
  params: Array<{ t: number; side?: number }>
): [number, number, number][] {
  const pts = trackPoints.map(p => new THREE.Vector3(p[0], 0, p[2]));
  const curve = new THREE.CatmullRomCurve3(pts, true);
  return params.map(({ t, side = 0 }) => {
    const pos = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    // Perpendicular in XZ plane
    const perp = new THREE.Vector3(-tan.z, 0, tan.x);
    const offset = side * 8; // max 8 units from center (well inside TRACK_HALF_WIDTH=12)
    return [
      pos.x + perp.x * offset,
      1,
      pos.z + perp.z * offset,
    ] as [number, number, number];
  });
}

const neonPoints: [number, number, number][] = [
  [0, 0, 100], [100, 0, 100], [150, 0, 50], [150, 0, -50], [100, 0, -100],
  [-100, 0, -100], [-150, 0, -50], [-150, 0, 50], [-100, 0, 100], [0, 0, 100],
];
const volcanicPoints: [number, number, number][] = [
  [0, 0, 120], [120, 0, 120], [180, 0, 80], [150, 0, 0], [180, 0, -80],
  [120, 0, -120], [0, 0, -120], [-50, 0, -50], [-120, 0, -120], [-180, 0, -80],
  [-150, 0, 0], [-180, 0, 80], [-120, 0, 120], [0, 0, 120]
];
const crystalPoints: [number, number, number][] = [
  [0, 0, 150], [80, 0, 150], [150, 0, 200], [200, 0, 100], [100, 0, 50],
  [200, 0, 0], [150, 0, -100], [200, 0, -200], [80, 0, -150], [0, 0, -100],
  [-80, 0, -150], [-200, 0, -200], [-150, 0, -100], [-200, 0, 0], [-100, 0, 50],
  [-200, 0, 100], [-150, 0, 200], [-80, 0, 150], [0, 0, 150]
];
const solarPoints: [number, number, number][] = [
  [0,0,160],[100,0,160],[180,0,100],[200,0,0],[180,0,-100],[100,0,-160],
  [0,0,-160],[-100,0,-160],[-180,0,-100],[-200,0,0],[-180,0,100],[-100,0,160],[0,0,160]
];
const voidPoints: [number, number, number][] = [
  [0,0,180],[80,0,160],[140,0,100],[160,0,20],[120,0,-60],[60,0,-120],
  [0,0,-140],[-80,0,-120],[-140,0,-60],[-160,0,20],[-120,0,100],[-60,0,160],[0,0,180]
];

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
    points: neonPoints,
    boostPads: onTrackPositions(neonPoints, [{t:0.15,side:0},{t:0.55,side:0},{t:0.8,side:0}]),
    rareBoostPads: onTrackPositions(neonPoints, [{t:0.35,side:0.5}]),
    legendaryBoostPad: onTrackPositions(neonPoints, [{t:0.72,side:-0.5}])[0],
    chestSpots: onTrackPositions(neonPoints, [{t:0.1,side:0.6},{t:0.4,side:-0.6},{t:0.65,side:0.4},{t:0.9,side:-0.4}]),
    coinSpots: onTrackPositions(neonPoints, [{t:0.05,side:0},{t:0.18,side:0.5},{t:0.28,side:-0.5},{t:0.45,side:0.3},{t:0.58,side:-0.3},{t:0.7,side:0.5},{t:0.83,side:-0.5},{t:0.95,side:0}]),
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
    points: volcanicPoints,
    boostPads: onTrackPositions(volcanicPoints, [{t:0.1,side:0},{t:0.4,side:0},{t:0.6,side:0},{t:0.85,side:0}]),
    rareBoostPads: onTrackPositions(volcanicPoints, [{t:0.25,side:0.5}]),
    legendaryBoostPad: onTrackPositions(volcanicPoints, [{t:0.7,side:-0.5}])[0],
    chestSpots: onTrackPositions(volcanicPoints, [{t:0.15,side:0.6},{t:0.45,side:-0.6},{t:0.75,side:0.5},{t:0.9,side:-0.4}]),
    coinSpots: onTrackPositions(volcanicPoints, [{t:0.05,side:0},{t:0.15,side:0.5},{t:0.25,side:-0.4},{t:0.35,side:0.3},{t:0.5,side:-0.5},{t:0.62,side:0.4},{t:0.73,side:-0.3},{t:0.82,side:0.5},{t:0.92,side:-0.4},{t:0.97,side:0}]),
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
    points: crystalPoints,
    boostPads: onTrackPositions(crystalPoints, [{t:0.12,side:0},{t:0.35,side:0},{t:0.55,side:0},{t:0.75,side:0},{t:0.9,side:0}]),
    rareBoostPads: onTrackPositions(crystalPoints, [{t:0.22,side:0.5}]),
    legendaryBoostPad: onTrackPositions(crystalPoints, [{t:0.65,side:-0.5}])[0],
    chestSpots: onTrackPositions(crystalPoints, [{t:0.18,side:0.6},{t:0.42,side:-0.6},{t:0.68,side:0.5},{t:0.85,side:-0.4},{t:0.95,side:0.3}]),
    coinSpots: onTrackPositions(crystalPoints, [{t:0.04,side:0},{t:0.13,side:0.5},{t:0.22,side:-0.4},{t:0.31,side:0.3},{t:0.4,side:-0.5},{t:0.5,side:0.4},{t:0.59,side:-0.3},{t:0.68,side:0.5},{t:0.76,side:-0.4},{t:0.85,side:0.3},{t:0.92,side:-0.5},{t:0.98,side:0}]),
    startPos: [0, 1, 150],
    startYaw: Math.PI / 2,
    flavor: 'Complex flowing paths with tight corners in the deep.',
  },
  {
    id: 'solar-storm',
    name: 'Solar Storm',
    difficulty: 'MEDIUM',
    laps: 3,
    primaryColor: '#00ff88',
    secondaryColor: '#ffff00',
    fogColor: '#001a0a',
    ambientColor: '#001a0a',
    points: solarPoints,
    boostPads: onTrackPositions(solarPoints, [{t:0.1,side:0},{t:0.35,side:0},{t:0.6,side:0},{t:0.85,side:0}]),
    rareBoostPads: onTrackPositions(solarPoints, [{t:0.22,side:0.5}]),
    legendaryBoostPad: onTrackPositions(solarPoints, [{t:0.72,side:-0.5}])[0],
    chestSpots: onTrackPositions(solarPoints, [{t:0.15,side:0.6},{t:0.45,side:-0.6},{t:0.75,side:0.6},{t:0.92,side:-0.6}]),
    coinSpots: onTrackPositions(solarPoints, [{t:0.03,side:0},{t:0.12,side:0.5},{t:0.22,side:-0.5},{t:0.32,side:0.5},{t:0.42,side:-0.5},{t:0.52,side:0.5},{t:0.62,side:-0.5},{t:0.72,side:0.5},{t:0.82,side:-0.5},{t:0.94,side:0.5}]),
    startPos: [0, 1, 160],
    startYaw: Math.PI / 2,
    flavor: 'A blazing oval with sweeping S-bends. Built for pure speed.',
  },
  {
    id: 'void-serpent',
    name: 'Void Serpent',
    difficulty: 'HARD',
    laps: 4,
    primaryColor: '#4488ff',
    secondaryColor: '#ff4488',
    fogColor: '#000810',
    ambientColor: '#000820',
    points: voidPoints,
    boostPads: onTrackPositions(voidPoints, [{t:0.1,side:0},{t:0.3,side:0},{t:0.55,side:0},{t:0.75,side:0},{t:0.9,side:0}]),
    rareBoostPads: onTrackPositions(voidPoints, [{t:0.2,side:0.5},{t:0.7,side:-0.5}]),
    legendaryBoostPad: onTrackPositions(voidPoints, [{t:0.5,side:0}])[0],
    chestSpots: onTrackPositions(voidPoints, [{t:0.15,side:0.5},{t:0.4,side:-0.5},{t:0.65,side:0.5},{t:0.88,side:-0.5}]),
    coinSpots: onTrackPositions(voidPoints, [{t:0.05,side:0.5},{t:0.12,side:-0.5},{t:0.18,side:0.5},{t:0.25,side:-0.5},{t:0.35,side:0.5},{t:0.45,side:-0.5},{t:0.6,side:0.5},{t:0.68,side:-0.5},{t:0.78,side:0.5},{t:0.85,side:-0.5},{t:0.92,side:0.5},{t:0.98,side:-0.5}]),
    startPos: [0, 1, 180],
    startYaw: Math.PI / 2,
    flavor: 'A tight serpentine nightmare. Only the best survive the deep.',
  }
];
