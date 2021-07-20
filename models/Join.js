const mongoose = require("mongoose");

const JoinSchema = mongoose.Schema({
    socket: {
        type: String,
        require: true
    },
    room: {
        type: String,
        require: true
    }
});

const model = mongoose.model("join", JoinSchema);

module.exports = model;