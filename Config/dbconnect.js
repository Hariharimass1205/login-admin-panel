// to connect DB and create(LoginDB) the db
const mongoose = require("mongoose");

const DBconnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hariharimass1205:Hariharan04@cluster0.dve9hja.mongodb.net/Project1"
    );
    console.log("successfully connected to database");
  } catch (err) {
    console.log(err);
  }
};
module.exports = DBconnect;
