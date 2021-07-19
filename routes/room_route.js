const express = require("express");
const {
  join_room,
  say_hello,
  create_room,
} = require("../controllers/room_controller");

const route = express.Router();
route.get("/", say_hello).post("/join", join_room).post("/create", create_room);

module.exports = route;
