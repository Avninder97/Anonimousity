const router = require('express').Router();
const Post = require('../models/Post');

router
    .get('/', (req, res) => {
        res.send("User routes");
    });

module.exports = router;