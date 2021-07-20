const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const { MONGO } = require("./config");
const {
  joinRoom,
  findFriends,
  onLeave,
  updatePosition,
} = require("./utils/room");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  return res.send("Locshare backend running...");
});

readdirSync("./routes").map((file) =>
  app.use("/api", require(`./routes/${file}`))
);

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
    const friends = await findFriends(room);
    io.to(room).emit("friends", friends);
  });

  // update
  socket.on("update", async ({ data }) => {
    console.log(data);
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
          const friends = await findFriends(room);
          io.to(room).emit("friends", friends);
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
