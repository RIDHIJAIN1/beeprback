const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const sellerRoute = require('./seller.route');
const productRoute = require('./product.route');
const catgoryRoute = require('./category.route');
const questionRoute = require('./question.route');
const optionRoute = require('./option.route');
const userProfileRoute = require('./userProfile.route');
const categoryProductRoute = require('./categoryHaveProduct.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/seller',
    route: sellerRoute,
  },
  {
    path: '/product',
    route: productRoute,
  }
  ,
  {
    path: '/category',
    route: catgoryRoute,
  },
  {
    path: '/question',
    route: questionRoute,
  },
  {
    path: '/options',
    route: optionRoute,
  },
  {
    path: '/categoryProduct',
    route: categoryProductRoute,
  }
  ,
  {
    path: '/userProfile',
    route: userProfileRoute,
  }

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
