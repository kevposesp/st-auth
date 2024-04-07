const {
  profile,
  login,
  register,
  update
} = require("../controllers/user.controller");

const { verifyToken } = require("../middleware/JWT");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/user",
    [
      verifyToken
    ],
    profile
  );

  app.post(
    "/user/login",
    [],
    login
  );

  app.post(
    "/user/register",
    [],
    register
  );

  app.put(
    "/user/update",
    [
      verifyToken
    ],
    update
  );

}