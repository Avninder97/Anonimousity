const router = require('express').Router();

const authMiddlewares = require('../middlewares/authMiddlewares');
const authControllers = require('../controllers/authControllers');


router
    .route('/login')
    .post(authControllers.userLogin);

router
    .route('/register')
    .post(authControllers.userRegister);

router
    .route('/usernameCheck')
    .post(authControllers.usernameCheck);

// might move it to users later
router
    .route('/resetPassword')
    .post(authControllers.resetPassword);

router
    .route('/:uniqueSlug')
    .get(authControllers.userActivation);

module.exports = router;