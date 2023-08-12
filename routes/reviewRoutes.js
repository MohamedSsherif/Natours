const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const reviewRouter = express.Router({mergeParams:true})

reviewRouter.use(authController.protect);

reviewRouter
      .route('/')
      .post(authController.protect,authController.restrictTo('user'),
      reviewController.setTourUserIds,
      reviewController.createReview)
      .get(reviewController.getAllReviews)

reviewRouter
        .route('/:id')
        .patch(authController.protect,authController.restrictTo('user','admin'),reviewController.updateReview)
        .delete(authController.protect,authController.restrictTo('user','admin'),reviewController.deleteReview)
        .get(reviewController.getReview)
 


           


module.exports = reviewRouter;