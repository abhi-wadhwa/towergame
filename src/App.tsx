import { SocketProvider } from './context/SocketContext';
import { GameProvider, useGame } from './context/GameContext';
import { LobbyHome } from './components/lobby/LobbyHome';
import { WaitingRoom } from './components/lobby/WaitingRoom';
import { GameBoard } from './components/game/GameBoard';

function GameRouter() {
  const { gameState, lobbyState } = useGame();

  // If we have an active game state, show the game board
  if (gameState && gameState.gameState === 'playing') {
    return <GameBoard />;
  }

  if (gameState && gameState.gameState === 'finished') {
    return <GameBoard />;
  }

  // Otherwise, show lobby screens based on lobby state
  if (lobbyState === 'waiting') {
    return <WaitingRoom />;
  }

  return <LobbyHome />;
}

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <GameRouter />
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
