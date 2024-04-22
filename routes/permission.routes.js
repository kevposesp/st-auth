const {
    create,
    readAll,
    update,
    remove
} = require("../controllers/permission.controller");

const { verifyToken } = require("../middleware/JWT");
const { verifyPermission } = require("../middleware/PERMISSION");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/permission/create",
        [
            verifyToken,
            verifyPermission(["createPermission"])
        ],
        create
    );

    app.get(
        "/permission/all",
        [
            verifyToken,
            verifyPermission(["readPermission"])
        ],
        readAll
    );

    app.put(
        "/permission/update/:id",
        [
            verifyToken,
            verifyPermission(["updatePermission"])
        ],
        update
    );

    app.delete(
        "/permission/delete/:id",
        [
            verifyToken,
            verifyPermission(["deletePermission"])
        ],
        remove
    );

}