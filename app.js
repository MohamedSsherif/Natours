const path = require('path');
const express = require('express');
//middle ware that allow to see req date in console
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

// 1)Global MIDDLEWARES

//Serving static files
app.use(express.static(path.join(__dirname,'public')));


//Set security HTTP headers
app.use(helmet());

//Development logging
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}


//Limit requests from same API
const limiter = rateLimit({
    max:100,
    windowMs:60 * 60 * 1000,
    message:'Too many requests from this IP, please try again in an hour!'
})
app.use('/api',limiter);


//Body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(XSS());

//Prevent parameter pollution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    
    ]
}))





//Test middleware
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
})



// 3) ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/',viewRouter);



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