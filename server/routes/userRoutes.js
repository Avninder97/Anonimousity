const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

// GET api to fetch all the information of the current logged in user
router
    .route('/:id/profile')
    .get(authMiddlewares.validate, userControllers.getUser);

// POST api to change the current employer of the logged in user
router
    .route('/profile/updateEmployeer')
    .post(authMiddlewares.validate, userControllers.updateEmployeer);

// GET api to regenerate the private-key of a user

module.exports = router;