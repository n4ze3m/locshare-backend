const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const { MONGO } = require("./config");

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
  console.log("user connected", socket.id);
  socket.emit("connection", null);
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
