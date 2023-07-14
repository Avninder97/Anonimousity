const router = require('express').Router();
const Post = require('../models/Post');
const userControllers = require('../controllers/userControllers');
const authMiddlewares = require('../middlewares/authMiddleware');

router
    .route('/:id/profile')
    .get(authMiddlewares.validate, userControllers.getUser);

router
    .route('/profile/updateEmployeer')
    .post(authMiddlewares.validate, userControllers.updateEmployeer);

module.exports = router;