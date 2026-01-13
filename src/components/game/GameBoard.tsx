import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GameHeader } from './GameHeader';
import { TowerDisplay } from './TowerDisplay';
import { ResourcePanel } from './ResourcePanel';
import { ActionSelector } from './ActionSelector';
import { TurnSummary } from './TurnSummary';
import { ObserveModal } from './ObserveModal';
import { VictoryScreen } from './VictoryScreen';

export function GameBoard() {
  const {
    gameState,
    submitAction,
    requestRematch,
    opponentDisconnected,
    rematchRequested,
    opponentRequestedRematch,
  } = useGame();

  const [showObserveModal, setShowObserveModal] = useState(false);
  const [lastObserveResult, setLastObserveResult] = useState(gameState?.observeResult);

  // Show observe modal when we get new observe results
  useEffect(() => {
    if (gameState?.observeResult && gameState.observeResult !== lastObserveResult) {
      setLastObserveResult(gameState.observeResult);
      setShowObserveModal(true);
    }
  }, [gameState?.observeResult, lastObserveResult]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (opponentDisconnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md w-full border border-red-500/50 text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">Opponent Disconnected</h2>
          <p className="text-slate-400 mb-6">Your opponent has left the game.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <GameHeader
          roomCode={gameState.roomCode}
          currentTurn={gameState.currentTurn}
          myName={gameState.myName}
          opponentName={gameState.opponentName}
          myTeam={gameState.myTeam}
        />

        {/* Tower Display */}
        <TowerDisplay towers={gameState.towers} myTeam={gameState.myTeam} />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Column - Resources and Last Turn */}
          <div className="space-y-4">
            <ResourcePanel
              wheelbarrows={gameState.myResources.wheelbarrows}
              bricks={gameState.myResources.bricks}
              farTowerBuildTurnsRemaining={gameState.myResources.farTowerBuildTurnsRemaining}
            />
            <TurnSummary summary={gameState.lastTurnSummary} myTeam={gameState.myTeam} />
          </div>

          {/* Right Column - Action Selection */}
          <ActionSelector
            wheelbarrows={gameState.myResources.wheelbarrows}
            bricks={gameState.myResources.bricks}
            farTowerBuildTurnsRemaining={gameState.myResources.farTowerBuildTurnsRemaining}
            hasSubmitted={gameState.myPendingAction !== null}
            opponentHasSubmitted={gameState.opponentHasSubmitted}
            onSubmit={submitAction}
          />
        </div>

        {/* Action History */}
        {gameState.actionHistory.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Action History
            </h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {[...gameState.actionHistory].reverse().slice(0, 10).map((summary, index) => (
                <div key={index} className="text-sm text-slate-400 flex gap-2">
                  <span className="text-slate-500">Turn {summary.turn}:</span>
                  <span>
                    {summary.playerAction === 'wheelbarrow' && 'Gathered wheelbarrow'}
                    {summary.playerAction === 'bricks' && `Gathered ${summary.resourceChange?.bricks || 0} bricks`}
                    {summary.playerAction === 'buildNear' && `Built near tower (+${summary.towerChange?.amount || 0})`}
                    {summary.playerAction === 'buildFar' && (summary.towerChange?.amount ? `Built far tower (+${summary.towerChange.amount})` : 'Building far tower...')}
                    {summary.playerAction === 'observe' && 'Observed opponent'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Observe Modal */}
      {showObserveModal && gameState.observeResult && (
        <ObserveModal
          result={gameState.observeResult}
          onClose={() => setShowObserveModal(false)}
        />
      )}

      {/* Victory Screen */}
      {gameState.gameState === 'finished' && gameState.winner && (
        <VictoryScreen
          gameState={gameState}
          rematchRequested={rematchRequested}
          opponentRequestedRematch={opponentRequestedRematch}
          onRematch={requestRematch}
        />
      )}
    </div>
  );
}
