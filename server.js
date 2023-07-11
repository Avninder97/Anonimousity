/*
    TO-DO: File needs to be commented
*/

require('dotenv').config()
console.log(process.env);

const express = require('express');
const app = express();
const DBconnect = require('./utils/database');
const routes = require('./routes/index');

DBconnect();

app.use('/api', routes);


// To catch all route requests that doesn't match any routes declared in the routes folder
app.get('*', (req, res) => {
    return res.status(404).json({
        message: "404 - Page Not Found"
    })
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Backend Server Started at PORT ${port}`);
});