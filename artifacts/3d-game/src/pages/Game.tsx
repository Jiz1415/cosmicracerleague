import React, { useEffect, useState } from 'react';
import { useGameState } from '../game/useGameState';
import { Canvas } from '@react-three/fiber';
import { Stars, KeyboardControls } from '@react-three/drei';
import { Track } from '../game/Track';
import { Car } from '../game/Car';
import { HUD } from '../game/HUD';
import { SpeedBoost } from '../game/SpeedBoost';

export default function Game() {
  const { startTime, setTimeMs, state, finishGame } = useGameState();

  useEffect(() => {
    let animationFrameId: number;

    const updateTimer = () => {
      if (state === 'RACING' && startTime) {
        setTimeMs(Date.now() - startTime);
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (state === 'RACING') {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [state, startTime, setTimeMs]);

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'back', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  ];

  if (state !== 'RACING') return null;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <KeyboardControls map={keyboardMap}>
        <Canvas>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 20, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Track />
          <Car />
          
          <SpeedBoost position={[100, 0, 100]} rotation={[0, Math.PI / 4, 0]} />
          <SpeedBoost position={[-100, 0, -100]} rotation={[0, -Math.PI / 4, 0]} />
          <SpeedBoost position={[0, 0, -100]} rotation={[0, Math.PI / 2, 0]} />
        </Canvas>
      </KeyboardControls>
      
      <HUD />
    </div>
  );
}
