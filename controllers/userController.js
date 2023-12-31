const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const Apperror = require('./../utils/appError');
const fs = require('fs');
const factory = require('./handlerFactory');


// const users = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// )
const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}



const updateMe =  catchAsync( async (req,res,next) => {
   
    //1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new Apperror('This route is not for password updates. Please use /updateMyPassword',400));
    }

    // //2) Filtered out unwanted fields names that are not allowed to be updated
     const filteredBody = filterObj(req.body,'name','email');
    // //console.log(filteredBody);
    //3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    })

})

const getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}

const deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
        status:'success',
        data:null
    })
})




const createUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    });
}

const getOneUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);
//Do not update passwords with this
const updateUser = factory.updateOne(User); 

const deleteUser = factory.deleteOne(User);


module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe
}