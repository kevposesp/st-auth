const config_auth = require("../config/auth.config.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Sequelize, sequelize } = require("../config/connection.sequelize");

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

db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.permission = require("../models/permission.model.js")(sequelize, Sequelize);

// RefreshToken
db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});

// Role
db.role.belongsToMany(db.permission, {
    through: "st_auth_role_permission",
    as: "permissions",
    foreignKey: "roleId",
    otherKey: "permissionId",
    onDelete: 'CASCADE'
});

db.permission.belongsToMany(db.role, {
    through: "st_auth_role_permission",
    as: "roles",
    foreignKey: "permissionId",
    otherKey: "roleId",
    onDelete: 'CASCADE'
});

// User roles
db.user.belongsToMany(db.role, {
    through: "st_auth_user_roles",
    as: "roles",
    foreignKey: "userId",
    otherKey: "roleId",
    onDelete: 'CASCADE'
});

db.role.belongsToMany(db.user, {
    through: "st_auth_user_roles",
    as: "users",
    foreignKey: "roleId",
    otherKey: "userId",
    onDelete: 'CASCADE'
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
        force ? require("../utils/initDb")(db) : null;
    });
};

module.exports = db;