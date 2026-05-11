import { useMemo } from 'react';
import * as THREE from 'three';
import { makeTrackCurve, TRACK_TUBE_RADIUS } from './trackCurve';

export function Track() {
  const curve = useMemo(() => makeTrackCurve(), []);

  const roadGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, TRACK_TUBE_RADIUS - 3, 8, true);
  }, [curve]);

  const borderGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, TRACK_TUBE_RADIUS, 6, true);
  }, [curve]);

  return (
    <group>
      {/* Solid road surface */}
      <mesh geometry={roadGeometry}>
        <meshStandardMaterial
          color="#0d0d1a"
          emissive="#050510"
          roughness={0.8}
          metalness={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Neon border rail */}
      <mesh geometry={borderGeometry}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Finish line marker */}
      <mesh position={[0, 1, 100]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 2]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Track center-line dashes */}
      {Array.from({ length: 20 }).map((_, i) => {
        const t = i / 20;
        const pt = curve.getPointAt(t);
        const tan = curve.getTangentAt(t);
        const angle = Math.atan2(tan.x, tan.z);
        return (
          <mesh
            key={i}
            position={[pt.x, 0.15, pt.z]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[1, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
