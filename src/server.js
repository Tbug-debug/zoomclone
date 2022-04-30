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

weServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, welcomeRoom) => {
    socket.join(roomName);
    welcomeRoom();
  });
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
