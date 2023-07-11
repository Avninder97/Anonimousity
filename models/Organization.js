const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currentEmployees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    pastEmployees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USer'
        }
    ]
},
{
    timestamps: true
})