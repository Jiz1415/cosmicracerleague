import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGameState } from './useGameState';

export function Car() {
  const groupRef = useRef<THREE.Group>(null);
  const [subscribe, get] = useKeyboardControls();
  const { speed, setSpeed, lap, setLap, maxLaps, finishGame, boostActive, setBoostActive } = useGameState();
  
  const velocity = useRef(0);
  const maxSpeed = 40;
  const acceleration = 20;
  const deceleration = 15;
  const turnSpeed = 2;
  const boostMultiplier = 1.6;
  const boostDuration = 1.5;
  const boostEndTime = useRef(0);

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

  const progress = useRef(0);
  const lastProgress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { forward, back, left, right } = get();

    // Handle speed
    const currentMaxSpeed = boostActive ? maxSpeed * boostMultiplier : maxSpeed;
    
    if (forward) {
      velocity.current = THREE.MathUtils.lerp(velocity.current, currentMaxSpeed, acceleration * delta * 0.1);
    } else if (back) {
      velocity.current = THREE.MathUtils.lerp(velocity.current, -currentMaxSpeed * 0.5, deceleration * delta * 0.1);
    } else {
      velocity.current = THREE.MathUtils.lerp(velocity.current, 0, deceleration * delta * 0.1);
    }

    // Boost timer
    if (boostActive && state.clock.getElapsedTime() > boostEndTime.current) {
      setBoostActive(false);
    }

    setSpeed(Math.abs(velocity.current));

    // Calculate position on curve
    progress.current += (velocity.current * delta) / curve.getLength();
    
    // Lap detection
    if (progress.current >= 1) {
      progress.current -= 1;
      const newLap = lap + 1;
      if (newLap > maxLaps) {
        finishGame();
      } else {
        setLap(newLap);
      }
    } else if (progress.current < 0) {
      progress.current += 1;
    }
    
    lastProgress.current = progress.current;

    // Movement and turning (simplified: stays on track center, but you can turn model)
    const position = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current);
    
    let lateralOffset = 0;
    if (left) lateralOffset = 5;
    if (right) lateralOffset = -5;
    
    // Calculate normal for lateral movement
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    
    position.add(normal.multiplyScalar(lateralOffset));
    
    groupRef.current.position.copy(position);
    
    const targetRotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    groupRef.current.quaternion.slerp(targetRotation, 0.1);

    // Camera follow
    const idealCameraOffset = new THREE.Vector3(0, 5, -15);
    idealCameraOffset.applyQuaternion(groupRef.current.quaternion);
    idealCameraOffset.add(groupRef.current.position);

    const idealLookAt = new THREE.Vector3(0, 0, 20);
    idealLookAt.applyQuaternion(groupRef.current.quaternion);
    idealLookAt.add(groupRef.current.position);

    state.camera.position.lerp(idealCameraOffset, 0.1);
    state.camera.lookAt(idealLookAt);
  });

  return (
    <group ref={groupRef}>
      {/* Car Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 1, 6]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#0f0f1a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Neon Accents */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[3.2, 0.2, 6.2]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, 0, -3.1]}>
        <boxGeometry args={[2, 0.8, 0.5]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={boostActive ? 5 : 2} />
      </mesh>
    </group>
  );
}
