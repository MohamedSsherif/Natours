const express = require('express');
const tourController = require('../controllers/tourController');
//const {checkBody} = require('../controllers/tourController');


const tourRouter = express.Router();
  
tourRouter
   .route('/top-5-cheap')
   .get(tourController.aliasTopTours,tourController.getAllTours);
// special middleware for param
//tourRouter.param('id',tourController.checkID);

tourRouter
   .route('/')
   .get(tourController.getAllTours)
   .post(tourController.createTour)

tourRouter
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour);

   module.exports = tourRouter;