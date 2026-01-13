import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useSocket } from '../../context/SocketContext';

export function LobbyHome() {
  const { myName, setMyName, createRoom, joinRoom, error, clearError } = useGame();
  const { isConnected } = useSocket();
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'home' | 'join'>('home');

  const handleCreate = () => {
    if (myName.trim()) {
      createRoom();
    }
  };

  const handleJoin = () => {
    if (myName.trim() && joinCode.trim()) {
      joinRoom(joinCode);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tower Race</h1>
          <p className="text-slate-400">Build your towers higher than your opponent!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-300 hover:text-red-200">
                &times;
              </button>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
          </div>

          {mode === 'home' ? (
            <div className="space-y-3">
              <button
                onClick={handleCreate}
                disabled={!myName.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Create Game
              </button>
              <button
                onClick={() => setMode('join')}
                disabled={!myName.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Join Game
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Room Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase tracking-widest text-center font-mono text-xl"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleJoin}
                disabled={!myName.trim() || joinCode.length !== 6}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Join Room
              </button>
              <button
                onClick={() => setMode('home')}
                className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-all"
              >
                Back
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button className="text-slate-400 hover:text-slate-300 text-sm underline">
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}
