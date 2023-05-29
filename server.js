const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig')
const usersRoute = require('./routes/usersRoute');
const busRoute = require('./routes/busRoute')
const bookingRoute = require('./routes/bookingRoute')
app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/api/users',usersRoute);
app.use('/api/buses',busRoute);
app.use('/api/bookings',bookingRoute);


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})