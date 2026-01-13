export type ActionType = 'wheelbarrow' | 'bricks' | 'buildNear' | 'buildFar' | 'observe';

export type GameState = 'lobby' | 'waiting' | 'playing' | 'finished';

export type TeamSide = 'west' | 'east';

export interface Player {
  name: string;
  ready: boolean;
  wheelbarrows: number;
  bricks: number;
  farTowerBuildTurnsRemaining: number;
}

export interface PendingAction {
  type: ActionType;
  turn: number;
}

export interface ObserveResult {
  wheelbarrows: number;
  bricks: number;
  action: ActionType;
}

export interface Towers {
  westSide: {
    teamWestHeight: number;
    teamEastHeight: number;
  };
  eastSide: {
    teamWestHeight: number;
    teamEastHeight: number;
  };
}

export interface TurnSummary {
  turn: number;
  playerAction: ActionType;
  resourceChange?: {
    wheelbarrows?: number;
    bricks?: number;
  };
  towerChange?: {
    tower: 'near' | 'far';
    amount: number;
  };
  observeResult?: ObserveResult;
  opponentTowerChanges?: {
    westSide?: number;
    eastSide?: number;
  };
}

export interface Room {
  roomCode: string;
  players: {
    west: Player | null;
    east: Player | null;
  };
  gameState: GameState;
  currentTurn: number;
  towers: Towers;
  pendingActions: {
    west: PendingAction | null;
    east: PendingAction | null;
  };
  observeResults: {
    west: ObserveResult | null;
    east: ObserveResult | null;
  };
  winner: 'Team West' | 'Team East' | null;
  actionHistory: {
    west: TurnSummary[];
    east: TurnSummary[];
  };
}

export interface ClientGameState {
  roomCode: string;
  myTeam: TeamSide;
  myName: string;
  opponentName: string;
  gameState: GameState;
  currentTurn: number;
  towers: Towers;
  myResources: {
    wheelbarrows: number;
    bricks: number;
    farTowerBuildTurnsRemaining: number;
  };
  myPendingAction: PendingAction | null;
  opponentHasSubmitted: boolean;
  lastTurnSummary: TurnSummary | null;
  observeResult: ObserveResult | null;
  winner: 'Team West' | 'Team East' | null;
  actionHistory: TurnSummary[];
}

// Socket events
export interface ServerToClientEvents {
  'room-created': (data: { roomCode: string; team: TeamSide }) => void;
  'room-joined': (data: { roomCode: string; team: TeamSide; opponentName: string }) => void;
  'player-joined': (data: { opponentName: string }) => void;
  'player-ready': (data: { team: TeamSide }) => void;
  'game-started': (data: { gameState: ClientGameState }) => void;
  'action-submitted': (data: { team: TeamSide }) => void;
  'turn-resolved': (data: { gameState: ClientGameState }) => void;
  'game-over': (data: { winner: 'Team West' | 'Team East'; finalState: ClientGameState }) => void;
  'player-disconnected': () => void;
  'error': (data: { message: string }) => void;
  'rematch-requested': (data: { team: TeamSide }) => void;
  'rematch-started': (data: { gameState: ClientGameState }) => void;
}

export interface ClientToServerEvents {
  'create-room': (data: { playerName: string }) => void;
  'join-room': (data: { roomCode: string; playerName: string }) => void;
  'player-ready': () => void;
  'submit-action': (data: { action: ActionType }) => void;
  'request-rematch': () => void;
}
