const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

const aliasTopTours = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


const getAllTours=async (req,res)=>{
    try{
        //EXECUTE QUERY
        const features= new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .fieldlimiting()
        .Pagination();
        const tours = await features.query;
    
    //SEND RESPONSE
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    });
}catch(err){
    res.status(404).json({
        status:'fail',
        message:err
    })
}
}
    


const getTour=async (req,res)=>{
    try {
       const tour = await Tour.findById(req.params.id); 
       //Tour.findOne({_id:req.params.id})

       res.status(200).json({
        status:'success',
        data:{  
            tour
        } 
    }); 
    } catch (error) {
        res.status(404).json({
            status:'fail',
            message:error
        }) 
    }
}  



const createTour = async (req,res)=>{

    try{
   const newTour= await Tour.create(req.body);

   res.status(201).json({
       status:'success',
       data:{
           tour:newTour
       } 
   });
}catch(err){
    res.status(400).json({
        status:'fail',
        message:'Invalid data sent!'
    })
}
};



const updateTour =async (req,res)=>{

try {
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
    });
    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour
        }
    });
} catch (error) {
    res.status(404).json({
        status:'fail',
        message:error
    }) 
}
    
}



const deleteTour = async (req,res)=>{
    try{
 const tour = await Tour.findByIdAndDelete(req.params.id);

res.status(204).json({
    status:'success',
    data:null
});
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}


module.exports = { 
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours
    
}