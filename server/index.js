const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

// Store active rooms
const rooms = new Map();

// Generate random room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create initial room state
function createRoom(roomCode) {
  return {
    roomCode,
    players: {
      west: null,
      east: null,
    },
    sockets: {
      west: null,
      east: null,
    },
    gameState: 'lobby',
    currentTurn: 0,
    towers: {
      westSide: {
        teamWestHeight: 5,
        teamEastHeight: 0,
      },
      eastSide: {
        teamWestHeight: 0,
        teamEastHeight: 5,
      },
    },
    pendingActions: {
      west: null,
      east: null,
    },
    observeResults: {
      west: null,
      east: null,
    },
    winner: null,
    actionHistory: {
      west: [],
      east: [],
    },
    rematchRequests: {
      west: false,
      east: false,
    },
  };
}

// Create initial player state
function createPlayer(name) {
  return {
    name,
    ready: false,
    wheelbarrows: 0,
    bricks: 0,
    farTowerBuildTurnsRemaining: 0,
  };
}

// Get client game state for a specific team
function getClientGameState(room, team) {
  const myPlayer = room.players[team];
  const opponentTeam = team === 'west' ? 'east' : 'west';
  const opponentPlayer = room.players[opponentTeam];

  return {
    roomCode: room.roomCode,
    myTeam: team,
    myName: myPlayer?.name || '',
    opponentName: opponentPlayer?.name || '',
    gameState: room.gameState,
    currentTurn: room.currentTurn,
    towers: room.towers,
    myResources: {
      wheelbarrows: myPlayer?.wheelbarrows || 0,
      bricks: myPlayer?.bricks || 0,
      farTowerBuildTurnsRemaining: myPlayer?.farTowerBuildTurnsRemaining || 0,
    },
    myPendingAction: room.pendingActions[team],
    opponentHasSubmitted: room.pendingActions[opponentTeam] !== null,
    lastTurnSummary: room.actionHistory[team].length > 0
      ? room.actionHistory[team][room.actionHistory[team].length - 1]
      : null,
    observeResult: room.observeResults[team],
    winner: room.winner,
    actionHistory: room.actionHistory[team],
  };
}

// Check victory condition
function checkVictory(towers) {
  // Team West wins if both their towers are taller than both opponent towers
  const westWins =
    towers.westSide.teamWestHeight > towers.westSide.teamEastHeight &&
    towers.eastSide.teamWestHeight > towers.eastSide.teamEastHeight;

  // Team East wins if both their towers are taller than both opponent towers
  const eastWins =
    towers.eastSide.teamEastHeight > towers.eastSide.teamWestHeight &&
    towers.westSide.teamEastHeight > towers.westSide.teamWestHeight;

  if (westWins) return 'Team West';
  if (eastWins) return 'Team East';
  return null;
}

// Process a single player's action
function processAction(action, player, opponent, team, towers) {
  const summary = {
    turn: 0,
    playerAction: action,
  };

  switch (action) {
    case 'wheelbarrow':
      player.wheelbarrows += 1;
      summary.resourceChange = { wheelbarrows: 1 };
      break;

    case 'bricks':
      const bricksGained = player.wheelbarrows;
      player.bricks += bricksGained;
      summary.resourceChange = { bricks: bricksGained };
      break;

    case 'buildNear':
      const nearBricks = player.bricks;
      if (team === 'west') {
        towers.westSide.teamWestHeight += nearBricks;
      } else {
        towers.eastSide.teamEastHeight += nearBricks;
      }
      summary.towerChange = { tower: 'near', amount: nearBricks };
      player.bricks = 0;
      break;

    case 'buildFar':
      if (player.farTowerBuildTurnsRemaining === 0) {
        // Starting build far tower
        player.farTowerBuildTurnsRemaining = 2;
        summary.towerChange = { tower: 'far', amount: 0 };
      } else if (player.farTowerBuildTurnsRemaining === 1) {
        // Completing build far tower
        const farBricks = player.bricks;
        if (team === 'west') {
          towers.eastSide.teamWestHeight += farBricks;
        } else {
          towers.westSide.teamEastHeight += farBricks;
        }
        summary.towerChange = { tower: 'far', amount: farBricks };
        player.bricks = 0;
        player.farTowerBuildTurnsRemaining = 0;
      }
      break;

    case 'observe':
      summary.observeResult = {
        wheelbarrows: opponent.wheelbarrows,
        bricks: opponent.bricks,
        action: 'observe', // Will be updated after both actions are known
      };
      break;
  }

  return summary;
}

