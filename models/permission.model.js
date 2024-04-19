module.exports = (
    sequelize,
    Sequelize
) => {
    const Permission = sequelize.define("st_auth_permissions", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Permission;
};