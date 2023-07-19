const User = require('../models/User');
const Email = require('../models/Email');

const { generateToken } = require('../utils/auth');
const { generateEmail } = require('../utils/mailer')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Organization = require('../models/Organization');
const { validateWorkMail } = require('../utils/validateWorkMail');
const Domain = require('../models/Domain');

// To check if server is in development mode
let inDev = process.env.INDEVMODE;

const authControllers = {
    /*
        Post route for user login
    */
    userLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            if(username && password){
                const foundUser = await User.findOne({ username });
                if(!foundUser){
                    return res.status(404).json({
                        message: "User not found"
                    })
                }else{
                    const match = await bcrypt.compare(password, foundUser.password);
                    if(match){
                        const token = generateToken(foundUser._id, foundUser.username, foundUser.role, foundUser.profile_pic);
                        res.cookie('user', token);
                        return res.status(200).json({
                            message: "User Logged In",
                            token: token
                        });
                    }
                    return res.status(401).json({
                        message: "Incorrect Password"
                    })
                }
            }else{
                throw "login error";
            }
        }catch(error){
            inDev && console.log(error);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },
    userRegister: async (req, res) => {
        try {
            const { username, password, email, profile_pic, gender } = req.body;
            let isVerified = false, currentOrganization = null;
            if(!(username && password && email)){
                return res.status(400).json({
                    meassage: 'Incomplete Data'
                })
            }

            const alreadyExistEmail = await Email.findOne({ email }), alreadyExistUsername = await User.findOne({ username });
            if(alreadyExistEmail || alreadyExistUsername){
                return res.status(409).json({
                    message: `User with entered ${alreadyExistEmail ? 'email' : 'username'} already exists`
                });
            }

            const isWorkMail = await validateWorkMail(email);
            if(isWorkMail){
                const userEmailDomain = email.split('@')[1];
                const foundDomain = await Domain.findOne({ domain: userEmailDomain }).populate('organization');
                inDev && console.log("found domain", foundDomain);
                if(foundDomain){
                    isVerified = foundDomain.isVerified;
                    currentOrganization = (await foundDomain.populate('organization')).organization;
                }
            }

            let currOrg = null;
            // Needs optimization appears to be a bit redundant
            if(currentOrganization){

                currOrg = await Organization.findOne({ _id: currentOrganization._id });
                if(!currOrg){
                    currOrg = await Organization.create({
                        _id: currentOrganization._id,
                        name: currentOrganization.name
                    })
                }
                // currOrg = currOrg._id;
            }
            
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err){
                    return res.status(500).json({
                        message: "Server Error"
                    })
                }else{
                    const key = uuid.v4(), slug = uuid.v4();
                    inDev && console.log(key);
                    const newUser = await User.create({
                        username, 
                        password: hash,
                        activatingUrlSlug: slug,
                        email, 
                        profile_pic,
                        private_key: key,
                        currentEmployeer: currOrg ? currOrg._id : null,
                        isVerified,
                        gender
                    });

                    if(currOrg){
                        // currOrg.currentEmployees.push(newUser._id);
                        await currOrg.save();
                    }

                    // Commented during development only
                    let url = `http://localhost:5000/api/auth/${slug}`
                    // const emailSuccess = await generateEmail(email, url);
                    // if(!emailSuccess){
                    //     inDev && console.log("Email Not Sent");
                    //     return res.status(500).json({
                    //         message: "Server Error"
                    //     });
                    // }
                    inDev && console.log("Email Sent");
                    return res.status(200).json({
                        message: "Verification email has been sent"
                    });
                }
            })
        }catch(error){
            inDev && console.log(error);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },
    userActivation: async (req, res) => {
        try {
            const slug = req.params.uniqueSlug;
            const foundUser = await User.findOne({activatingUrlSlug: slug});
            
            if(!foundUser || foundUser.isActive){
                return res.status(403).json({
                    message: "Invalid Activation Link"
                });
            }

            let eDomain = foundUser.email.split('@')[1];
            let orgName = eDomain.split('.')[0];
            const isWorkMail = await validateWorkMail(foundUser.email);
            console.log("isWorkMail", isWorkMail);
            
            const foundOrganization = await Organization.findOne({ name: orgName });
            const foundDomain = await Domain.findOne({ domain: eDomain });


            try {
                await Email.create({
                    email: foundUser.email
                });
            } catch(err) {
                inDev && console.log(err)
                return res.status(409).json({
                    message: 'Verification error'
                })
            }
            
            if(isWorkMail){
                if(foundOrganization){
                    if(!foundDomain){
                        let newDomain = await Domain.create({
                            domain: eDomain,
                            isVerified: true,
                            organization: foundOrganization._id
                        });
                    }
                    foundOrganization.currentEmployees.push(foundUser._id);
                    foundOrganization.isVerified = true;
                    await foundOrganization.save();
                    foundUser.currentEmployeer = foundOrganization._id;
                }else{
                    let newOrganization = await Organization.create({
                        name: orgName,
                        isVerified: true,
                    });
                    let newDomain = await Domain.create({
                        domain: eDomain,
                        isVerified: true,
                        organization: newOrganization._id
                    });
                    newOrganization.currentEmployees.push(foundUser._id);
                    await newOrganization.save();
                    foundUser.currentEmployeer = newOrganization._id;
                }
                foundUser.isVerified = true;
            }
            
            foundUser.isActive = true;
            foundUser.activatingUrlSlug = "";
            foundUser.email = eDomain;
            
            await foundUser.save();
            return res.status(200).json({
                message: 'Account Verified Successfully'
            })
        } catch(error) { 
            inDev && console.log(error);
            return res.status(500).json({
                message: "Server Error"
            })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { username, private_key, newPassword } = req.body;
            const foundUser = await User.findOne({ username, private_key });
            if(!foundUser){
                return res.status(404).json({
                    message: 'Invalid credentials'
                });
            }else{
                // Can't send reset password link :( via mail as it doesn't exist now
                foundUser.password = newPassword;
                await foundUser.save();
            }
            return res.status(200).json({
                message: "Password reset successful"
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            });
        }
    },
    usernameCheck: async (req, res) => {
        try {
            const { username } = req.body;
            const foundUser = await User.findOne({ username });
            if(foundUser){
                return res.status(409).json({
                    message: "Username not avaliable"
                });
            }
            return res.status(200).json({
                message: "Username avaliable"
            });
        } catch(err) {
            return res.status(500).json({
                message: "Server Error"
            })
        }
    }
}

module.exports = authControllers;