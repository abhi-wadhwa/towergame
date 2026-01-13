import type { TurnSummary as TurnSummaryType, ActionType } from '../../types/game';

interface TurnSummaryProps {
  summary: TurnSummaryType | null;
  myTeam: 'west' | 'east';
}

function getActionDescription(action: ActionType): string {
  switch (action) {
    case 'wheelbarrow':
      return 'Gathered a wheelbarrow';
    case 'bricks':
      return 'Gathered bricks';
    case 'buildNear':
      return 'Built near tower';
    case 'buildFar':
      return 'Built far tower';
    case 'observe':
      return 'Observed opponent';
    default:
      return 'Unknown action';
  }
}

export function TurnSummary({ summary, myTeam }: TurnSummaryProps) {
  if (!summary) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
        Turn {summary.turn} Summary
      </h3>

      <div className="space-y-2">
        {/* Your action */}
        <div className="flex items-start gap-2 text-slate-300">
          <span className="text-blue-400">You:</span>
          <span>{getActionDescription(summary.playerAction)}</span>
        </div>

        {/* Resource changes */}
        {summary.resourceChange && (
          <div className="pl-4 text-sm">
            {summary.resourceChange.wheelbarrows !== undefined && (
              <div className="text-green-400">
                +{summary.resourceChange.wheelbarrows} wheelbarrow
              </div>
            )}
            {summary.resourceChange.bricks !== undefined && (
              <div className="text-green-400">
                +{summary.resourceChange.bricks} bricks
              </div>
            )}
          </div>
        )}

        {/* Tower changes */}
        {summary.towerChange && summary.towerChange.amount > 0 && (
          <div className="pl-4 text-sm text-emerald-400">
            {summary.towerChange.tower === 'near' ? 'Near' : 'Far'} tower +{summary.towerChange.amount} height
          </div>
        )}

        {/* Observe results */}
        {summary.observeResult && (
          <div className="mt-2 p-3 bg-purple-500/20 border border-purple-500/50 rounded-lg">
            <div className="text-purple-400 font-medium mb-1">Observed opponent:</div>
            <div className="text-slate-300 text-sm space-y-1">
              <div>🛒 {summary.observeResult.wheelbarrows} wheelbarrows</div>
              <div>🧱 {summary.observeResult.bricks} bricks</div>
              <div>Action: {getActionDescription(summary.observeResult.action)}</div>
            </div>
          </div>
        )}

        {/* Opponent tower changes (visible changes only) */}
        {summary.opponentTowerChanges && (
          <>
            {((myTeam === 'west' && summary.opponentTowerChanges.westSide !== 0) ||
              (myTeam === 'east' && summary.opponentTowerChanges.eastSide !== 0)) && (
              <div className="mt-2 text-slate-400 text-sm">
                <span className="text-red-400">Opponent:</span>{' '}
                {myTeam === 'west' && summary.opponentTowerChanges.westSide !== 0 && (
                  <span>West tower +{summary.opponentTowerChanges.westSide}</span>
                )}
                {myTeam === 'east' && summary.opponentTowerChanges.eastSide !== 0 && (
                  <span>East tower +{summary.opponentTowerChanges.eastSide}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
