const router = require('express').Router();

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

router
    .route('/:uniqueSlug')
    .get(authControllers.userActivation);

module.exports = router;