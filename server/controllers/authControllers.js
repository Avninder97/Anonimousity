const User = require('../models/User');
const Email = require('../models/Email');

const { generateToken } = require('../utils/auth');
const { generateEmail } = require('../utils/mailer')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Organization = require('../models/Organization');
const { validateWorkMail } = require('../utils/validateWorkMail');

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
            const { username, password, email, profile_pic, currentOrganization, gender } = req.body;

            if(!(username && password && email)){
                return res.status(400).json({
                    meassage: 'Incomplete Data'
                })
            }

            const isWorkMail = await validateWorkMail(email);
            if(!isWorkMail){
                return res.status(200).json({
                    message: "Please enter a work email"
                })
            }

            const alreadyExistEmail = await Email.findOne({ email }), alreadyExistUsername = await User.findOne({ username });
            if(alreadyExistEmail || alreadyExistUsername){
                return res.status(409).json({
                    message: `User with entered ${alreadyExistEmail ? 'email' : 'username'} already exists`
                });
            }

            let currOrg = null;
            if(currentOrganization){

                currOrg = await Organization.findOne({ name: currentOrganization });
                if(!currOrg){
                    currOrg = await Organization.create({
                        name: currentOrganization
                    })
                }

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
                        currentEmployeer: currOrg._id,
                        gender
                    });

                    currOrg.currentEmployees.push(newUser._id);
                    await currOrg.save();

                    let url = `http://localhost:5000/api/auth/${slug}`
                    const emailSuccess = await generateEmail(email, url);
                    if(!emailSuccess){
                        inDev && console.log("Email Not Sent");
                        return res.status(500).json({
                            message: "Server Error"
                        });
                    }
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
                return res.send("Invalid Activation Link");
            }

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
            
            foundUser.isActive = true;
            foundUser.activatingUrlSlug = "";
            foundUser.email = "";
            
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
        const { username, private_key, newPassword } = req.body;
        const foundUser = await User.findOne({ username });
        if(!foundUser || foundUser.private_key != private_key){
            return res.status(404).json({
                message: 'Invalid credentials'
            })
        }else{
            // Can't send reset password link :( via mail as it doesn't exist now
            foundUser.password = newPassword;
            await foundUser.save();
        }
    }
}

module.exports = authControllers;