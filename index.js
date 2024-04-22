const db = require("./models");
const { verifyToken } = require("./middleware/JWT");
const { verifyPermission } = require("./middleware/PERMISSION");

const routes = (app) => {
    require("./routes/user.routes")(app);
    require("./routes/role.routes")(app);
    require("./routes/permission.routes")(app);
}

const stAuth = {
    dbSync: db.sync,
    routes,
    verifyToken,
    verifyPermission
}

module.exports = stAuth