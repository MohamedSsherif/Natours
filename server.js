const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');




dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE_URL.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);



mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con => {
    //console.log(con.connections);
    console.log('DB connection successful');
})



//console.log(process.env);



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    server.close(()=>{
        process.exit(1);
    })
})

