interface ResourcePanelProps {
  wheelbarrows: number;
  bricks: number;
  farTowerBuildTurnsRemaining: number;
}

export function ResourcePanel({ wheelbarrows, bricks, farTowerBuildTurnsRemaining }: ResourcePanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Your Resources</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Wheelbarrows */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🛒</span>
            <span className="text-slate-400 text-sm">Wheelbarrows</span>
          </div>
          <div className="text-white text-3xl font-bold">{wheelbarrows}</div>
          <div className="text-slate-500 text-xs mt-1">Multiplies brick gathering</div>
        </div>

        {/* Bricks */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🧱</span>
            <span className="text-slate-400 text-sm">Bricks</span>
          </div>
          <div className="text-white text-3xl font-bold">{bricks}</div>
          <div className="text-slate-500 text-xs mt-1">Building material</div>
        </div>
      </div>

      {/* Build Far Tower Status */}
      {farTowerBuildTurnsRemaining > 0 && (
        <div className="mt-3 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">
              Building Far Tower... (Turn {3 - farTowerBuildTurnsRemaining}/2)
            </span>
          </div>
          <p className="text-amber-400/70 text-xs mt-1">
            You are locked into this action
          </p>
        </div>
      )}
    </div>
  );
}
