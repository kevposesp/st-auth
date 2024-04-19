const db = require("../models");
const asyncHandler = require("express-async-handler");
const Role = db.role;
const Permission = db.permission;

const create = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {

        if (await Role.findOne({ where: { name } })) {
            return res.status(400).send({ message: "Role already exists" });
        }

        let role = await Role.create({
            name
        });

        return res.status(201).send({ message: "Role created" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }

});

const readAll = asyncHandler(async (req, res) => {
    try {
        let roles = await Role.findAll();

        return res.status(200).send(roles);

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        let role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }

        role.name = name;
        await role.save();

        return res.status(200).send({ message: "Role updated" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        let role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }

        await role.destroy();

        return res.status(200).send({ message: "Role deleted" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const addOrRemovePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissionId } = req.body;

    if (!permissionId) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        let role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }

        let permission = await Permission.findByPk(permissionId);

        if (!permission) {
            return res.status(404).send({ message: "Permission not found" });
        }
        
        let permissions = await role.getPermissions();
        let permissionIds = permissions.map(permission => permission.id);

        if (permissionIds.includes(permissionId)) {
            await role.removePermission(permission);
        } else {
            await role.addPermission(permission);
        }

        return res.status(200).send({ message: "Permission added" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const roleController = {
    create,
    readAll,
    update,
    remove,
    addOrRemovePermission
};

module.exports = roleController