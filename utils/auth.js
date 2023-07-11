const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

module.exports.generateToken = (username, role, picUrl) => {
    return jwt.sign({
        username: username,
        role: role,
        profile_pic: picUrl
    }, 
    key, 
    {
        expiresIn: '1h'
    });
};