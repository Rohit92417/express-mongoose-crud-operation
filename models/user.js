const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 15,
    required: [true, "Enter first name"],
  },
  last_name: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 15,
    required: [true, "Enter last name"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true,"email address already exist"],
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
  },
  address: { type: String, required: [true, "Enter full address"] },
  
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
