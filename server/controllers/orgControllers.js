const Organization = require('../models/Organization');
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
            await Organization.create({
                name: organization,
                isVerified: false
            })
            return res.status(200).josn({
                message: "Organization created successfully"
            });

        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    }
};

module.exports = orgControllers;