const db = require("../models");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

const verifyEmail = require("../utils/existsEmail");
const verifyUsername = require("../utils/existsUsername");

const User = db.user;

const profile = asyncHandler(async (req, res) => {

  try {
    let user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user.toResponse());

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

});

const login = asyncHandler(async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {

    let _user = await User.findOne({
      where: {
        [Op.or]: [
          { username: user },
          { email: user }
        ]
      }
    });

    if (!_user) return res.status(404).send({ message: "User not found" });
    if (!_user.enableLog) return res.status(401).send({ message: "User is disabled" });

    let passwordIsValid = _user.validatePassword(password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    res.status(200).send(await _user.toLoginResponse());

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

});

const register = asyncHandler(async (req, res) => {
  const {
    name = null,
    email,
    address = null,
    note = null,
    phone = null,
    secondPhone = null,
    username,
    password,
    enableLog = true,
    status = 1
  } = req.body;


  if (!username || !email || !password) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {

    let user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }

    user = await User.create({
      name,
      email,
      address,
      note,
      phone,
      secondPhone,
      username,
      password,
      enableLog,
      status
    });

    res.status(200).send({ message: "User created", user: user.toResponse() });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

});

const update = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    address,
    note,
    phone,
    secondPhone,
    username,
    enableLog,
    status
  } = req.body;

  try {
    let user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (email !== undefined && email !== user.email) {

      if (await verifyEmail(email)) {
        res.status(400).send({ message: "Email already in use" })
      }

      user.email = email;
      
    }

    if (username !== undefined && username !== user.username) {

      if (await verifyUsername(username)) {
        res.status(400).send({ message: "Username already in use" })
      }

      user.username = username;

    }

    if (name !== undefined) user.name = name;
    if (address !== undefined) user.address = address;
    if (note !== undefined) user.note = note;
    if (phone !== undefined) user.phone = phone;
    if (secondPhone !== undefined) user.secondPhone = secondPhone;
    if (enableLog !== undefined) user.enableLog = enableLog;
    if (status !== undefined) user.status = status;

    await user.save();

    res.status(200).send({ message: "User updated", user: user.toResponse() });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

});

module.exports = {
  profile,
  login,
  register,
  update
};
