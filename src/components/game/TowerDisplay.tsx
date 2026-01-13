import type { Towers, TeamSide } from '../../types/game';

interface TowerDisplayProps {
  towers: Towers;
  myTeam: TeamSide;
}

function Tower({ height, maxHeight, label, color, isOwn }: {
  height: number;
  maxHeight: number;
  label: string;
  color: 'blue' | 'emerald';
  isOwn: boolean;
}) {
  const heightPercent = Math.min((height / Math.max(maxHeight, 1)) * 100, 100);
  const bgColor = color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500';
  const bgColorFaded = color === 'blue' ? 'bg-blue-500/20' : 'bg-emerald-500/20';
  const borderColor = isOwn ? 'border-yellow-400' : 'border-transparent';

  return (
    <div className={`flex flex-col items-center ${isOwn ? 'scale-105' : ''}`}>
      <div className={`relative w-16 h-40 ${bgColorFaded} rounded-t-lg border-2 ${borderColor} overflow-hidden`}>
        <div
          className={`absolute bottom-0 left-0 right-0 ${bgColor} transition-all duration-500 ease-out rounded-t`}
          style={{ height: `${heightPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-2xl drop-shadow-lg">{height}</span>
        </div>
      </div>
      <div className={`mt-2 text-xs font-medium ${color === 'blue' ? 'text-blue-400' : 'text-emerald-400'}`}>
        {label}
      </div>
      {isOwn && (
        <div className="text-yellow-400 text-xs mt-1">YOUR TOWER</div>
      )}
    </div>
  );
}

export function TowerDisplay({ towers, myTeam }: TowerDisplayProps) {
  // Calculate max height for scaling
  const allHeights = [
    towers.westSide.teamWestHeight,
    towers.westSide.teamEastHeight,
    towers.eastSide.teamWestHeight,
    towers.eastSide.teamEastHeight,
  ];
  const maxHeight = Math.max(...allHeights, 10);

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 text-center">Towers</h3>

      <div className="flex justify-around items-end">
        {/* West Side */}
        <div className="text-center">
          <div className="text-slate-400 text-xs mb-4 uppercase tracking-wider">West Side</div>
          <div className="flex gap-4">
            <Tower
              height={towers.westSide.teamWestHeight}
              maxHeight={maxHeight}
              label="West Team"
              color="blue"
              isOwn={myTeam === 'west'}
            />
            <Tower
              height={towers.westSide.teamEastHeight}
              maxHeight={maxHeight}
              label="East Team"
              color="emerald"
              isOwn={myTeam === 'east'}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-48 w-px bg-slate-600"></div>

        {/* East Side */}
        <div className="text-center">
          <div className="text-slate-400 text-xs mb-4 uppercase tracking-wider">East Side</div>
          <div className="flex gap-4">
            <Tower
              height={towers.eastSide.teamWestHeight}
              maxHeight={maxHeight}
              label="West Team"
              color="blue"
              isOwn={myTeam === 'west'}
            />
            <Tower
              height={towers.eastSide.teamEastHeight}
              maxHeight={maxHeight}
              label="East Team"
              color="emerald"
              isOwn={myTeam === 'east'}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-400">Team West</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-slate-400">Team East</span>
        </div>
      </div>
    </div>
  );
}
