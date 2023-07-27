const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

// POST api to change the current employeer of the logged in user
router
    .route('/profile/updateEmployeer')
    .post(authMiddlewares.validate, userControllers.updateEmployeer);

router
    .route('/profile/updateAvatar')
    .post(authMiddlewares.validate, userControllers.updateAvatar);

// POST api to regenerate the private-key of a user
router
    .route('/profile/regenerateKey')
    .post(authMiddlewares.validate, userControllers.regenerateKey);


router
    .route('/profile/likedPosts')
    .get(authMiddlewares.validate, userControllers.getLikedPosts);

router
    .route('/profile/createdPosts')
    .get(authMiddlewares.validate, userControllers.getCreatedPosts);

router
    .route('/profile/following')
    .get(authMiddlewares.validate, userControllers.getfollowing);

    
// GET api to fetch all the information of the current logged in user
// i have included id for future upgrade scope like a minimalistic profile page for viewing other users
router
    .route('/:id/profile')
    .get(authMiddlewares.validate, userControllers.getUser);

module.exports = router;