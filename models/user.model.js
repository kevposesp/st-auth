module.exports = (
    sequelize,
    Sequelize,
    jwt,
    config_auth,
    bcrypt,
    refreshToken
) => {
    const User = sequelize.define("st_auth_users", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        secondPhone: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        enableLog: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });

    User.prototype.toLoginResponse = async function () {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            accessToken: this.generateJwt(),
            refreshToken: await refreshToken.generateToken(this.id)
        };
    }

    User.prototype.toResponse = function () {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            address: this.address,
            note: this.note,
            phone: this.phone,
            secondPhone: this.secondPhone,
            username: this.username,
            enableLog: this.enableLog,
            status: this.status
        };
    };

    User.prototype.generateJwt = function () {
        return jwt.sign(
            {
                id: this.id,
                email: this.email
            },
            config_auth.secret,
            {
                expiresIn: config_auth.jwtExpiration
            }
        );
    }

    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }

    User.beforeCreate((user, options) => {
        user.password = bcrypt.hashSync(user.password, 8);
    });

    return User;
};