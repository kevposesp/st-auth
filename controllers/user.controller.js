const db = require("../models");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

const User = db.user;

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

module.exports = {
  login,
  register
};
