require("dotenv").config();
const express = require("express");
const massive = require("massive");
const { getRandomUrl } = require("./controllers/gameController");
const { Game } = require("./model/Game");
const SocketResponse = require("./model/SocketResponse");
const session = require("express-session");

const SERVER_PORT = 5051;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// massive(process.env.CONNECTION_STRING).then(dbInstance => {
//   app.set("db", dbInstance);
//   console.log("database connected");
// });

//middleware
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: true,
  secret: "superSecret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: false
  },
  store: null
});
// app.use(express.json());
app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});

//server endpoints
// app.get("/server/game/:room", getGame);

// app.post("/server/game", createNewGame);

// app.put("/server/name", setName);

app.post("/server/cookie", (req, res) => {
  if (req.session) {
    res.sendStatus(200);
  } else {
    req.session = {};
    res.sendStatus(200);
  }
});

//socket.io
const games = [new Game("/pp", 4)];

io.on("connection", socket => {
  let cookies = socket.handshake.headers.cookie;
  const cookiesObj = cookies
    ? cookies.split(" ").reduce((acc, val) => {
        const eachCookie = val.split("=");
        return {
          ...acc,
          [eachCookie[0]]: eachCookie[1]
        };
      }, {})
    : {};

  socket.on("newGame", data => {
    let url = getRandomUrl();
    const urls = games.map(val => val.url);
    while (urls.includes(url)) {
      url = getRandomUrl();
    }
    games.push(new Game(url, +data.numPlayers));
    socket.emit("newGameResponse", { url: "/game" + url });
  });

  socket.on("roomJoin", data => {
    let currGameIndex = games.findIndex(val => val.url === `/${data.url}`);
    let sid = cookiesObj[`connect.sid`];
    if (currGameIndex < 0) {
      socket.emit(
        "roomJoinResponse",
        new SocketResponse(undefined, "ROOM_NOT_FOUND")
      );
    } else {
      const playerIndex = games[currGameIndex].players.findIndex(
        val => val.id === sid
      );
      if (playerIndex < 0) {
        if (data.name === undefined) {
          socket.emit(
            "roomJoinResponse",
            new SocketResponse(undefined, "PLEASE_ENTER_NAME")
          );
        } else {
          games[currGameIndex].addPlayer(sid, data.name);
          socket.broadcast.emit(
            "roomJoinResponse",
            new SocketResponse(games[currGameIndex], undefined, sid)
          );
          socket.emit(
            "roomJoinResponse",
            new SocketResponse(games[currGameIndex], undefined, sid)
          );
        }
      } else {
        socket.emit(
          "roomJoinResponse",
          new SocketResponse(games[currGameIndex], undefined, sid)
        );
      }
    }
  });

  socket.on("dieRoll", data => {
    let currGameIndex = games.findIndex(val => val.url === `${data.url}`);
    games[currGameIndex].updateDieValue(data.id, data.value);
    socket.broadcast.emit(
      "dieRollResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );

    socket.emit(
      "dieRollResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );
  });

  socket.on("dieMove", data => {
    let currGameIndex = games.findIndex(val => val.url === `${data.url}`);
    console.log(data);
    games[currGameIndex].updateDiePosition(data.id, data.x, data.y);

    socket.broadcast.emit(
      "dieMoveResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );
    socket.emit(
      "dieMoveResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );
  });

  socket.on(`bringDieToFront`, data => {
    let currGameIndex = games.findIndex(val => val.url === `/${data.url}`);
    games[currGameIndex].bringDieToFront(data.id);
    console.log("here");

    socket.broadcast.emit(
      "bringDieToFrontResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );

    socket.emit(
      "bringDieToFrontResponse",
      new SocketResponse({
        game: games[currGameIndex],
        url: data.url
      })
    );
  });

  socket.on("setText", data => {
    let currGameIndex = games.findIndex(val => val.url === `${data.url}`);
    games[currGameIndex].setText(data.text);

    socket.broadcast.emit(
      "setTextResponse",
      new SocketResponse({
        text: data.text
      })
    );
  });
});

server.listen(SERVER_PORT, () =>
  console.log(`Listening on Port ${SERVER_PORT}`)
);
