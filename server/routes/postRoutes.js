const router = require('express').Router();
const Post = require('../models/Post');
const authMiddlewares = require('../middlewares/authMiddleware')
const postControllers = require('../controllers/postController');

router
    .route('/')
    .get(postControllers.getPosts);

router
    .route('/new')
    .post(authMiddlewares.validate, postControllers.createPost);

router
    .route('/:id')
    .get(postControllers.getSinglePost);

router
    .route('/:id/delete')
    .post(authMiddlewares.authorize ,postControllers.deletePost);

router
    .route('/:id/edit')
    .post(authMiddlewares.authorize, postControllers.editPost);

router
    .route('/:id/like')
    .post(authMiddlewares.validate, postControllers.likePost);

// comment routes
router
    .route('/:id/comment/new')
    .post(authMiddlewares.validate, postControllers.addComment);

router
    .route('/:id/comment/:cId/like')
    .post(authMiddlewares.validate, postControllers.likeComment);

router
    .route('/:id/comment/:cId/delete')
    .post(authMiddlewares.authorize, postControllers.deleteComment);

router
    .route('/:id/comment/:cId/edit')
    .post(authMiddlewares.authorize, postControllers.editComment);

module.exports = router;