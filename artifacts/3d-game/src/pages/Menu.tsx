import React from 'react';
import { useGameState } from '../game/useGameState';
import { Leaderboard } from '../game/Leaderboard';
import { TRACKS } from '../game/tracks';

export default function Menu() {
  const { startGame, state, selectedTrackId, setSelectedTrackId } = useGameState();

  if (state !== 'MENU') return null;

  return (
    <div className="min-w-[100vw] min-h-[100vh] overflow-y-auto bg-[#050510] flex flex-col items-center py-16 relative font-sans">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed" style={{ backgroundImage: 'radial-gradient(circle at center, #00ffff 0%, transparent 50%)' }} />
      
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 mb-2 font-display text-center" style={{ WebkitTextStroke: '1px rgba(0,255,255,0.5)', textShadow: '0 0 40px rgba(0,255,255,0.4)' }}>
          NEON CIRCUIT
        </h1>
        <p className="text-cyan-400/80 tracking-[0.3em] font-bold mb-12">HYPER-VELOCITY RACING</p>

        <div className="w-full flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          {TRACKS.map(track => {
            const isSelected = track.id === selectedTrackId;
            return (
              <div 
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all duration-300 w-full sm:w-1/3 bg-black/40 backdrop-blur-sm ${isSelected ? 'scale-105' : 'hover:bg-white/5'}`}
                style={{ 
                  borderColor: isSelected ? track.primaryColor : 'rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? `0 0 20px ${track.primaryColor}80` : 'none'
                }}
              >
                <div className="font-display text-xl font-bold mb-2 text-center" style={{ color: track.primaryColor }}>
                  {track.name}
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 font-bold">{track.difficulty}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 font-bold">{track.laps} LAPS</span>
                </div>
                <p className="text-sm text-center text-white/60">
                  {track.flavor}
                </p>
              </div>
            );
          })}
        </div>

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
