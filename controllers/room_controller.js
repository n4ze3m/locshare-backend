const Room = require("../models/Room.js");
const CryptoJS = require("crypto-js");

exports.say_hello = (req, res) => {
  return res.send("hello..");
};
// https://stackoverflow.com/questions/40588709/how-to-remove-object-from-array-using-mongoose
exports.join_room = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).send({ message: "Room Id required" });
    }
    const room = await Room.findOne({ roomId }).exec();

    if (!room) {
      return res.status(404).send({ message: "Invalid room id" });
    }

    if (room.members.length === 10) {
      return res.status(403).send({ message: "Sorry, room is full" });
    }
    return res.send({ ok: true, message: "ok" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.create_room = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Username required" });
    }
    const timestamp = Number(new Date());
    const roomId = CryptoJS.MD5(`${name}-${timestamp}-buckthorn`).toString(
      CryptoJS.enc.Hex
    );
    const room = Room({
      roomId,
      createdBy: name,
      members: [],
    });
    await room.save();
    return res.send({ room });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
