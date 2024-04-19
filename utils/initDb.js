const initDb = async (db) => {

    const Role = db.role;
    const Permission = db.permission;
    const User = db.user;

    const st_auth_role = await Role.create({
        name: "st_admin"
    });

    const create_permission = await Permission.create({
        name: "create"
    });

    const read_permission = await Permission.create({
        name: "read"
    });

    const update_permission = await Permission.create({
        name: "update"
    });

    const delete_permission = await Permission.create({
        name: "delete"
    });

    const addOrRemoveRole_permission = await Permission.create({
        name: "addOrRemoveRole"
    });

    const addOrRemovePermission_permission = await Permission.create({
        name: "addOrRemovePermission"
    });

    const st_auth = await User.create({
        username: "st_admin",
        email: "st_admin@stauth.com",
        password: "st_admin"
    });

    await st_auth.addRole(st_auth_role.id);
    await st_auth_role.addPermissions([
        create_permission.id,
        read_permission.id,
        update_permission.id,
        delete_permission.id,
        addOrRemoveRole_permission.id,
        addOrRemovePermission_permission.id
    ]);

};

module.exports = initDb;