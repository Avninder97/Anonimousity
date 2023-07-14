/*
*   This is the user schema for user model in the database
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    // To distinguish a user from admin
    role: {
        type: String,
        default: "user"
    },
    gender: {
        type: String,
        default: "Choose not to share"
    },
    activatingUrlSlug: {
        type: String,
    },

    // True after the user has gone through verification email
    isActive: {
        type: Boolean,
        default: false
    },

    // True if user gave a work email and the organization has been verified
    isVerified: {
        type: Boolean,
        default: false
    },

    // Required for first verification, delete after the verification is complete
    email: {
        type: String,
    },

    profile_pic: {
        type: String,
        default: ''
    },

    // required for password reset as email would be deleted after verification
    private_key: {
        type: String,
        required: true,
        unique: true
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ],
    createdPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    // To keep track of all the organizations user has worked in
    currentEmployeer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    },
    pastEmployeers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);