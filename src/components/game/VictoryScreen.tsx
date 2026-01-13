import type { ClientGameState } from '../../types/game';

interface VictoryScreenProps {
  gameState: ClientGameState;
  rematchRequested: boolean;
  opponentRequestedRematch: boolean;
  onRematch: () => void;
}

export function VictoryScreen({
  gameState,
  rematchRequested,
  opponentRequestedRematch,
  onRematch,
}: VictoryScreenProps) {
  const didWin =
    (gameState.myTeam === 'west' && gameState.winner === 'Team West') ||
    (gameState.myTeam === 'east' && gameState.winner === 'Team East');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-800 rounded-2xl p-8 max-w-lg w-full border-2 ${
        didWin ? 'border-yellow-500' : 'border-slate-600'
      } shadow-2xl`}>
        {/* Victory/Defeat Header */}
        <div className="text-center mb-8">
          {didWin ? (
            <>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-bold text-yellow-400 mb-2">Victory!</h2>
              <p className="text-slate-300">
                {gameState.winner} wins!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-4xl font-bold text-slate-400 mb-2">Defeat</h2>
              <p className="text-slate-300">
                {gameState.winner} wins!
              </p>
            </>
          )}
        </div>

        {/* Final Tower Heights */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-4 text-center">Final Tower Heights</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* West Side */}
            <div className="text-center">
              <div className="text-slate-400 text-xs mb-2 uppercase">West Side</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-blue-500/20 rounded px-3 py-2">
                  <span className="text-blue-400 text-sm">Team West</span>
                  <span className="text-white font-bold">{gameState.towers.westSide.teamWestHeight}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-500/20 rounded px-3 py-2">
                  <span className="text-emerald-400 text-sm">Team East</span>
                  <span className="text-white font-bold">{gameState.towers.westSide.teamEastHeight}</span>
                </div>
              </div>
            </div>

            {/* East Side */}
            <div className="text-center">
              <div className="text-slate-400 text-xs mb-2 uppercase">East Side</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-blue-500/20 rounded px-3 py-2">
                  <span className="text-blue-400 text-sm">Team West</span>
                  <span className="text-white font-bold">{gameState.towers.eastSide.teamWestHeight}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-500/20 rounded px-3 py-2">
                  <span className="text-emerald-400 text-sm">Team East</span>
                  <span className="text-white font-bold">{gameState.towers.eastSide.teamEastHeight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-sm">Total Turns</div>
            <div className="text-white text-2xl font-bold">{gameState.currentTurn}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-sm">Your Final Resources</div>
            <div className="text-white">
              🛒 {gameState.myResources.wheelbarrows} | 🧱 {gameState.myResources.bricks}
            </div>
          </div>
        </div>

        {/* Rematch Button */}
        <div className="space-y-3">
          {rematchRequested ? (
            <div className="text-center py-4">
              <div className="animate-pulse flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-400 mt-2">Waiting for opponent to accept rematch...</p>
            </div>
          ) : opponentRequestedRematch ? (
            <div className="text-center">
              <p className="text-emerald-400 mb-3">Opponent wants a rematch!</p>
              <button
                onClick={onRematch}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Accept Rematch
              </button>
            </div>
          ) : (
            <button
              onClick={onRematch}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              Request Rematch
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-all"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
