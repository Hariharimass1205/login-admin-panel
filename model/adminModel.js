const mongoose = require("mongoose");
//create schema (in which format data will go)
const adminSchema = new mongoose.Schema({
  Email: String,
  Password: String,
});

// model is a communicator for DB and node.js
const adminModel = mongoose.model("adminDbs", adminSchema);

module.exports = adminModel;
