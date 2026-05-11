import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Coin({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 2;
    groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.2;
    if (matRef.current) {
      matRef.current.emissiveIntensity = 1.5 + Math.sin(t * 5) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.25, 16]} />
        <meshStandardMaterial ref={matRef} color="#ffd700" emissive="#ffaa00" emissiveIntensity={1.5} roughness={0.2} metalness={0.9} />
      </mesh>
      <pointLight color="#ffd700" intensity={1.5} distance={8} />
    </group>
  );
}