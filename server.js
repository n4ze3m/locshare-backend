const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const {
  joinRoom,
  findFriends,
  onLeave,
  updatePosition,
} = require("./utils/room");

const PORT = process.env.PORT || 8172;
const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/geo";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  return res.send("eee...");
});

readdirSync("./routes").map((file) =>
  app.use("/api", require(`./routes/${file}`))
);



const main = async () => {
  const server = http.createServer(app);
  const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.emit("connection", socket.id);
    // join
    socket.on("join", async ({ data }) => {
      const { name, roomId, lat, lon } = data;
      const room = await joinRoom({ socket: socket.id, name, roomId, lat, lon });

      socket.join(room);

      socket.broadcast
        .to(room)
        .emit("notifications", `${name} has joined the room`);

      const friends = await findFriends(room);

      io.to(room).emit("friends", friends);
    });
    // chat room
    socket.on("message", async ({ data }) => {
      const { room } = data;
      io.to(room).emit("message", data);
    });

    // update
    socket.on("update", async ({ data }) => {
      const { lat, lon } = data;
      await updatePosition({ socket: socket.id, lat, lon })
        .then(async (room) => {
          if (room) {
            const friends = await findFriends(room);
            console.log("friends", friends);
            io.to(room).emit("friends", friends);
          }
        })
        .catch(console.log);
    });

    // disconnect
    socket.on("disconnect", async () => {
      onLeave(socket.id)
        .then(async (room) => {
          if (room) {
            const friends = await findFriends(room.room);
            io.to(room.room).emit(
              "notifications",
              `${room.name} has left the room`
            );
            io.to(room.room).emit("friends", friends);
          }
        })
        .catch(console.log);
    });
  });
  mongoose
    .connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log(`🌍 Database connected`);
      server.listen(PORT, () => {
        console.log(`🚀 server running at http://localhost:${PORT}`);
      });
    })
    .catch(console.log);
}

main();