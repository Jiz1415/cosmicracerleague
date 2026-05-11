import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGameState } from './useGameState';

const TRACK_Y = 1;
const MAX_SPEED = 40;
const ACCEL = 28;
const BRAKE_FORCE = 22;
const DRAG = 9;
const REVERSE_MAX = 14;
const TURN_SPEED = 2.0;
const BOOST_MULT = 1.6;
const BOOST_DURATION = 1.5;

const BOOST_PAD_POSITIONS: THREE.Vector3[] = [
  new THREE.Vector3(100, 0, 100),
  new THREE.Vector3(-100, 0, -100),
  new THREE.Vector3(0, 0, -100),
];
const BOOST_RADIUS = 9;

export function Car() {
  const groupRef = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls();

  const velocity = useRef(0);
  const carYaw = useRef(Math.PI / 2);
  const carPos = useRef(new THREE.Vector3(0, TRACK_Y, 100));
  const boostEndTime = useRef(0);
  const lapCooldown = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { forward, back, left, right } = get();
    const {
      setSpeed,
      lap,
      setLap,
      maxLaps,
      finishGame,
      boostActive,
      setBoostActive,
    } = useGameState.getState();

    const clampedDelta = Math.min(delta, 0.05);

    const effectiveMax = boostActive ? MAX_SPEED * BOOST_MULT : MAX_SPEED;

    if (forward) {
      velocity.current = Math.min(velocity.current + ACCEL * clampedDelta, effectiveMax);
    } else if (back) {
      if (velocity.current > 0) {
        velocity.current = Math.max(0, velocity.current - BRAKE_FORCE * clampedDelta);
      } else {
        velocity.current = Math.max(-REVERSE_MAX, velocity.current - ACCEL * 0.5 * clampedDelta);
      }
    } else {
      if (velocity.current > 0) {
        velocity.current = Math.max(0, velocity.current - DRAG * clampedDelta);
      } else if (velocity.current < 0) {
        velocity.current = Math.min(0, velocity.current + DRAG * clampedDelta);
      }
    }

    if (boostActive && state.clock.getElapsedTime() > boostEndTime.current) {
      setBoostActive(false);
    }

    setSpeed(Math.abs(velocity.current));

    const speedRatio = Math.abs(velocity.current) / MAX_SPEED;
    const steerDir = velocity.current >= 0 ? 1 : -1;
    if (left)  carYaw.current += TURN_SPEED * speedRatio * clampedDelta * steerDir;
    if (right) carYaw.current -= TURN_SPEED * speedRatio * clampedDelta * steerDir;

    carPos.current.x += Math.sin(carYaw.current) * velocity.current * clampedDelta;
    carPos.current.z += Math.cos(carYaw.current) * velocity.current * clampedDelta;
    carPos.current.y = TRACK_Y;

    groupRef.current.position.copy(carPos.current);
    groupRef.current.rotation.set(0, carYaw.current, 0);

    for (const pad of BOOST_PAD_POSITIONS) {
      const dist = carPos.current.distanceTo(new THREE.Vector3(pad.x, TRACK_Y, pad.z));
      if (dist < BOOST_RADIUS && !boostActive) {
        setBoostActive(true);
        boostEndTime.current = state.clock.getElapsedTime() + BOOST_DURATION;
        break;
      }
    }

    const nearFinish =
      carPos.current.distanceTo(new THREE.Vector3(0, TRACK_Y, 100)) < 14 &&
      velocity.current > 2;

    if (nearFinish && !lapCooldown.current) {
      lapCooldown.current = true;
      const nextLap = lap + 1;
      if (nextLap > maxLaps) {
        finishGame();
      } else {
        setLap(nextLap);
      }
      setTimeout(() => { lapCooldown.current = false; }, 4000);
    }

    const behind = new THREE.Vector3(
      -Math.sin(carYaw.current) * 14,
      6,
      -Math.cos(carYaw.current) * 14
    );
    const idealCamPos = carPos.current.clone().add(behind);
    const lookAhead = carPos.current.clone().add(
      new THREE.Vector3(Math.sin(carYaw.current) * 10, 0, Math.cos(carYaw.current) * 10)
    );

    state.camera.position.lerp(idealCamPos, 0.08);
    state.camera.lookAt(lookAhead);
  });

  const boost = useGameState(s => s.boostActive);

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[3, 1, 6]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#0f0f1a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[3.2, 0.2, 6.2]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0, -3.1]}>
        <boxGeometry args={[2, 0.8, 0.5]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={boost ? 5 : 2}
        />
      </mesh>
    </group>
  );
}
