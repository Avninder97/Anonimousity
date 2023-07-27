const Organization = require('../models/Organization');
const User = require('../models/User');
const inDev = process.env.INDEVMODE;

const orgControllers = {

    // Fetches all the organizations from the database
    getOrganizations: async (req, res) => {
        try {
            const organizations = await Organization.find({});
            return res.status(200).json({
                message: "Success",
                organizations: organizations
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },

    getOrganizationsNames: async (req, res) => {
        try {
            const foundOrganizations = await Organization.find({});
            if(!foundOrganizations){
                return res.status(404).json({
                    message: "Organizations not found"
                })
            }
            for(let i=0;i<foundOrganizations.length;i++){
                foundOrganizations[i] = foundOrganizations[i].name;
            }
            console.log(foundOrganizations);
            return res.status(200).json({
                message: "Success",
                names: foundOrganizations
            })
        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },
    
    // fetch a single organization from db
    getSingleOrganization: async (req, res) => {
        try {
            const { id } = req.params;
            const foundOrganization = await Organization.findOne({ _id: id });
            if(!foundOrganization){
                return res.status(404).json({
                    message: "Organization not found"
                });
            }
            return res.status(200).json({
                message: "success",
                data: foundOrganization
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }

    },

    // redundant for now, most probably for admin only
    addOrganization: async (req, res) => {
        try {
            const { organization } = req.body;
            const foundOrganization = await Organization.findOne({ name: organization });
            if(foundOrganization){
                return res.status(409).json({
                    message: "Organization already exists"
                })
            }
            const newOrganization = await Organization.create({
                name: organization,
                isVerified: false
            })
            return res.status(200).json({
                message: "Organization created successfully",
                data: newOrganization
            });

        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    toggleFollowOrganization: async (req, res) => {
        try {
            const { id } = req.params, userId = req.body.decoded.userId;
            const foundOrganization = await Organization.findOne({ _id: id });
            const foundUser = await User.findOne({ _id: userId });
    
            if(!foundOrganization || !foundUser){
                return res.status(404).json({
                    message: `${foundUser ? "Organization" : "User"} not found`
                });
            }
            
            if(foundOrganization.followers.some((uId) => uId.equals(foundUser._id))){
                // unfollow
                foundOrganization.followers.pull(userId);
                foundUser.following.pull(foundOrganization._id);
            }else{
                // follow
                foundOrganization.followers.push(userId);
                foundUser.following.push(foundOrganization._id);
            }
            await foundOrganization.save();
            await foundUser.save();
    
            return res.status(200).json({
                message: "Organization followed successfully"
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    }
};

module.exports = orgControllers;