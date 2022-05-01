import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const weServer = SocketIO(server);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = weServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return weServer.sockets.adapter.rooms.get(roomName)?.size;
}

weServer.on("connection", (socket) => {
  weServer.sockets.emit("room_change", publicRooms());
  socket["nickname"] = "Annon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, welcomeRoom) => {
    socket.join(roomName);
    welcomeRoom(countRoom(roomName));
    socket.to(roomName).emit("join", socket.nickname, countRoom(roomName));
    weServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    weServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

/*
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on("connection", (socket) => {
  //여기서의 socket은 브라우저와의 연결을 뜻한다.
  sockets.push(socket);
  socket["nickname"] = "Annon";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (message) => {
    const translatedMessageData = message.toString("utf8");
    const parsed = JSON.parse(translatedMessageData);
    switch (parsed.type) {
      case "new_mesage":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${parsed.payload}`)
        );
        break;
      case "nickName":
        socket["nickname"] = parsed.payload;
        break;
    }
  });
});
*/
server.listen(3000, handleListen);
