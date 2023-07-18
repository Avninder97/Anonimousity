const router = require('express').Router();

const authControllers = require('../controllers/authControllers');


router
    .post('/login', authControllers.userLogin);

router
    .post('/register', authControllers.userRegister);

router
    .get('/:uniqueSlug', authControllers.userActivation);

module.exports = router;