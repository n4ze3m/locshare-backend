const Room = require("../models/Room");

const joinRoom = async (data) => {
  const { roomId, name, socket, lat, lon } = data;
  if (name && roomId && socket && lat && lon) {
    Room.findOne({ roomId })
      .then((doc) => {
        doc.members.push({ socket, name, lat, lon });
        doc.save();
      })
      .catch(console.log);
  }

  return roomId;
};

const findFriends = async (roomId) => {
  const friends = await Room.findOne({ roomId });
  return friends.members;
};

module.exports = {
  joinRoom,
  findFriends,
};
