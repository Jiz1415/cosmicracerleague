import { useGameState } from '../game/useGameState';
import { Leaderboard } from '../game/Leaderboard';
import { TRACKS } from '../game/tracks';
import { getCarById } from '../game/cars';

const TRACK_THEME: Record<string, {
  glow: string; titleFrom: string; titleTo: string; stroke: string; shadow: string;
  subtitleColor: string; btnBg: string; btnBorder: string; btnText: string; btnHoverShadow: string;
}> = {
  'neon-circuit': {
    glow: 'radial-gradient(circle at center, #00ffff 0%, transparent 50%)',
    titleFrom: 'from-cyan-300', titleTo: 'to-cyan-600',
    stroke: 'rgba(0,255,255,0.5)', shadow: '0 0 40px rgba(0,255,255,0.4)',
    subtitleColor: 'text-cyan-400/80',
    btnBg: 'bg-cyan-500/10', btnBorder: 'border-cyan-400', btnText: 'text-cyan-300',
    btnHoverShadow: 'hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]',
  },
  'volcanic-rift': {
    glow: 'radial-gradient(circle at center, #ff4400 0%, transparent 50%)',
    titleFrom: 'from-red-400', titleTo: 'to-orange-600',
    stroke: 'rgba(255,68,0,0.5)', shadow: '0 0 40px rgba(255,68,0,0.5)',
    subtitleColor: 'text-orange-400/80',
    btnBg: 'bg-red-500/10', btnBorder: 'border-red-400', btnText: 'text-red-300',
    btnHoverShadow: 'hover:shadow-[0_0_30px_rgba(255,68,0,0.6)]',
  },
  'crystal-abyss': {
    glow: 'radial-gradient(circle at center, #aa00ff 0%, transparent 50%)',
    titleFrom: 'from-purple-300', titleTo: 'to-purple-700',
    stroke: 'rgba(170,0,255,0.5)', shadow: '0 0 40px rgba(170,0,255,0.5)',
    subtitleColor: 'text-purple-400/80',
    btnBg: 'bg-purple-600/10', btnBorder: 'border-purple-400', btnText: 'text-purple-300',
    btnHoverShadow: 'hover:shadow-[0_0_30px_rgba(170,0,255,0.6)]',
  },
};

export default function Menu() {
  const { startGame, state, selectedTrackId, setSelectedTrackId, credits, selectedCarId, setState } = useGameState();

  if (state !== 'MENU') return null;

  const selectedCar = getCarById(selectedCarId);
  const theme = TRACK_THEME[selectedTrackId] ?? TRACK_THEME['neon-circuit'];
  const track = TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0];

  return (
    <div className="min-w-[100vw] min-h-[100vh] overflow-y-auto bg-[#050510] flex flex-col items-center py-16 relative font-sans transition-all duration-700">
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed transition-all duration-700"
        style={{ backgroundImage: theme.glow }}
      />
      
      <div className="absolute top-6 right-8 z-20 text-yellow-400 font-bold text-xl tracking-widest bg-black/40 px-4 py-2 border border-yellow-500/30 rounded shadow-[0_0_15px_rgba(255,215,0,0.2)]">
        {credits.toLocaleString()} CR
      </div>
      
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6">
        <h1
          className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b ${theme.titleFrom} ${theme.titleTo} mb-2 font-display text-center transition-all duration-500`}
          style={{ WebkitTextStroke: `1px ${theme.stroke}`, textShadow: theme.shadow }}
        >
          {track.name.toUpperCase()}
        </h1>
        <p className={`${theme.subtitleColor} tracking-[0.3em] font-bold mb-1 transition-colors duration-500`}>HYPER-VELOCITY RACING</p>
        <p className="text-white/35 text-sm tracking-widest italic mb-12">A JizXMiz Game</p>

        <div className="w-full flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          {TRACKS.map(t => {
            const isSelected = t.id === selectedTrackId;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTrackId(t.id)}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all duration-300 w-full sm:w-1/3 bg-black/40 backdrop-blur-sm ${isSelected ? 'scale-105' : 'hover:bg-white/5'}`}
                style={{
                  borderColor: isSelected ? t.primaryColor : 'rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? `0 0 20px ${t.primaryColor}80` : 'none'
                }}
              >
                <div className="font-display text-xl font-bold mb-2 text-center" style={{ color: t.primaryColor }}>
                  {t.name}
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 font-bold">{t.difficulty}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 font-bold">{t.laps} LAPS</span>
                </div>
                <p className="text-sm text-center text-white/60">{t.flavor}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex gap-6">
            <button
              onClick={startGame}
              className={`px-12 py-4 ${theme.btnBg} border-2 ${theme.btnBorder} ${theme.btnText} font-bold text-2xl tracking-widest rounded-lg hover:text-black transition-all duration-300 ${theme.btnHoverShadow} uppercase font-display`}
              style={{ '--hover-bg': track.primaryColor } as React.CSSProperties}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = track.primaryColor; (e.currentTarget as HTMLButtonElement).style.color = '#000'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ''; (e.currentTarget as HTMLButtonElement).style.color = ''; }}
            >
              START ENGINE
            </button>
            <button
              onClick={() => setState('GARAGE')}
              className="px-8 py-4 bg-purple-500/10 border-2 border-purple-400 text-purple-300 font-bold text-xl tracking-widest rounded-lg hover:bg-purple-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] uppercase font-display"
            >
              GARAGE
            </button>
          </div>
          <div className="text-sm tracking-widest font-bold uppercase mt-2 transition-colors duration-500" style={{ color: track.primaryColor + 'cc' }}>
            VEHICLE: {selectedCar.name}
          </div>
        </div>

        <Leaderboard trackId={selectedTrackId} trackColor={track.primaryColor} />
      </div>
    </div>
  );
}
