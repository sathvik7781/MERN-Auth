const mongoose = require("mongoose");
const userData = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  mobileNumber: String,
  address: String,
  gender: String,
});
module.exports = mongoose.model("user", userData);
