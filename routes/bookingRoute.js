const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require("uuid");

// book a bus

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    res.status(200).send({
      message: "Booking successful !!!",
      success: true,
      data: newBooking,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking failed !!!",
      success: false,
      data: null,
    });
  }
});

// make a payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.paymentIntents.create(
      {
        amount: amount,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      res.status(200).send({
        message: "Payment successful !!!",
        success: true,
        data: {
          transactionId: payment.id,
        },
      });
    } else {
      res.status(500).send({
        message: "Payment failed !!!",
        success: false,
        data: error,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Payment failed !!!",
      success: false,
      data: error,
    });
  }
});

// get all booking by user id

router.post("/get-bookings-by-userid",authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully !!!",
      success: true,
      data: bookings,
    });
  } catch (err) {
    res.status(500).send({
      message: "Bookings fetch failed !!!",
      success: false,
      data: err,
    });
  }
});

module.exports = router;
