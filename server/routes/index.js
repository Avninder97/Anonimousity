const router = require('express').Router();

/*
    Importing all the route files
*/

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const orgRoutes = require('./orgRoutes');

/*
    Setting express router to use all the routes defined in different files.
    To differentiate each route as subroutes might be the same we have added a prefix to those routes like /auth.
*/

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/organizations', orgRoutes);

// Exporting the configured router
module.exports = router;