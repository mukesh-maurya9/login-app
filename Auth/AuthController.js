const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Users = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const config = require("../config");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// getAll User
router.get("/users", (req, res) => {
  Users.find({}, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// signup by fresh account
router.post("/signup", (req, res) => {
  console.log("email", req.body.email);
  Users.findOne({ email: req.body.email }, (err, data) => {
    if (err) throw err;
    else if (!data) {
      let hashPassword = bcrypt.hashSync(req.body.password, 8);
      Users.create(
        {
          fName: req.body.fName,
          lName: req.body.lName,
          email: req.body.email,
          password: hashPassword,
          about: req.body.about,
          image: req.body.image,
        },
        (err, data) => {
          if (err) throw err;
          res.redirect("/auth/users");
        }
      );
    } else {
      res.redirect(
        "/auth/signup?alert=User already exist. Try with another one."
      );
    }
  });
});

// Login by existing account
router.post("/login", (req, res) => {
  console.log("email", req.body.email);
  Users.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, alert: "Error while login.. try again!" });
    }
    if (data) {
      const validPass = bcrypt.compareSync(req.body.password, data.password);
      if (!validPass) {
        res.redirect("/auth/login?alert=Password is incorrect. Try again.");
      } else {
        var accessToken = jwt.sign({ id: data._id }, config.mySecret, {
          expiresIn: 36000,
        });
        res.status(200).send({ auth: true, userInfo: data });
      }
    } else {
      return res.redirect("/auth/login?alert=Invalid password!! Try again.");
    }
  });
});

// profile with jwt token
router.get("/profile", (req, res) => {
  var token = req.headers["x-access-token"];
  if (!token) res.send({ auth: false, token: "No Token Provided" });
  jwt.verify(token, config.mySecret, (err, result) => {
    if (err)
      return res.status(500).send({ auth: false, Error: "invalid token" });
    Users.findById(result.id, { password: 0 }, (err, result) => {
      return res.status(200).json(result);
    });
  });
});

// ***** Get Request **
router.get("/login", (req, res) => {
  let alert = req.query.alert ? req.query.alert : "";
  return res.render("Login", { alert: alert });
});
router.get("/signup", (req, res) => {
  let alert = req.query.alert ? req.query.alert : "";
  return res.render("Signup", { alert: alert });
});

module.exports = router;
