const config = require("../config/db.config.js");
const config_auth = require("../config/auth.config.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        port: config.port,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.refreshToken = require("../models/refreshToken.model.js")(
    sequelize,
    Sequelize,
    config_auth
);

db.user = require("../models/user.model.js")(
    sequelize,
    Sequelize,
    jwt,
    config_auth,
    bcrypt,
    db.refreshToken
);

// RefreshToken
db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});

db.sync = (force = false) => {
    db.sequelize.sync(
        {
            force
        }
    ).then(() => {
        console.log(
            `\n\nstAuth\n`,
            `Drop and Resync Db\n`,
            `force drop: ${force}`
        );
    });
};



module.exports = db;