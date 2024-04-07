const db = require("../models");
const User = db.user

const verifyEmail = async (email) => {

    let _user = await User.findOne({
        where: {
            email
        }
    });

    return _user ? true : false;

};

module.exports = verifyEmail;