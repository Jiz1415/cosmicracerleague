import React, { useMemo } from 'react';
import * as THREE from 'three';

export function Track() {
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 100),
      new THREE.Vector3(100, 0, 100),
      new THREE.Vector3(150, 0, 50),
      new THREE.Vector3(150, 0, -50),
      new THREE.Vector3(100, 0, -100),
      new THREE.Vector3(-100, 0, -100),
      new THREE.Vector3(-150, 0, -50),
      new THREE.Vector3(-150, 0, 50),
      new THREE.Vector3(-100, 0, 100),
      new THREE.Vector3(0, 0, 100),
    ];
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 100, 15, 8, true]} />
        <meshStandardMaterial 
          color="#111111" 
          emissive="#000000" 
          wireframe={true} 
          wireframeLinewidth={2}
        />
      </mesh>
      
      {/* Finish Line */}
      <mesh position={[0, -10, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff" 
          emissiveIntensity={2} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Edge lines */}
      <mesh>
        <tubeGeometry args={[curve, 100, 15.5, 3, true]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={1.5} 
          wireframe={true} 
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
