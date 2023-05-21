const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('connected',()=>{
    console.log("Mongo db connected successfully")
})
db.on('error',()=>{
    console.log("Mongo db connection failed")
})