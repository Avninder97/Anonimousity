const jwt = require('jsonwebtoken');

module.exports.validate = async (req, res, next) => {
    try {
        const auth_header = req.headers.authorization;
        if(!auth_header){
            return res.status(401).json({
                message: 'Unauthorized request'
            });
        }
        const token = auth_header.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        next();
    }catch(err) {
        return res.status(403).json({
            message: 'Invalid token'
        })
    }
}

module.exports.authorize = async (req, res, next) => {
    try{
        const { ownerId } = req.body;
        const auth_header = req.headers.authorization;
        if(!auth_header){
            return res.status(401).json({
                message: 'Unauthorized request'
            });
        }
        const token = auth_header.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
    
        /*
            match the decoded token's logged in user id and owner's id
        */
        if(!decoded.userId.equals(ownerId)){
            return res.status(409).json({
                message: "You are not authorized for this operation"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            message: "Server Error"
        })
    }
}