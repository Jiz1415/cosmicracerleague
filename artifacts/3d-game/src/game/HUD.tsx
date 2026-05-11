import React from 'react';
import { useGameState } from './useGameState';
import { TRACKS } from './tracks';

export function HUD() {
  const { lap, maxLaps, speed, timeMs, boostActive, selectedTrackId, lapFlash, activeBoostTier, chestNotification } = useGameState();
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
        {boostActive && activeBoostTier === 'common' && (
          <div className="text-2xl font-bold tracking-widest text-cyan-400 animate-pulse bg-black/60 px-8 py-2 rounded-full border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.8)]">
            BOOST ACTIVE
          </div>
        )}
        {boostActive && activeBoostTier === 'rare' && (
          <div className="text-3xl font-bold tracking-widest text-yellow-400 animate-pulse bg-black/60 px-8 py-2 rounded-full border border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.8)]">
            RARE BOOST!
          </div>
        )}
        {boostActive && activeBoostTier === 'legendary' && (
          <div className="text-4xl font-black tracking-widest text-white animate-pulse bg-black/60 px-10 py-3 rounded-full border-2 border-white shadow-[0_0_40px_rgba(255,255,255,1)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500">LEGENDARY BOOST!!</span>
          </div>
        )}
        {chestNotification && (
          <div className="text-3xl font-black animate-bounce text-yellow-400 border border-yellow-500 bg-black/70 px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.8)] mt-4">
            CHEST OPENED! {chestNotification}
          </div>
        )}
        <div className="text-white/50 text-sm font-bold tracking-widest bg-black/40 px-4 py-1 rounded">
          {track.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
