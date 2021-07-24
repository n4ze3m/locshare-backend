const mongoose = require("mongoose");

const JoinSchema = mongoose.Schema({
    socket: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    room: {
        type: String,
        require: true,
    },
    createdAt: { type: Date, default: Date.now, expires: "1d" },
});

const model = mongoose.model("join", JoinSchema);

module.exports = model;
