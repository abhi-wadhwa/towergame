import { useEffect, useState } from 'react';
import type { ObserveResult, ActionType } from '../../types/game';

interface ObserveModalProps {
  result: ObserveResult;
  onClose: () => void;
}

function getActionDescription(action: ActionType): string {
  switch (action) {
    case 'wheelbarrow':
      return 'Gathering a wheelbarrow';
    case 'bricks':
      return 'Gathering bricks';
    case 'buildNear':
      return 'Building their near tower';
    case 'buildFar':
      return 'Building their far tower';
    case 'observe':
      return 'Observing you!';
    default:
      return 'Unknown action';
  }
}

export function ObserveModal({ result, onClose }: ObserveModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-purple-500/50 shadow-2xl shadow-purple-500/20 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <span className="text-4xl">👁️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Intelligence Report</h2>
          <p className="text-purple-400">You observed your opponent!</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4">
            <span className="text-3xl">🛒</span>
            <div>
              <div className="text-slate-400 text-sm">Wheelbarrows</div>
              <div className="text-white text-2xl font-bold">{result.wheelbarrows}</div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4">
            <span className="text-3xl">🧱</span>
            <div>
              <div className="text-slate-400 text-sm">Bricks</div>
              <div className="text-white text-2xl font-bold">{result.bricks}</div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Current Action</div>
            <div className="text-white font-medium">{getActionDescription(result.action)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">
            Closing in {countdown}s...
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
