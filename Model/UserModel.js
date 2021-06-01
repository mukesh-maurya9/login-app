const mongoose = require("mongoose");
const col_name = "Users";

const UserSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  password: String,
  about: String,
  image: String,
});

mongoose.model(col_name, UserSchema);
module.exports = mongoose.model(col_name)
