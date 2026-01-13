# Tower Race - Multiplayer Tower Building Game

A real-time multiplayer tower building race game built with React, TypeScript, and Socket.io.

## Game Overview

Two players compete to build their towers taller than their opponent's. Each player has two towers (near and far) and must manage resources strategically while keeping their actions hidden from their opponent.

### Victory Condition

Win by having **BOTH** of your towers taller than **BOTH** of your opponent's towers.

### Player Actions

1. **Gather Wheelbarrow** - +1 wheelbarrow (multiplies brick gathering)
2. **Gather Bricks** - Gain bricks equal to your wheelbarrow count
3. **Build Near Tower** - Spend all bricks to build your near tower (instant)
4. **Build Far Tower** - Spend all bricks to build your far tower (takes 2 turns)
5. **Observe** - Spy on opponent's resources and current action

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server && npm install && cd ..
```

### Running the Game

Start both server and client with a single command:
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the frontend
npm run dev
```

The game will be available at `http://localhost:5173`

## How to Play

1. Enter your name and create a game or join with a room code
2. Share the room code with a friend
3. Both players click "Ready" to start
4. Each turn, choose an action and submit
5. Watch the towers grow and strategize to win!

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **Build Tool**: Vite

## Project Structure

```
TowerGame/
├── src/
│   ├── components/
│   │   ├── game/          # Game UI components
│   │   └── lobby/         # Lobby UI components
│   ├── context/           # React context providers
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main app component
├── server/
│   └── index.js           # Socket.io server
└── package.json
```
