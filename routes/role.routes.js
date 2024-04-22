const {
    create,
    readAll,
    update,
    remove,
    addOrRemovePermission
} = require("../controllers/role.controller");

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
        "/role/create",
        [
            verifyToken,
            verifyPermission(["createRole"])
        ],
        create
    );

    app.get(
        "/role/all",
        [
            verifyToken,
            verifyPermission(["readRole"])
        ],
        readAll
    );

    app.put(
        "/role/update/:id",
        [
            verifyToken,
            verifyPermission(["updateRole"])
        ],
        update
    );

    app.delete(
        "/role/delete/:id",
        [
            verifyToken,
            verifyPermission(["deleteRole"])
        ],
        remove
    );

    app.post(
        "/role/addOrRemovePermission/:id",
        [
            verifyToken,
            verifyPermission(["addOrRemovePermission"])
        ],
        addOrRemovePermission
    )

}