module.exports = (
    sequelize,
    Sequelize
) => {
    const Role = sequelize.define("st_auth_roles", {
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

    return Role;
};