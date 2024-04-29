const mongoose=require('mongoose');
require('dotenv').config();
const MONGO_URL=process.env.MONGO_URL;
mongoose.connect(MONGO_URL);
const db=mongoose.connection;
db.on('error',()=>{console.log('Error in connecting to MongoDB')});
db.on('connected',()=>{console.log(`Connected to MongoDB at ${MONGO_URL}`)});
db.on('disconnected',()=>{console.log('Disconnected from MongoDB')});
module.exports=db;