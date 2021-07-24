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
    createdAt: { type: Date, default: Date.now, expires: "2d" },
  },
  {
    timestamp: true,
  }
);
const model = mongoose.model("room", RoomSchema);
module.exports = model;
