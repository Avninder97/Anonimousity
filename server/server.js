/*
    TO-DO: File needs to be commented
*/

require('dotenv').config()
// process.env.INDEVMODE && console.log(process.env);

const express = require('express');
const app = express();
const DBconnect = require('./utils/database');
const routes = require('./routes/index');
const corsOptions = require('./utils/cors');
const cors = require('cors')

DBconnect();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', routes);


// To catch all route requests that doesn't match any routes declared in the routes folder
app.get('*', (req, res) => {
    return res.status(404).json({
        message: "404 - Page Not Found"
    })
});

console.log(`In Developement Mode - ${process.env.INDEVMODE ? "True" : "False"}`);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Backend Server Started at PORT ${port}`);
});