// Resolve turn when both players have submitted
function resolveTurn(room) {
  const westAction = room.pendingActions.west?.type;
  const eastAction = room.pendingActions.east?.type;

  if (!westAction || !eastAction) return;

  room.currentTurn += 1;

  // Clear observe results from previous turn
  room.observeResults.west = null;
  room.observeResults.east = null;

  // Get previous tower heights for comparison
  const prevTowers = JSON.parse(JSON.stringify(room.towers));

  // Process west player action
  let westSummary;
  if (room.players.west.farTowerBuildTurnsRemaining > 0 && westAction !== 'buildFar') {
    // Player is locked in buildFar, force it
    room.players.west.farTowerBuildTurnsRemaining -= 1;
    westSummary = processAction('buildFar', room.players.west, room.players.east, 'west', room.towers);
  } else {
    westSummary = processAction(westAction, room.players.west, room.players.east, 'west', room.towers);
    if (westAction === 'buildFar' && room.players.west.farTowerBuildTurnsRemaining > 0) {
      room.players.west.farTowerBuildTurnsRemaining -= 1;
    }
  }

  // Process east player action
  let eastSummary;
  if (room.players.east.farTowerBuildTurnsRemaining > 0 && eastAction !== 'buildFar') {
    // Player is locked in buildFar, force it
    room.players.east.farTowerBuildTurnsRemaining -= 1;
    eastSummary = processAction('buildFar', room.players.east, room.players.west, 'east', room.towers);
  } else {
    eastSummary = processAction(eastAction, room.players.east, room.players.west, 'east', room.towers);
    if (eastAction === 'buildFar' && room.players.east.farTowerBuildTurnsRemaining > 0) {
      room.players.east.farTowerBuildTurnsRemaining -= 1;
    }
  }

  // Handle observe results
  if (westAction === 'observe') {
    room.observeResults.west = {
      wheelbarrows: room.players.east.wheelbarrows,
      bricks: room.players.east.bricks,
      action: eastAction,
    };
    westSummary.observeResult = room.observeResults.west;
  }

  if (eastAction === 'observe') {
    room.observeResults.east = {
      wheelbarrows: room.players.west.wheelbarrows,
      bricks: room.players.west.bricks,
      action: westAction,
    };
    eastSummary.observeResult = room.observeResults.east;
  }

  // Calculate opponent tower changes for summaries
  westSummary.turn = room.currentTurn;
  westSummary.opponentTowerChanges = {
    westSide: room.towers.westSide.teamEastHeight - prevTowers.westSide.teamEastHeight,
    eastSide: room.towers.eastSide.teamEastHeight - prevTowers.eastSide.teamEastHeight,
  };

  eastSummary.turn = room.currentTurn;
  eastSummary.opponentTowerChanges = {
    westSide: room.towers.westSide.teamWestHeight - prevTowers.westSide.teamWestHeight,
    eastSide: room.towers.eastSide.teamWestHeight - prevTowers.eastSide.teamWestHeight,
  };

  // Add to action history
  room.actionHistory.west.push(westSummary);
  room.actionHistory.east.push(eastSummary);

  // Clear pending actions
  room.pendingActions.west = null;
  room.pendingActions.east = null;

  // Check victory
  room.winner = checkVictory(room.towers);
  if (room.winner) {
    room.gameState = 'finished';
  }
}

