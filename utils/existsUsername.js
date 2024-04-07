const db = require("../models");
const User = db.user

const verifyUsername = async (username) => {

    let _user = await User.findOne({
        where: {
            username
        }
    });

    return _user ? true : false;

};

module.exports = verifyUsername;