const Organization = require('../models/Organization');
const User = require('../models/User');
const uuid = require('uuid');
let inDev = process.env.INDEVMODE;

const userControllers = {
    // For profile (private route)
    getUser: async (req, res) => {
        try {
            const id = req.body.decoded.userId
            let foundUser = await User.findOne({ _id: id });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }

            inDev && console.log(foundUser);
            foundUser = await foundUser.populate('createdPosts');
            foundUser = await foundUser.populate('likedPosts');
            foundUser = await foundUser.populate('following');
            foundUser = await foundUser.populate('pastEmployeers');
            foundUser = await foundUser.populate('currentEmployeer');
            inDev && console.log(foundUser);

            return res.status(200).json({
                message: "Success",
                user: foundUser
            })

        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },

    // For Updating the current & past employeers of the user as well as current and past employeers.
    updateEmployeer: async (req, res) => {
        try {
            const { newEmployeer, decoded } = req.body;
    
            const foundUser = await User.findOne({ _id: decoded.userId });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }
    
            // Finds the organization who had employeed the user till now
            const foundEmployeerPast = await Organization.findOne({ _id: foundUser.currentEmployeer });
    
            // Finds the organization that user just joined
            let foundEmployeerCurrent = await Organization.findOne({ name: newEmployeer });
    
            if(!foundEmployeerCurrent){
                foundEmployeerCurrent = await Organization.create({
                    name: newEmployeer
                })
            }
    
            // Settles the past employeer integrity
            if(foundEmployeerPast){
                foundEmployeerPast.currentEmployees.pull(foundUser._id);
                foundEmployeerPast.pastEmployees.push(foundUser._id);
                await foundEmployeerPast.save();
            }
            
            // Settles the current employeer integrity
            foundEmployeerCurrent.currentEmployees.push(foundUser._id);
            await foundEmployeerCurrent.save();
            
            // Settles the user integrity
            if(foundUser.currentEmployeer){
                foundUser.pastEmployeers.push(foundUser.currentEmployeer);
            }
            foundUser.currentEmployeer = foundEmployeerCurrent._id;
            await foundUser.save();
            
            return res.status(200).json({
                message: "Employeer Updated Successfully"
            });
        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },
    regenerateKey: async (req, res) => {
        try {
            const id = req.body.decoded.userId;
            const foundUser = await User.findOne({ _id: id });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }
            foundUser.private_key = uuid.v4();
            await foundUser.save();
            return res.status(200).json({
                message: "User updated successfully",
                private_Key: foundUser.private_key      // might have to make it more secure
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            })
        }
    }
}

module.exports = userControllers;