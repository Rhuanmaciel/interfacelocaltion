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

  socket.on("location_update", (data) => {
    const user = users.find((user) => user.token === data.token);
    if (user) {
      console.log(`Recebida atualização de localização de ${user.name}`);
      user.location = data.location;
      io.emit("location_update", user);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor WebSocket escutando na porta " + (process.env.PORT || 3000));
});