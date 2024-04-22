const initDb = async (db) => {

    const Role = db.role;
    const Permission = db.permission;
    const User = db.user;

    const st_auth_role = await Role.create({
        name: "st_admin"
    });

    const create_permission = await Permission.create({
        name: "createPermission"
    });

    const read_permission = await Permission.create({
        name: "readPermission"
    });

    const update_permission = await Permission.create({
        name: "updatePermission"
    });

    const delete_permission = await Permission.create({
        name: "deletePermission"
    });

    const create_role = await Permission.create({
        name: "createRole"
    });

    const read_role = await Permission.create({
        name: "readRole"
    });

    const update_role = await Permission.create({
        name: "updateRole"
    });

    const delete_role = await Permission.create({
        name: "deleteRole"
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
        create_role.id,
        read_role.id,
        update_role.id,
        delete_role.id,
        addOrRemoveRole_permission.id,
        addOrRemovePermission_permission.id
    ]);

};

module.exports = initDb;