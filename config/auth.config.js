module.exports = {
    secret: process.env.SECRET || "st-auth-secret-key",
    jwtExpiration: parseInt(process.env.EXPIRATION) || process.env.EXPIRATION || 3600,
    jwtRefreshExpiration: parseInt(process.env.REFRESH_EXPIRATION) || process.env.REFRESH_EXPIRATION || 86400
};