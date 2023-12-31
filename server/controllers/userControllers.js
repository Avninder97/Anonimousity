const Organization = require('../models/Organization');
const User = require('../models/User');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');
let inDev = process.env.INDEVMODE;

const userControllers = {
    // For profile (private route), basic data
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

    // Used to regenerate private_key for the logged in user
    regenerateKey: async (req, res) => {
        try {
            const id = req.body.decoded.userId, password = req.body.password;
            const foundUser = await User.findOne({ _id: id });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }

            const match = await bcrypt.compare(password, foundUser.password);
            if(match){
                foundUser.private_key = uuid.v4();
                await foundUser.save();
                return res.status(200).json({
                    message: "Key has been updated Successfully",
                    private_key: foundUser.private_key      // might have to make it more secure
                });
            }
            return res.status(401).json({
                message: "Invalid Credentials",
            })
        } catch(err) {
            inDev && console.log(err)
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },

    getLikedPosts: async (req, res) => {
        try {
            const id = req.body.decoded.userId
            let foundUser = await User.findOne({ _id: id });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }

            inDev && console.log(foundUser);
            foundUser = await foundUser.populate('likedPosts');

            for(let i=0;i<foundUser.likedPosts.length;i++){
                await foundUser.likedPosts[i].populate('author');
                await foundUser.likedPosts[i].populate('organization');
            }

            return res.status(200).json({
                message: "Success",
                likedPosts: foundUser.likedPosts
            })

        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },

    getCreatedPosts: async (req, res) => {
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

            for(let i=0;i<foundUser.createdPosts.length;i++){
                await foundUser.createdPosts[i].populate('author');
                await foundUser.createdPosts[i].populate('organization');
            }

            return res.status(200).json({
                message: "Success",
                createdPosts: foundUser.createdPosts
            })

        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },

    getfollowing: async (req, res) => {
        try {
            const id = req.body.decoded.userId
            let foundUser = await User.findOne({ _id: id });
            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                })
            }

            inDev && console.log(foundUser);
            foundUser = await foundUser.populate('following');

            return res.status(200).json({
                message: "Success",
                following: foundUser.following
            });

        } catch(err) {
            inDev && console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },

    // Need to regenrate jwt auth token as it houses the profile_pic for frontend
    updateAvatar: async (req, res) => {
        try {
            const userId = req.body.decoded.userId, { profile_pic } = req.body;
    
            const foundUser = await User.findOne({ _id: userId });

            if(!foundUser){
                return res.status(404).json({
                    message: "User not found"
                });
            }

            foundUser.profile_pic = profile_pic;
            await foundUser.save();

            const token = await generateToken(
                foundUser._id,
                foundUser.username,
                foundUser.role,
                foundUser.profile_pic,
                foundUser.isVerified
            );

            res.cookie('user', token);

            return res.status(200).json({
                message: "Avatar Updated Successfully",
                token
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    }
}

module.exports = userControllers;