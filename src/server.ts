import dotenv from "dotenv"
dotenv.config();
import mongoose, { ConnectOptions } from "mongoose";
import { cloudinaryConfig } from "./utils/upload";

cloudinaryConfig();
import app from "./app";
import server from "http"

const io = from "socket.io")(server, {
  cors: {
    origin: "*"
  }
});


mongoose
  .connect(process.env.DB_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }as ConnectOptions)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = socketId => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = userId => {
  return users.find(user => user.userId === userId);
};

io.on("connection", socket => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", userId => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const port = process.env.PORT || 3000;
server.createServer(app).listen(port, () => {
  console.log(`Listening from port ${port}`);
});
