import { useMemo } from 'react';
import * as THREE from 'three';
import { makeTrackCurve, TRACK_HALF_WIDTH } from './trackCurve';

const SEGMENTS = 150;
const WALL_RADIUS = 1.2;

export function Track() {
  const curve = useMemo(() => makeTrackCurve(), []);

  // Flat road ribbon — custom BufferGeometry sampled along the curve
  const roadGeometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t).normalize();
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      positions.push(
        pt.x - right.x * TRACK_HALF_WIDTH, 0.05, pt.z - right.z * TRACK_HALF_WIDTH,
        pt.x + right.x * TRACK_HALF_WIDTH, 0.05, pt.z + right.z * TRACK_HALF_WIDTH,
      );
      uvs.push(0, t * 20, 1, t * 20);
    }

    for (let i = 0; i < SEGMENTS; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      indices.push(a, c, b, b, c, d);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve]);

  // Left-edge barrier curve
  const leftEdgeCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t).normalize();
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      pts.push(new THREE.Vector3(
        pt.x - right.x * TRACK_HALF_WIDTH,
        1.2,
        pt.z - right.z * TRACK_HALF_WIDTH,
      ));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, [curve]);

  // Right-edge barrier curve
  const rightEdgeCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t).normalize();
      const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      pts.push(new THREE.Vector3(
        pt.x + right.x * TRACK_HALF_WIDTH,
        1.2,
        pt.z + right.z * TRACK_HALF_WIDTH,
      ));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, [curve]);

  // Center-line dashes (pre-calculated positions)
  const dashData = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => {
      const t = i / 24;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      return { x: pt.x, z: pt.z, angle: Math.atan2(tan.x, tan.z) };
    }),
  [curve]);

  return (
    <group>
      {/* Road surface */}
      <mesh geometry={roadGeometry}>
        <meshStandardMaterial
          color="#0c0c1e"
          emissive="#08081a"
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left barrier wall */}
      <mesh>
        <tubeGeometry args={[leftEdgeCurve, 200, WALL_RADIUS, 6, true]} />
        <meshStandardMaterial
          color="#00cfcf"
          emissive="#00ffff"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Right barrier wall */}
      <mesh>
        <tubeGeometry args={[rightEdgeCurve, 200, WALL_RADIUS, 6, true]} />
        <meshStandardMaterial
          color="#00cfcf"
          emissive="#00ffff"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Finish line */}
      <mesh position={[0, 0.1, 100]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[24, 3]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center-line dashes */}
      {dashData.map((d, i) => (
        <mesh key={i} position={[d.x, 0.12, d.z]} rotation={[Math.PI / 2, 0, d.angle]}>
          <planeGeometry args={[1, 5]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
