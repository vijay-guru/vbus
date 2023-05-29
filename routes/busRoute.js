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

router.post('/get-all-buses',async(req,res)=>{
    try {
        const buses = await Bus.find(req.body);
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

// update bus

router.post('/update-bus',authMiddleware,async(req,res)=>{
    try {
        await Bus.findByIdAndUpdate(req.body._id, req.body);
        return res.status(200).send({
            success:true,
            message:'Bus updated successfully !!!'
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.data.message
        })
    }
})

// delete bus

router.post('/delete-bus',authMiddleware,async(req,res)=>{
    try {
        await Bus.findByIdAndDelete(req.body._id);
        return res.status(200).send({
            success:true,
            message:'Bus deleted successfully !!!'
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.data.message
        })
    }
})

// get bus by id

router.post('/get-bus-by-id',authMiddleware,async(req,res)=>{
    try {
        const bus = await Bus.findById(req.body._id);
        return res.status(200).send({
            success:true,
            message:'Bus fetched successfully !!!',
            data:bus
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.data.message,
            data:null
        })
    }
})

module.exports = router;