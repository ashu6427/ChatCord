const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
// const users = require("./utils/users");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

//static files
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord";

//run when client is connected
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to CharCord"));

    //Runs in chatcord when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has Joined the room`)
      );

    //sends user and room information
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, message));
  });

  //Runs when disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} left the chat room`)
      );
    }

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getCurrentUser(user.room),
    });
  });
});

server.listen(PORT, () => {
  console.log("server is listening on port 3000");
});