// Reset room for rematch
function resetRoomForRematch(room) {
  room.gameState = 'playing';
  room.currentTurn = 0;
  room.towers = {
    westSide: {
      teamWestHeight: 5,
      teamEastHeight: 0,
    },
    eastSide: {
      teamWestHeight: 0,
      teamEastHeight: 5,
    },
  };
  room.pendingActions = { west: null, east: null };
  room.observeResults = { west: null, east: null };
  room.winner = null;
  room.actionHistory = { west: [], east: [] };
  room.rematchRequests = { west: false, east: false };

  // Reset player resources
  if (room.players.west) {
    room.players.west.wheelbarrows = 0;
    room.players.west.bricks = 0;
    room.players.west.farTowerBuildTurnsRemaining = 0;
    room.players.west.ready = true;
  }
  if (room.players.east) {
    room.players.east.wheelbarrows = 0;
    room.players.east.bricks = 0;
    room.players.east.farTowerBuildTurnsRemaining = 0;
    room.players.east.ready = true;
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let currentRoom = null;
  let currentTeam = null;

  socket.on('create-room', ({ playerName }) => {
    // Generate unique room code
    let roomCode = generateRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    // Create room
    const room = createRoom(roomCode);
    room.players.west = createPlayer(playerName);
    room.sockets.west = socket.id;
    rooms.set(roomCode, room);

    currentRoom = roomCode;
    currentTeam = 'west';

    socket.join(roomCode);
    socket.emit('room-created', { roomCode, team: 'west' });

    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.east) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    // Add player to room
    room.players.east = createPlayer(playerName);
    room.sockets.east = socket.id;
    room.gameState = 'waiting';

    currentRoom = roomCode;
    currentTeam = 'east';

    socket.join(roomCode);

    // Notify joining player
    socket.emit('room-joined', {
      roomCode,
      team: 'east',
      opponentName: room.players.west.name,
    });

    // Notify existing player
    socket.to(roomCode).emit('player-joined', { opponentName: playerName });

    console.log(`${playerName} joined room ${roomCode}`);
  });

  socket.on('player-ready', () => {
    if (!currentRoom || !currentTeam) return;

    const room = rooms.get(currentRoom);
    if (!room) return;

    room.players[currentTeam].ready = true;

    // Notify all players
    io.to(currentRoom).emit('player-ready', { team: currentTeam });

    // Check if both players are ready
    if (room.players.west?.ready && room.players.east?.ready) {
      room.gameState = 'playing';
      room.currentTurn = 1;

      // Send initial game state to each player
      const westSocket = room.sockets.west;
      const eastSocket = room.sockets.east;

      io.to(westSocket).emit('game-started', {
        gameState: getClientGameState(room, 'west'),
      });

      io.to(eastSocket).emit('game-started', {
        gameState: getClientGameState(room, 'east'),
      });

      console.log(`Game started in room ${currentRoom}`);
    }
  });

  socket.on('submit-action', ({ action }) => {
    if (!currentRoom || !currentTeam) return;

    const room = rooms.get(currentRoom);
    if (!room || room.gameState !== 'playing') return;

    // Check if player is locked in buildFar
    const player = room.players[currentTeam];
    if (player.farTowerBuildTurnsRemaining > 0 && action !== 'buildFar') {
      socket.emit('error', { message: 'You are locked into Build Far Tower' });
      return;
    }

    // Store pending action
    room.pendingActions[currentTeam] = {
      type: action,
      turn: room.currentTurn,
    };

    // Notify opponent that action was submitted
    const opponentTeam = currentTeam === 'west' ? 'east' : 'west';
    const opponentSocket = room.sockets[opponentTeam];
    if (opponentSocket) {
      io.to(opponentSocket).emit('action-submitted', { team: currentTeam });
    }

    console.log(`${currentTeam} submitted action: ${action}`);

    // Check if both players have submitted
    if (room.pendingActions.west && room.pendingActions.east) {
      resolveTurn(room);

      // Send updated state to each player
      if (room.winner) {
        io.to(room.sockets.west).emit('game-over', {
          winner: room.winner,
          finalState: getClientGameState(room, 'west'),
        });
        io.to(room.sockets.east).emit('game-over', {
          winner: room.winner,
          finalState: getClientGameState(room, 'east'),
        });
      } else {
        io.to(room.sockets.west).emit('turn-resolved', {
          gameState: getClientGameState(room, 'west'),
        });
        io.to(room.sockets.east).emit('turn-resolved', {
          gameState: getClientGameState(room, 'east'),
        });
      }

      console.log(`Turn ${room.currentTurn} resolved in room ${currentRoom}`);
    }
  });

  socket.on('request-rematch', () => {
    if (!currentRoom || !currentTeam) return;

    const room = rooms.get(currentRoom);
    if (!room || room.gameState !== 'finished') return;

    room.rematchRequests[currentTeam] = true;

    // Notify opponent
    const opponentTeam = currentTeam === 'west' ? 'east' : 'west';
    const opponentSocket = room.sockets[opponentTeam];
    if (opponentSocket) {
      io.to(opponentSocket).emit('rematch-requested', { team: currentTeam });
    }

    // Check if both players requested rematch
    if (room.rematchRequests.west && room.rematchRequests.east) {
      resetRoomForRematch(room);

      // Send new game state to both players
      io.to(room.sockets.west).emit('rematch-started', {
        gameState: getClientGameState(room, 'west'),
      });
      io.to(room.sockets.east).emit('rematch-started', {
        gameState: getClientGameState(room, 'east'),
      });

      console.log(`Rematch started in room ${currentRoom}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        // Notify the other player
        const opponentTeam = currentTeam === 'west' ? 'east' : 'west';
        const opponentSocket = room.sockets[opponentTeam];
        if (opponentSocket) {
          io.to(opponentSocket).emit('player-disconnected');
        }

        // Clean up room if empty or game not started
        if (room.gameState === 'lobby' || room.gameState === 'waiting') {
          rooms.delete(currentRoom);
          console.log(`Room ${currentRoom} deleted`);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
