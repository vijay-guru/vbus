const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Bus = require('../models/busModel')
//add bus

router.post('/add-bus',async(req,res)=>{
    try {
        const exisitingBus = await Bus.findOne({
            number:req.body.number
        });
        if(exisitingBus){
            return res.status(200).send({
                success:false,
                message:'Bus already added'
            })
        }
        const newBus = new Bus(req.body);
        await newBus.save();
        return res.status(200).send({
            success:true,
            message:'Bus added successfully !!!'
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.data.message
        })
    }
})

// get all buses

router.post('/get-all-buses',authMiddleware,async(req,res)=>{
    try {
        const buses = await Bus.find();
        return res.status(200).send({
            success:true,
            message:"Buses fetched successfully",
            data:buses
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.data.message
        })
    }
})

module.exports = router;