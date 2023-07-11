/*
*   This is the user schema for user model in the database
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Required for first verification
    email: {
        type: String,
        unique: true,
        required: true
    },
    profile_pic: {
        type: String,
    },
    // required for password reset as email would be deleted after verification
    private_key: {
        type: String,
        required: true,
        unique: true
    },
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