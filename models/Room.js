const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema(
  {
    createdBy: String,
    roomId: {
      type: String,
      unique: true,
      require: true,
    },
    members: [
      {
        name: String,
        socketId: String,
        position: [],
      },
    ],
  },
  {
    timestamp: true,
  }
);
const model = mongoose.model("room", RoomSchema);
module.exports = model;
