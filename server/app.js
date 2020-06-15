//REQUIRED PACKAGES
const express = require ('express');
const morgan =  require('morgan');
const path = require('path');
const { createServer } = require('http');
const WebSocket = require('ws');
const db = require('./db/models');
const cors = require("cors");
const { Game, Player } = require('./game-state');

const { port } = require('./config/index');
const usersRouter = require('./routes/users');
const pokemonRouter = require('./routes/pokemon')

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: "http://localhost:3000" }));
//app.use(cors());
// app.use(cors( {origin} ));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/users", usersRouter);
app.use("/pokemon", pokemonRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = createServer(app);

// CREATE WEBSOCKET CONNECTION
const ws = new WebSocket.Server({ server });
let game = null;

//WS BROADCAST BELOW
const broadcastMessage = (type, data, players) => {
  const message = JSON.stringify({ type, data, });
  
  console.log(`Broadcasting message ${message}...`);

  players.forEach((player) => {
    player.ws.send(message, (err) => {
      if (err) { console.error(err);}
    });
  });
};

//GAME FUNCTIONS BELOW
const startGame = () => {
  const data = game.getData();
  data.statusMessage = `Pick an Active Pokemon ${game.currentPlayer.playerName}!`;
  broadcastMessage('start-game', data, game.getPlayers());
};


const addNewPlayer = (playerName, ws) => {
  const player = new Player(playerName, ws);

  if (game === null) {
    game = new Game(player);
  } else if (game.player2 === null) {
    game.player2 = player;
    startGame();
  } else {
    // TODO Ignore any additional player connections.
    console.log(`Ignoring player ${playerName}...`);
    ws.close();
  }
};

const sendChat = (message) => {
  const addChatMessage = {
      type: "add-chat-message",
      data: message,
  };
  const jsonAddChatMessage = JSON.stringify(addChatMessage);
    console.log(`Sending message ${jsonAddChatMessage}...`);

    ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonAddChatMessage);
      }
    });
};

const endGame = () => {
  const players = game.getPlayers();
  const data = game.getData();
  data.statusMessage = game.gameOverMessage;
  broadcastMessage('end-game', data, players);
};

const updateGame = () => {
  const players = game.getPlayers();
  const data = game.getData();
  data.statusMessage = `Chose a Pokmove ${game.currentPlayer.playerName}!`;
  broadcastMessage('update-game', data, players);
};


//WS INCOMING BELOW
const processIncomingMessage = (jsonData, ws) => {
  console.log(`Processing incoming message ${jsonData}...`);

  const message = JSON.parse(jsonData);
  console.log(game);
  switch (message.type) {
    case 'add-new-player':
      addNewPlayer(message.data, ws);
      break;
    case 'handle-game-move':
      //TODO
      break;
    case 'send-chat-message':
      sendChat(message.data);
      break;
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
};



// WS ON BELOW
ws.on('connection', (ws) => {
  ws.on('message', (jsonData) => {
    processIncomingMessage(jsonData, ws);
  });

  ws.on('close', () => {
    
    if (game !== null) {
      const { player1, player2 } = game;

      if (player1.ws === ws || (player2 !== null && player2.ws === ws)) {
    
        if (player1.ws !== ws) {
          player1.ws.close();
        } else if (player2 !== null) {
          player2.ws.close();
        }
        game = null;
      }
    }
  });
});

// wss.on("connection", (ws) => {
//   ws.on("message", (jsonData) => {
//     console.log(`Processing incoming message ${jsonData}...`);

//     const message = JSON.parse(jsonData);
//     const chatMessage = message.data;
    
//     const addChatMessage = {
//       type: "add-chat-message",
//       data: chatMessage,
//     };
//     const jsonAddChatMessage = JSON.stringify(addChatMessage);
//     console.log(`Sending message ${jsonAddChatMessage}...`);

//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(jsonAddChatMessage);
//       }
//     });
//   });

//   ws.on("close", (e) => {
//     console.log("Closing socket:", e);
//   });
// });

// TEST DATABASE CONNECTION AND THEN START UP SERVER
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection success! Sequelize is ready to use...");

    server.listen(port, () => console.log(`Listening on localhost:${port}`));
  })
  .catch((err) => {
    console.log("Database connection failure.");
    console.error(err);
  });
