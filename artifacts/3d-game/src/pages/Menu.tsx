import React from 'react';
import { useGameState } from '../game/useGameState';
import { Leaderboard } from '../game/Leaderboard';

export default function Menu() {
  const { startGame, state } = useGameState();

  if (state !== 'MENU') return null;

  return (
    <div className="w-screen h-screen bg-[#050510] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #00ffff 0%, transparent 50%)' }} />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 mb-2 font-display text-center" style={{ WebkitTextStroke: '1px rgba(0,255,255,0.5)', textShadow: '0 0 40px rgba(0,255,255,0.4)' }}>
          NEON CIRCUIT
        </h1>
        <p className="text-cyan-400/80 tracking-[0.3em] font-bold mb-12">HYPER-VELOCITY RACING</p>

        <button 
          onClick={startGame}
          className="mb-16 px-12 py-4 bg-cyan-500/10 border-2 border-cyan-400 text-cyan-300 font-bold text-2xl tracking-widest rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] uppercase font-display"
        >
          START ENGINE
        </button>

        <Leaderboard />
      </div>
    </div>
  );
}
