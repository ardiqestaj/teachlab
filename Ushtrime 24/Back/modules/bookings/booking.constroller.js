import Booking from "./booking.model.js";
import Tour from "../tours/tour.model.js";
import stripe from "../../config/stripe.js";

export const createBooking = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const user = req.user.id;
    const { guests, date } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const amount = tour.price * guests * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        tourId: tourId.toString(),
        userId: user.toString(),
        guests: guests.toString(),
        date: date,
      },
    });

    const booking = new Booking({
      user,
      tour: tourId,
      guests,
      date,
      paymentIntendId: paymentIntent.id,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking cereated successfully",
      booking,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getMyBooking = async (req, res) => {
  try {
    const userID = req.user.id;
    const bookings = await Booking.find({ user: userID }).populate(
      "tour",
      "title location price"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "canceled";
    await booking.save();
    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const hadelStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook received", event.type);
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).send("Webhook Error:", error.message);
  }
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Payment succeeded for intent:", paymentIntent.id);
      const updateBooking = await Booking.findOneAndUpdate(
        {
          paymentIntendId: paymentIntent.id,
        },
        {
          status: "confirmed",
        },
        {
          new: true,
        }
      );
      console.log("Updated booking:", updateBooking);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed for intent:", failedPayment.id);
      await Booking.findOneAndUpdate(
        { paymentIntendId: failedPayment.id },
        {
          status: "canceled",
          paymentStatus: "failed",
        },
        { new: true }
      );
      break;
    default:
      console.log(`Unhandeled event type ${event.type}`);
  }
  res.json({ recieved: true });
};
