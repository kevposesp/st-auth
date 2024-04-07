const db = require("./models");

const routes = (app) => {
    require("./routes/user.routes")(app);
}

const stAuth = {
    dbSync: db.sync,
    routes
}

module.exports = stAuth