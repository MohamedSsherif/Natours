const express = require('express');
//middle ware that allow to see req date in console
const morgan = require('morgan');


const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const app = express();


// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}


app.use(express.json());
app.use(express.static(`${__dirname}/public`));



app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})



// 3) ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


app.all('*',(req,res,next)=>{
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

   // next(err);
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
})
// Global error handling middleware
app.use(globalErrorhandler)



module.exports = app;