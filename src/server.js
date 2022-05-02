import http from "http";
import { Server } from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const weServer = new Server(server);

const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
