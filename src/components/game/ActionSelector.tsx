import { useState } from 'react';
import type { ActionType } from '../../types/game';

interface ActionSelectorProps {
  wheelbarrows: number;
  bricks: number;
  farTowerBuildTurnsRemaining: number;
  hasSubmitted: boolean;
  opponentHasSubmitted: boolean;
  onSubmit: (action: ActionType) => void;
}

interface ActionOption {
  type: ActionType;
  label: string;
  description: string;
  icon: string;
  disabled?: boolean;
  highlight?: boolean;
}

export function ActionSelector({
  wheelbarrows,
  bricks,
  farTowerBuildTurnsRemaining,
  hasSubmitted,
  opponentHasSubmitted,
  onSubmit,
}: ActionSelectorProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const isLocked = farTowerBuildTurnsRemaining > 0;

  const actions: ActionOption[] = [
    {
      type: 'wheelbarrow',
      label: 'Gather Wheelbarrow',
      description: '+1 wheelbarrow',
      icon: '🛒',
      disabled: isLocked,
    },
    {
      type: 'bricks',
      label: 'Gather Bricks',
      description: `+${wheelbarrows} bricks`,
      icon: '🧱',
      disabled: isLocked || wheelbarrows === 0,
      highlight: wheelbarrows > 0,
    },
    {
      type: 'buildNear',
      label: 'Build Near Tower',
      description: `Spend ${bricks} bricks (instant)`,
      icon: '🏗️',
      disabled: isLocked || bricks === 0,
      highlight: bricks > 0,
    },
    {
      type: 'buildFar',
      label: isLocked ? `Building Far Tower (${3 - farTowerBuildTurnsRemaining}/2)` : 'Build Far Tower',
      description: isLocked ? 'Completing next turn...' : `Spend ${bricks} bricks (2 turns)`,
      icon: '🏰',
      disabled: bricks === 0 && !isLocked,
      highlight: isLocked,
    },
    {
      type: 'observe',
      label: 'Observe',
      description: "See opponent's resources & action",
      icon: '👁️',
      disabled: isLocked,
    },
  ];

  const handleSubmit = () => {
    if (isLocked) {
      onSubmit('buildFar');
    } else if (selectedAction) {
      onSubmit(selectedAction);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-400 mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Action Submitted</span>
          </div>

          {opponentHasSubmitted ? (
            <div className="mt-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-slate-400">Resolving turn...</p>
            </div>
          ) : (
            <div className="mt-4">
              <div className="animate-pulse flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-400 mt-2">Waiting for opponent...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        Choose Your Action
      </h3>

      {isLocked && (
        <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg">
          <p className="text-amber-400 text-sm">
            You must complete Build Far Tower. Click submit to continue.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.type}
            onClick={() => !isLocked && setSelectedAction(action.type)}
            disabled={action.disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              isLocked && action.type === 'buildFar'
                ? 'border-amber-500 bg-amber-500/20'
                : selectedAction === action.type
                ? 'border-blue-500 bg-blue-500/20'
                : action.disabled
                ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1">
                <div className="text-white font-medium">{action.label}</div>
                <div className={`text-sm ${action.highlight ? 'text-green-400' : 'text-slate-400'}`}>
                  {action.description}
                </div>
              </div>
              {(selectedAction === action.type || (isLocked && action.type === 'buildFar')) && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedAction && !isLocked}
        className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
      >
        Submit Action
      </button>
    </div>
  );
}
