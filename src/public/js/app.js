const socket = new WebSocket(`ws://${window.location.host}`);
//여기서의 socket은 서버와의 연결을 뜻한다.

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

setTimeout(() => {
  socket.send("Hello from the browser!");
}, 10000);
