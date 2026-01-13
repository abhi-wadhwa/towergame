import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSocket } from './SocketContext';
import type { ClientGameState, ActionType, TeamSide } from '../types/game';

type LobbyState = 'home' | 'creating' | 'joining' | 'waiting';

interface GameContextType {
  // Lobby state
  lobbyState: LobbyState;
  setLobbyState: (state: LobbyState) => void;
  roomCode: string | null;
  myTeam: TeamSide | null;
  myName: string;
  setMyName: (name: string) => void;
  opponentName: string;
  isReady: boolean;
  opponentReady: boolean;

  // Game state
  gameState: ClientGameState | null;
  isMyTurn: boolean;

  // Actions
  createRoom: () => void;
  joinRoom: (code: string) => void;
  setReady: () => void;
  submitAction: (action: ActionType) => void;
  requestRematch: () => void;

  // UI state
  error: string | null;
  clearError: () => void;
  opponentDisconnected: boolean;
  rematchRequested: boolean;
  opponentRequestedRematch: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();

  // Lobby state
  const [lobbyState, setLobbyState] = useState<LobbyState>('home');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [myTeam, setMyTeam] = useState<TeamSide | null>(null);
  const [myName, setMyName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);

  // Game state
  const [gameState, setGameState] = useState<ClientGameState | null>(null);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentRequestedRematch, setOpponentRequestedRematch] = useState(false);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', ({ roomCode, team }) => {
      setRoomCode(roomCode);
      setMyTeam(team);
      setLobbyState('waiting');
    });

    socket.on('room-joined', ({ roomCode, team, opponentName }) => {
      setRoomCode(roomCode);
      setMyTeam(team);
      setOpponentName(opponentName);
      setLobbyState('waiting');
    });

    socket.on('player-joined', ({ opponentName }) => {
      setOpponentName(opponentName);
    });

    socket.on('player-ready', ({ team }) => {
      if (team === myTeam) {
        setIsReady(true);
      } else {
        setOpponentReady(true);
      }
    });

    socket.on('game-started', ({ gameState }) => {
      setGameState(gameState);
    });

    socket.on('action-submitted', ({ team }) => {
      if (gameState && team !== myTeam) {
        setGameState(prev => prev ? { ...prev, opponentHasSubmitted: true } : null);
      }
    });

    socket.on('turn-resolved', ({ gameState }) => {
      setGameState(gameState);
    });

    socket.on('game-over', ({ finalState }) => {
      setGameState(finalState);
    });

    socket.on('player-disconnected', () => {
      setOpponentDisconnected(true);
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    socket.on('rematch-requested', ({ team }) => {
      if (team !== myTeam) {
        setOpponentRequestedRematch(true);
      }
    });

    socket.on('rematch-started', ({ gameState }) => {
      setGameState(gameState);
      setRematchRequested(false);
      setOpponentRequestedRematch(false);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('player-joined');
      socket.off('player-ready');
      socket.off('game-started');
      socket.off('action-submitted');
      socket.off('turn-resolved');
      socket.off('game-over');
      socket.off('player-disconnected');
      socket.off('error');
      socket.off('rematch-requested');
      socket.off('rematch-started');
    };
  }, [socket, myTeam, gameState]);

  const createRoom = useCallback(() => {
    if (socket && myName.trim()) {
      socket.emit('create-room', { playerName: myName.trim() });
    }
  }, [socket, myName]);

  const joinRoom = useCallback((code: string) => {
    if (socket && myName.trim() && code.trim()) {
      socket.emit('join-room', { roomCode: code.trim().toUpperCase(), playerName: myName.trim() });
    }
  }, [socket, myName]);

  const setReady = useCallback(() => {
    if (socket) {
      socket.emit('player-ready');
    }
  }, [socket]);

  const submitAction = useCallback((action: ActionType) => {
    if (socket) {
      socket.emit('submit-action', { action });
    }
  }, [socket]);

  const requestRematch = useCallback(() => {
    if (socket) {
      socket.emit('request-rematch');
      setRematchRequested(true);
    }
  }, [socket]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isMyTurn = gameState?.gameState === 'playing' && !gameState.myPendingAction;

  return (
    <GameContext.Provider
      value={{
        lobbyState,
        setLobbyState,
        roomCode,
        myTeam,
        myName,
        setMyName,
        opponentName,
        isReady,
        opponentReady,
        gameState,
        isMyTurn,
        createRoom,
        joinRoom,
        setReady,
        submitAction,
        requestRematch,
        error,
        clearError,
        opponentDisconnected,
        rematchRequested,
        opponentRequestedRematch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
