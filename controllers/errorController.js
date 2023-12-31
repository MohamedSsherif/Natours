 const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}


const handleDuplicateFieldsDB = (err) => 
{
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);


const sendErrorDev = (err,req, res) => {
    // A) API
    if(req.originalUrl.startsWith('/api')){
     res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
} else{
    // B) RENDERED WEBSITE
     res.status(err.statusCode).render('error',{
        title:'Something went wrong!',
        msg:err.message
    })
}
}

const sendErrorProd = (err,req,res)=>{
    // A) API
    if(req.originalUrl.startsWith('/api')){
        
    //operational , trusted error : send message to client
    if(err.isOperational){
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
    }else{
    //B) programming or other unknown error: don't leak error details

    //1) log error
    console.error('ERROR',err);
    //2) send generic message
    return res.status(500).json({
        status: 'error',
        message:'something went very wrong!'
    })
}
}
else{
// B) RENDERED WEBSITE
 //operational , trusted error : send message to client
 if(err.isOperational){
    return res.status(err.statusCode).render('error',{
        title:'Something went wrong!',
        msg:err.message
    })
    }else{
    //B) programming or other unknown error: don't leak error details

    //1) log error
    console.error('ERROR',err);
    //2) send generic message
    return res.status(err.statusCode).render('error',{
        title:'Something went wrong!',
        msg:'Please try again later'
    })
}
}
 }


 module.exports=(err , req, res, next)=>{

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err,req,res);

    } else if(process.env.NODE_ENV === 'production'){
        let error = {...err}
        error.message = err.message;   
      if(error.name === "CastError") 
          error = handleCastErrorDB(error);
      if(error.code === 11000) 
          error = handleDuplicateFieldsDB(error);
      if(error.name === 'ValidationError') 
          error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if(error.name === 'TokenExpiredError')
            error = handleJWTError();                
       sendErrorProd(error,req,res);    
    }  
} 