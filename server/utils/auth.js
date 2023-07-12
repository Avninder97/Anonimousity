const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

module.exports.generateToken = (username, role, picUrl, isVerified) => {
    return jwt.sign({
        username: username,
        role,
        profile_pic: picUrl,
        isVerified
    }, 
    key, 
    {
        expiresIn: '1h'
    });
};