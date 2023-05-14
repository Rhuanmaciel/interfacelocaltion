const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let users = [];

io.on("connection", (socket) => {
  console.log("Novo cliente conectado");
  socket.emit("user_update", users);

  // Handle user registration
  socket.on("register_user", (user) => {
    users.push(user);
    io.emit("user_update", users);
  });

  // Listen for location updates from mobile app
  socket.on("location", (data) => {
    console.log(`Received location update: ${data}`);
    // Re-emit the location update to all connected clients
    io.emit("location_update", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});


server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor WebSocket escutando na porta " + (process.env.PORT || 3000));
});