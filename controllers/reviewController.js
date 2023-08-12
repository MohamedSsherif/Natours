const review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');




const setTourUserIds = (req,res,next)=>{
    //Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}


const getAllReviews = factory.getAll(review);
const getReview = factory.getOne(review);
const createReview = factory.createOne(review);
const updateReview = factory.updateOne(review);
const deleteReview = factory.deleteOne(review);


module.exports = {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    setTourUserIds

};