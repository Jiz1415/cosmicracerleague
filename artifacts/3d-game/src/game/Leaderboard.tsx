import React from 'react';
import { useGetLeaderboard } from '@workspace/api-client-react';
import { format } from 'date-fns';

export function Leaderboard() {
  const { data: entries, isLoading } = useGetLeaderboard();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="text-cyan-500 animate-pulse text-center">Loading Leaderboard...</div>;
  }

  if (!entries || entries.length === 0) {
    return <div className="text-slate-400 text-center">No times recorded yet. Be the first!</div>;
  }

  return (
    <div className="w-full max-w-md bg-black/60 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md">
      <div className="bg-cyan-950/40 border-b border-cyan-500/30 p-3">
        <h3 className="text-cyan-400 font-bold tracking-widest text-center">TOP PILOTS</h3>
      </div>
      <div className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-cyan-700 border-b border-cyan-500/10">
              <th className="px-4 py-2 text-left">RANK</th>
              <th className="px-4 py-2 text-left">NAME</th>
              <th className="px-4 py-2 text-right">TIME</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 5).map((entry, idx) => (
              <tr key={entry.id} className="border-b border-cyan-500/10 hover:bg-cyan-900/20 transition-colors">
                <td className="px-4 py-3 text-cyan-500 font-bold">#{idx + 1}</td>
                <td className="px-4 py-3 text-white font-medium truncate max-w-[120px]">{entry.playerName}</td>
                <td className="px-4 py-3 text-right text-cyan-300 font-mono tracking-wider">{formatTime(entry.raceTimeMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
