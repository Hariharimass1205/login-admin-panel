const userModel = require("../model/userModel");
const session = require("express-session");
const adminModel = require("../model/adminModel");
const bcrypt = require("bcrypt");
//
const adminloginfn = async (req, res) => {
  //let exsit = await adminModel.find({ Email: req.body.Email });
  if (req.session.isadmin) {
    let userInfo = await userModel.find({});
    res.render("adminPages/adminhome", { userInfo });
  } else {
    res.render("adminPages/adminlogin", {
      invalid: req.session.notadminlogin,
    });
  }
};
//here we getting info from db and passing as obj
const adminhomefn = async (req, res) => {
  const exsit = await adminModel.findOne({});
  if (exsit.Email == req.body.Email && exsit.Password == req.body.Password) {
    let userInfo = await userModel.find({});
    req.session.isadmin = true;
    res.render("adminPages/adminhome", { userInfo });
  } else {
    req.session.notadminlogin = true;
    res.redirect("/adminlogin");
  }
};

const adminedituserfn = async (req, res) => {
  const id = req.query.id;
  const alreadyexsit = await userModel.findOne({ _id: id });
  // console.log("editing in ", alreadyexsit);
  res.render("adminPages/editUser", { alreadyexsit });
};

const adminsaveduserfn = async (req, res) => {
  try {
    const updateduser = await userModel.updateOne(
      { Email: req.body.Email },
      {
        $set: {
          Name: req.body.Name,
          Email: req.body.Email,
          Phone: req.body.Phone,
        },
      }
    );
    // res.redirect("/adminhome");
    let userInfo = await userModel.find({});
    res.render("adminPages/adminhome", { userInfo });
  } catch (error) {
    console.log(error);
  }
};
const admindeleteuserfn = async (req, res, next) => {
  console.log("delete page in");
  try {
    const id = req.query.id;
    console.log(id);
    await userModel.findByIdAndDelete({ _id: id });
    const userInfo = await userModel.find({});
    console.log(userInfo);
    res.render("adminPages/adminhome", { userInfo });
  } catch (error) {
    console.log("error in deleting data", error);
  }
};
const adminaddUser = async (req, res) => {
  console.log("aaaa");
  const encryptedPassword = bcrypt.hashSync(req.body.Password, 10);
  const newUser = new userModel({
    Name: req.body.Name,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Password: encryptedPassword,
  });
  console.log(newUser);
  const checkEmail = await userModel.findOne({ email: req.body.Email });
  if (checkEmail) {
    res.send("Email already exists");
  } else {
    console.log("bbbb");
    newUser.save();
    const userInfo = await userModel.find({});
    res.render("adminPages/adminhome", { userInfo });
  }
};
const adminsearch = async (req, res) => {
  var search = req.body.search;
  var searchedUser = await userModel.find({
    $or: [{ Name: { $regex: search, $options: "i" } }],
  });
  if (searchedUser.length == 0) {
    req.session.search = null;
  }
  req.session.search = searchedUser;
  const userInfo = searchedUser;
  res.render("adminPages/adminHome", { userInfo });
};

const adminlogoutfn = (req, res) => {
  req.session.notadminlogin = false;
  req.session.isadmin = false;
  res.redirect("/adminlogin");
};

module.exports = {
  adminloginfn,
  adminhomefn,
  adminlogoutfn,
  adminedituserfn,
  adminsaveduserfn,
  admindeleteuserfn,
  adminaddUser,
  adminsearch,
};
