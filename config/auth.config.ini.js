module.exports = {
    secret: process.env.SECRET || "st-auth-secret-key",
    jwtExpiration: process.env.EXPIRATION || 3600,
    jwtRefreshExpiration: process.env.REFRESH_EXPIRATION || 86400
};