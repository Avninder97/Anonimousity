/*
    This is the email schema for email model in the database
    This is needed to make sure that each email can be used only once
*/

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    // Required for first verification
    email: {
        type: String,
        unique: true,
    },
});

module.exports = mongoose.model('Email', emailSchema);