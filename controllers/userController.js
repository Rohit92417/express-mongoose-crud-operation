//password encryp and decryp
const CryptoJS = require("crypto-js");
//User database model
const User = require("../models/user");
const JWT = require("jsonwebtoken");

//Register
exports.create = async (req, res) => {
  var checkPasswordLenght = req.body.password;
  if (checkPasswordLenght.length <= 15 && checkPasswordLenght.length >= 8) {
    try {
      var pass = checkPasswordLenght
      const createNewUser = await new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString(),
        address: req.body.address,
      }).save();
      res
        .status(201)
        .json({ createNewUser, message: "User create successfully" });
    } catch (error) {
      res.status(500).json({
        error,
        message: "Something went wrong",
      });
    }
  } else {
    res
      .status(400)
      .json("password length must be 8 character and maximum 15 character");
  }
};
//Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Email address is wrong");
    }
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    originalText !== req.body.password &&
      res.status(401).json("Password is wrong");

    const accessToken = JWT.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const { password, ...info } = user._doc;
    res.status(200).json({ info, accessToken });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
//Update
exports.edit = async (req, res) => {
  const id = req.params.id;
  if (id === req.user.id) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      await User.findByIdAndUpdate(id, { $set: req.body }, { $new: true });
      res.status(202).json({ message: "User update successfully" });
    } catch (error) {
      res.status(500).json({
        error,
        message: "Something went wrong",
      });
    }
  } else {
    res
      .status(401)
      .json({ message: "you are not authenticate to update in this account" });
  }
};
//Delete
exports.delete = async (req, res) => {
  const id = req.params.id;
  if (id === req.user.id) {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User is deleted" });
    } catch (error) {
      res.status(500).json({
        error,
        message: "Something went wrong",
      });
    }
  } else {
    res
      .status(401)
      .json({ message: "you are not authenticate to delete in this account" });
  }
};
//Views All
exports.view = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Something went wrong",
    });
  }
};
