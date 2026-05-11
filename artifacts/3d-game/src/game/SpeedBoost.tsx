import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SpeedBoostProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export function SpeedBoost({ position, rotation }: SpeedBoostProps) {
  const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 10) * 0.5;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[10, 0.2, 4]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={new THREE.Color('#00ffff')} 
        emissive={new THREE.Color('#00ffff')} 
        emissiveIntensity={2} 
        transparent 
        opacity={0.8} 
      />
    </mesh>
  );
}
