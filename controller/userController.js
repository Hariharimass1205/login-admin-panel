const userModel = require("../model/userModel.js");
const session = require("express-session");
const bcrypt = require("bcrypt");

const getLoginfn = async (req, res) => {
  if (req.session.islogin) {
    const userInfo = req.session.userInfos;
    res.render("userPages/userhome", { userInfo });
  } else {
    res.render("userPages/userlogin", {
      success: req.session.success,
      notValid: req.session.notValid,
    });
    req.session.success = false;
    req.session.save();
  }
};

const loginfn = async (req, res) => {
  try {
    const { Phone, Password } = req.body;

    if (Phone == "") {
      req.session.notValid = true;
      res.redirect("/");
    }
    if (Password == "") {
      req.session.notValid = true;
      res.redirect("/");
    }
    const foundUser = await userModel.findOne({ Phone });
    let passwordMatch;

    if (foundUser) {
      passwordMatch = await bcrypt.compare(Password, foundUser.Password);
    }

    if (!foundUser || !passwordMatch) {
      req.session.notValid = true;
      res.redirect("/");
    } else {
      req.session.islogin = true;
      req.session.save();
      req.session.user = foundUser;
      const Phone = req.body.Phone;
      const userInfo = await userModel.findOne({ Phone: Phone });
      req.session.userInfos = userInfo;
      res.render("userPages/userhome", { userInfo });
    }
  } catch (error) {
    console.log(error);
  }
};

const userhomefn = (req, res) => {
  req.session.islogin = true;
  req.session.success = false;
  res.render("userPages/userhome");
};
const usersignupfn = async (req, res) => {
  let checkuser = await userModel.findOne({ Email: req.body.Email });
  if (!checkuser) {
    let encrypted = await bcrypt.hash(req.body.Password, 10);
    let newUserdetails = await new userModel({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Password: encrypted,
    }).save();
    req.session.success = true;
    res.redirect("/");
    console.log(newUserdetails);
  } else {
    res.render("userPages/userlogin", { emailExists: true });
  }
};

const userlogoutfn = (req, res) => {
  req.session.islogin = false;
  res.redirect("/");
};

//make connection with router
module.exports = {
  getLoginfn,
  loginfn,
  userhomefn,
  usersignupfn,
  userlogoutfn,
};
