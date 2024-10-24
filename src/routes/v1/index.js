const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const sellerRoute = require('./seller.route');
const productRoute = require('./product.route');
const recommendationRoute = require('./recommendation.route');
const categoryRoute = require('./category.route');
const questionRoute = require('./question.route');
const optionRoute = require('./option.route');
const userProfileRoute = require('./userProfile.route');
const recommendedProductRoute = require('./recommendedProduct.route');
const reviewRoute = require('./review.route');
const favoriteRoute = require('./favorite.route');
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
    path: '/recommendation',
    route: recommendationRoute,
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
    path: '/recommendedProduct',
    route: recommendedProductRoute,
  }
  ,
  {
    path: '/userProfile',
    route: userProfileRoute,
  }
  ,
  {
    path: '/reviews',
    route: reviewRoute,
  }
  ,
  {
    path: '/favorite',
    route: favoriteRoute,
  }
  ,
  {
    path: '/category',
    route: categoryRoute,
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
