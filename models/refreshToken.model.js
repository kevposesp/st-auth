const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize, config_auth) => {
    const RefreshToken = sequelize.define("st_auth_refresh_token", {
        token: {
            type: Sequelize.STRING,
        },
        expiryDate: {
            type: Sequelize.DATE,
        },
    });

    RefreshToken.generateToken = async function (user) {
        let expiredAt = new Date();

        expiredAt.setSeconds(expiredAt.getSeconds() + config_auth.jwtRefreshExpiration);

        let _token = uuidv4();

        let refreshToken = await this.create({
            token: _token,
            userId: user,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;
    };

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    return RefreshToken;
};