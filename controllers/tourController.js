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
        .limitFields()
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

const getTourStatstics = async (req,res)=>{
    try{
        const stats = await Tour.aggregate([
            {
                $match:{ratingsAverage:{$gte:4.5}}
            },
            {
                $group:{
                    _id:'$difficulty',
                    numTours:{$sum:1},
                    numRatings:{$sum:'$ratingsQuantity'},
                    avgRating:{$avg:'$ratingsAverage'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'}
                }
            },
            {
                $sort:{avgPrice:1}
            },
            // {
            //     $match:{_id:{$ne:'easy'}}
            // }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

const getMonthlyPlan = async (req,res)=>{
    try{
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTourStarts:{$sum:1},
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields:{month:'$_id'}
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{numTourStarts:-1}
            },
            {
                $limit:12
            }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                plan
            }
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
    aliasTopTours,
    getTourStatstics,
    getMonthlyPlan
    
}