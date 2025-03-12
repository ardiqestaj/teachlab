import express from "express";
import {
  createBooking,
  getMyBooking,
  cancelBooking,
} from "./booking.constroller.js";
const router = express.Router();

router.post("/:tourId/book", createBooking);
router.get("/myBookings/:userID", getMyBooking);
router.delete("/:bookingId/cancel", cancelBooking);

export default router;
