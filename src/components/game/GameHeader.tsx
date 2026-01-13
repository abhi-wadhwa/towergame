interface GameHeaderProps {
  roomCode: string;
  currentTurn: number;
  myName: string;
  opponentName: string;
  myTeam: 'west' | 'east';
}

export function GameHeader({ roomCode, currentTurn, myName, opponentName, myTeam }: GameHeaderProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Room Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Room:</span>
            <span className="font-mono text-white bg-slate-700/50 px-2 py-1 rounded">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Turn:</span>
            <span className="text-white font-bold text-lg">{currentTurn}</span>
          </div>
        </div>

        {/* Players */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${myTeam === 'west' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
            <span className="text-white font-medium">{myName}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${myTeam === 'west' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              Team {myTeam === 'west' ? 'West' : 'East'}
            </span>
          </div>
          <span className="text-slate-500">vs</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${myTeam === 'west' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
            <span className="text-white font-medium">{opponentName}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${myTeam === 'west' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              Team {myTeam === 'west' ? 'East' : 'West'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
