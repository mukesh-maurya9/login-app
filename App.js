const express = require("express");
const App = express();
const db = require("./db");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const AuthController = require("./Auth/AuthController");
const path = require("path");
const hbs = require("hbs");

App.use(cors());
App.use(express.json())
App.use("/auth", AuthController);

// static path
const staticPath = path.join(__dirname, "./public");
const templatesPath = path.join(__dirname, "./View");

App.set("view engine", "hbs");
App.set("views", templatesPath);
App.use(express.static(staticPath));

App.get("/", (req, res) => {
  res.send("<h2>Server is Up and running</h2>");
});

App.listen(PORT, () => {
  console.log("Server is running @ http://localhost:" + PORT);
});
