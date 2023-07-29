const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const Apperror = require('./../utils/appError');
const fs = require('fs');


// const users = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// )

const getAllUsers = catchAsync(async(req,res,next)=>{
    try{
    const users = await User.find();
    res.status(200).json({
        status:'success',
        results:users.length,
        data:{
            users
        }
    }) 
}catch(err){
    return next(new Apperror('Something went wrong',500));
}


})


const getOneUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    });
}

const createUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    });
}


const updateUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    });
}

const deleteUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    });
}


module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}