const Room = require("../models/Room");
const Join = require("../models/Join");

const joinRoom = async (data) => {
  const { roomId, name, socket, lat, lon } = data;
  if (name.trim() !== "") {
    await Room.updateOne(
      { roomId },
      {
        $push: {
          members: { socket, name, lat, lon },
        },
      }
    );
    const join = Join({ socket, room: roomId });
    await join.save();
  }

  return roomId;
};

const findFriends = async (roomId) => {
  const friends = await Room.findOne({ roomId });
  return friends.members;
};

const updatePosition = async (data) => {
  try {
    const { socket, lat, lon } = data;
    const join = await Join.findOne({ socket }).exec();
    if (!join) {
      return null;
    }
    const { room } = join;
    await Room.updateOne(
      { roomId: room, "members.socket": socket },
      {
        $set: {
          "members.$.lat": lat,
          "members.$.lon": lon,
        },
      }
    );
    return room;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

const onLeave = async (socket) => {
  try {
    const join = await Join.findOne({ socket }).exec();
    if (!join) {
      return null;
    }
    const { room } = join;
    await Room.updateOne(
      { roomId: room },
      {
        $pull: {
          members: { socket },
        },
      }
    );
    // await join.remove();
    return room;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = {
  joinRoom,
  findFriends,
  updatePosition,
  onLeave,
};
