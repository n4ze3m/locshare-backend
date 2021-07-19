const Room = require("../models/Room");

const joinRoom = async (data) => {
  const { roomId, name, socket, lat, lon } = data;
  Room.findOne({ roomId })
    .then((doc) => {
      doc.members.push({ socket, name, lat, lon });
      doc.save();
    })
    .catch(console.log);
  return roomId;
};

module.exports = {
  joinRoom,
};
