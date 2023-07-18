const router = require('express').Router();
const authMiddlewares = require('../middlewares/authMiddlewares');
const orgControllers = require('../controllers/orgControllers')

// Route to get all the organizations from database
router
    .route('/')
    .get(authMiddlewares.validate, orgControllers.getOrganizations);

// Might make it admin only route
router
    .route('/new')
    .post(authMiddlewares.validate, orgControllers.addOrganization);

// Fetch a single organization from the DB
router
    .route('/:id')
    .get(orgControllers.getSingleOrganization);

// Let's user follow an organization
router
    .route('/:id/follow')
    .post(authMiddlewares.validate, orgControllers.toggleFollowOrganization);

module.exports = router;