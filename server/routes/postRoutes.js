const router = require('express').Router();
const Post = require('../models/Post');
const postControllers = require('../controllers/postController');

router
    .route('/')
    .get(postControllers.getPosts);

router
    .route('/:id')
    .get(postControllers.getSinglePost);

/* Create post middleware to verify user */
router
    .route(':/id/delete')
    .post(postControllers)

module.exports = router;