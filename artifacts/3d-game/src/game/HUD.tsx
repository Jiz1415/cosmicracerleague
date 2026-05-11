import React from 'react';
import { useGameState } from './useGameState';
import { TRACKS } from './tracks';

export function HUD() {
  const { lap, maxLaps, speed, timeMs, boostActive, selectedTrackId, lapFlash } = useGameState();
  const track = TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0];

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between font-['Orbitron']">
      <div className="flex justify-between items-start">
        <div className="bg-black/50 border border-cyan-500/30 p-4 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <div className="text-cyan-500 text-sm tracking-widest font-bold">LAP</div>
          <div className="text-4xl text-white font-black">{lap} <span className="text-cyan-700 text-2xl">/ {maxLaps}</span></div>
        </div>

        <div className="bg-black/50 border border-cyan-500/30 p-4 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center min-w-[200px]">
          <div className="text-cyan-500 text-sm tracking-widest font-bold">TIME</div>
          <div className="text-3xl text-white font-mono tracking-wider">{formatTime(timeMs)}</div>
        </div>

        <div className="bg-black/50 border border-cyan-500/30 p-4 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)] text-right min-w-[150px]">
          <div className="text-cyan-500 text-sm tracking-widest font-bold">SPEED</div>
          <div className="text-4xl text-white font-black">{Math.floor(speed * 10)} <span className="text-cyan-700 text-xl">KM/H</span></div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-10 gap-4">
        {lapFlash && (
          <div 
            className="text-6xl font-black tracking-widest animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            style={{ color: track.primaryColor }}
          >
            LAP COMPLETE!
          </div>
        )}
        {boostActive && (
          <div className="text-2xl font-bold tracking-widest text-cyan-400 animate-pulse bg-black/60 px-8 py-2 rounded-full border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.8)]">
            BOOST ACTIVE
          </div>
        )}
        <div className="text-white/50 text-sm font-bold tracking-widest bg-black/40 px-4 py-1 rounded">
          {track.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
