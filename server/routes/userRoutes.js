const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

// POST api to change the current employeer of the logged in user
router
    .route('/profile/updateEmployeer')
    .post(authMiddlewares.validate, userControllers.updateEmployeer);

// POST api to regenerate the private-key of a user
router
    .route('/profile/regenerateKey')
    .post(authMiddlewares.validate, userControllers.regenerateKey);

// GET api to fetch all the information of the current logged in user
router
    .route('/:id/profile')
    .get(authMiddlewares.validate, userControllers.getUser);

module.exports = router;