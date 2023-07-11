const router = require('express').Router();
const Post = require('../models/Post');

router
    .get('/', (req, res) => {
        res.send("Post Routes");
    });

module.exports = router;