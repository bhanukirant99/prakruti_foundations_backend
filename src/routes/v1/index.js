const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const coursesRoute = require('./courses.route')
const contentsRoute = require('./contents.route')
const commentsRoute = require('./comments.route')
const discussionRoute = require('./discussions.route')
const notessRoute = require('./notes.route')
const likeRoute = require('./like.route')
const adminRoute = require('./admin.route')
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [{
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/courses',
        route: coursesRoute,
    },
    {
        path: '/admin',
        route: adminRoute,
    },
    {
        path: '/contents',
        route: contentsRoute,
    },
    {
        path: '/comments',
        route: commentsRoute,
    },
    {
        path: '/notes',
        route: notessRoute,
    },
    {
        path: '/discussions',
        route: discussionRoute,
    },
    {
        path: '/like',
        route: likeRoute,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;