const asyncHandler = require("express-async-handler");
const db = require("../models");
const User = db.user;

const verifyPermission = (permissions) => {
    return asyncHandler(async (req, res, next) => {
        const userId = req.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(403).send({ message: "User not found!" });
        }

        const userRoles = await user.getRoles();

        let hasRequiredPermission = false;
        for (let i = 0; i < userRoles.length; i++) {
            const userPermissions = await userRoles[i].getPermissions();
            for (let j = 0; j < userPermissions.length; j++) {
                if (permissions.includes(userPermissions[j].name)) {
                    hasRequiredPermission = true;
                    break;
                }
            }
        }

        if (!hasRequiredPermission) {
            return res.status(403).send({ message: "Require " + permissions + " Permission!" });
        }

        next();
    });
};

const PERMISSION_MIDDLEWARE = {
    verifyPermission
};

module.exports = PERMISSION_MIDDLEWARE;