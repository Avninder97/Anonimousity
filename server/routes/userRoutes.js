const router = require('express').Router();
const Post = require('../models/Post');
const userControllers = require('../controllers/userControllers')

router
    .route('/')
    .get((req, res) => {
        res.send("User routes");
    });



module.exports = router;