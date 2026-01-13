import { useGame } from '../../context/GameContext';

export function WaitingRoom() {
  const { roomCode, myTeam, myName, opponentName, isReady, opponentReady, setReady } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Waiting Room</h1>
          <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
            <span className="text-slate-400 text-sm">Room Code:</span>
            <span className="font-mono text-xl text-white tracking-widest">{roomCode}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Team West */}
            <div className={`p-4 rounded-xl border-2 ${myTeam === 'west' ? 'border-blue-500 bg-blue-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
              <div className="text-center">
                <div className={`text-sm font-medium ${myTeam === 'west' ? 'text-blue-400' : 'text-emerald-400'} mb-1`}>
                  Team West
                </div>
                <div className="text-white font-semibold text-lg mb-2">
                  {myTeam === 'west' ? myName : opponentName || '...'}
                </div>
                {(myTeam === 'west' ? isReady : opponentReady) ? (
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">Waiting...</span>
                )}
              </div>
            </div>

            {/* Team East */}
            <div className={`p-4 rounded-xl border-2 ${myTeam === 'east' ? 'border-emerald-500 bg-emerald-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
              <div className="text-center">
                <div className={`text-sm font-medium ${myTeam === 'east' ? 'text-emerald-400' : 'text-blue-400'} mb-1`}>
                  Team East
                </div>
                <div className="text-white font-semibold text-lg mb-2">
                  {myTeam === 'east' ? myName : opponentName || '...'}
                </div>
                {(myTeam === 'east' ? isReady : opponentReady) ? (
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">Waiting...</span>
                )}
              </div>
            </div>
          </div>

          {!opponentName ? (
            <div className="text-center py-4">
              <div className="animate-pulse flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-400 mt-2">Waiting for opponent to join...</p>
              <p className="text-slate-500 text-sm mt-1">Share the room code above</p>
            </div>
          ) : !isReady ? (
            <button
              onClick={setReady}
              className={`w-full py-4 px-6 bg-gradient-to-r ${
                myTeam === 'west'
                  ? 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'
                  : 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
              } text-white font-semibold rounded-lg transition-all shadow-lg`}
            >
              I'm Ready!
            </button>
          ) : !opponentReady ? (
            <div className="text-center py-4">
              <div className="animate-pulse flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-400 mt-2">Waiting for opponent to ready up...</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-green-400">Starting game...</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-800/30 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Quick Rules:</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>- Build BOTH your towers taller than BOTH opponent towers to win</li>
            <li>- Gather wheelbarrows, then gather bricks (bricks = wheelbarrow count)</li>
            <li>- Build Near Tower (instant) or Far Tower (2 turns)</li>
            <li>- Use Observe to spy on opponent's resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
