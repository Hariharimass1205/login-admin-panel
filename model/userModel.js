const mongoose = require("mongoose");
//create schema (in which format data will go)
const userSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Phone: Number,
  Password: String,
});

// model is a communicator for DB and node.js
const userModel = mongoose.model("userDB", userSchema);

module.exports = userModel;

