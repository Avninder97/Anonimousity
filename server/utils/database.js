/*
    This file houses the code required to setup the connection between database and backend server.
    It export the connect function which when called establishes the connection.
*/

const mongoose = require('mongoose');

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGOURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("Database Connected");
    }catch(error){
        console.error("Database connection failed");
        console.log(error);
    }
}

module.exports = connect;