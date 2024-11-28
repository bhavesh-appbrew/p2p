const http = require("http");
const express = require("express");

const users = [];

const app = express();
app.use(express.static("public"));

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("register", (data) => {
    console.log(data)
    data = JSON.parse(data);
    console.log("Registering user", data);
    users.push({ socketId: socket.id, id: data.id });
    console.log(users)
  });

  socket.on("signal", (data) => {
    data = JSON.parse(data);
    const target = users.find((user) => user.id === data.target);
    console.log("Sending signal to", target);
    target && io.to(target.socketId).emit("signal", data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    const index = users.findIndex((user) => user.socketId === socket.id);
    users.splice(index, 1);
  });
});
