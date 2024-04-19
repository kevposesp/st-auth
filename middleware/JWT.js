const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const asyncHandler = require("express-async-handler");

const { TokenExpiredError } = jwt

const catchError = asyncHandler((err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }

    return res.status(401).send({ message: "Unauthorized!" });
})

const verifyToken = asyncHandler((req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "err_auth_no_token"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return catchError(err, res)
        }
        req.userId = decoded.id;
        next();
    });
});

const JWT_MIDDLEWARE = {
    verifyToken
};

module.exports = JWT_MIDDLEWARE;