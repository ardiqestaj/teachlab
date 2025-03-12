import Booking from "./booking.model.js";
import Tour from "../tours/tour.model.js";

export const createBooking = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const { guests, date, user } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    const booking = new Booking({
      user,
      tour: tourId,
      guests,
      date,
    });

    await booking.save();
    res.status(201).json({ message: "Booking cereated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getMyBooking = async (req, res) => {
  try {
    const userID = req.params.userID;
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
