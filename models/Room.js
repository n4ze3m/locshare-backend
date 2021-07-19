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
        socket: String,
        name: String,
        lat: String,
        lon: String,
      },
    ],
  },
  {
    timestamp: true,
  }
);
const model = mongoose.model("room", RoomSchema);
module.exports = model;
