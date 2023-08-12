const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');
//const {checkBody} = require('../controllers/tourController');


const tourRouter = express.Router();
  
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/987555s




tourRouter.use('/:tourId/reviews',reviewRouter);



tourRouter
   .route('/top-5-cheap')
   .get(tourController.aliasTopTours,tourController.getAllTours);
// special middleware for param
//tourRouter.param('id',tourController.checkID);

tourRouter
   .route('/tour-stats')
   .get(tourController.getTourStatstics);

tourRouter
   .route('/monthly-plan/:year')
   .get(
      authController.protect,
      authController.restrictTo('admin','lead-guide','guide'),
      tourController.getMonthlyPlan);

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRouter.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);


tourRouter
   .route('/')
   .get(tourController.getAllTours)
   .post(
      authController.protect,
      authController.restrictTo('admin','lead-guide'),
      tourController.createTour)

tourRouter
   .route('/:id')
   .get(tourController.getTour)
   .patch(
      authController.protect,
      authController.restrictTo('admin','lead-guide'),
      tourController.updateTour)
   .delete(
      authController.protect,
      authController.restrictTo('admin','lead-guide'),
      tourController.deleteTour
      );






   module.exports = tourRouter;