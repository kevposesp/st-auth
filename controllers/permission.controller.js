const db = require("../models");
const asyncHandler = require("express-async-handler");
const Permission = db.permission;

const create = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {

        if (await Permission.findOne({ where: { name } })) {
            return res.status(400).send({ message: "Permission already exists" });
        }

        let permission = await Permission.create({
            name
        });

        return res.status(201).send({ message: "Permission created" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const readAll = asyncHandler(async (req, res) => {
    try {
        let permissions = await Permission.findAll();

        return res.status(200).send(permissions);

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
        let permission = await Permission.findByPk(id);

        if (!permission) {
            return res.status(404).send({ message: "Permission not found" });
        }

        permission.name = name;
        await permission.save();

        return res.status(200).send({ message: "Permission updated" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        let permission = await Permission.findByPk(id);

        if (!permission) {
            return res.status(404).send({ message: "Permission not found" });
        }

        await permission.destroy();

        return res.status(200).send({ message: "Permission deleted" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

const permissionController = {
    create,
    readAll,
    update,
    remove
};

module.exports = permissionController