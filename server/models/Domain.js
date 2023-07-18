/*
    This is the email domain schema for domain model in the database
    This is needed to keep a record of which domains are verified and which are not
*/

const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    // Required for first verification
    domain: {
        type: String,
        unique: true,
    },
    // redundant i guess
    isVerified: {
        type: Boolean,
        default: false
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    }
});

module.exports = mongoose.model('Domain', domainSchema);