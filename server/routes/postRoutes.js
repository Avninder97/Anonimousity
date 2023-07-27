const router = require('express').Router();
const authMiddlewares = require('../middlewares/authMiddlewares')
const postControllers = require('../controllers/postController');

// Route to fetch all posts
router
    .route('/')
    .get(postControllers.getPosts);

// Route to create a new post
router
    .route('/new')
    .post(authMiddlewares.validate, authMiddlewares.isVerified, postControllers.createPost);

// Route to fetch a single post using id
router
    .route('/:id')
    .get(postControllers.getSinglePost);

// Like a post
router
    .route('/:id/like')
    .post(authMiddlewares.validate, authMiddlewares.isVerified, postControllers.likePost);

// Delete route for a Post using id
router
    .route('/:id/delete')
    .post(authMiddlewares.authorize, authMiddlewares.isVerified, postControllers.deletePost);

// Edit an already existing post
router
    .route('/:id/edit')
    .post(authMiddlewares.authorize, authMiddlewares.isVerified, postControllers.editPost);
    

// Comment routes

// Create a new comment under a post
router
    .route('/:id/comment/new')
    .post(authMiddlewares.validate, authMiddlewares.isVerified, postControllers.addComment);

// Like a comment
router
    .route('/:id/comment/:cId/like')
    .post(authMiddlewares.validate, authMiddlewares.isVerified, postControllers.likeComment);

// Delete an already existing comment
router
    .route('/:id/comment/:cId/delete')
    .post(authMiddlewares.authorize, authMiddlewares.isVerified, postControllers.deleteComment);

// Edit an already existing comment
router
    .route('/:id/comment/:cId/edit')
    .post(authMiddlewares.authorize, authMiddlewares.isVerified, postControllers.editComment);

module.exports = router;