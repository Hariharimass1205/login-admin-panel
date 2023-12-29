//require to use that module r page
const express = require("express");
const app = express();
const nocache = require("nocache");
const session = require("express-session");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter.js");
const adminRouter = require("./router/adminRouter.js");

//calling DB fn to conn in starting stage
const DBconnect = require("./Config/dbconnect.js");
DBconnect();
app.use(nocache());

app.set("view engine", "ejs");
// to read info through req in json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express-session middleware insertion
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//from respective routers
app.use(userRouter);
app.use(adminRouter);

app.listen(3000, () => {
  console.log("server start at 3000");
});
