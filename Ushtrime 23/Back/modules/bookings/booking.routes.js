import express from "express";
import {
  createBooking,
  getMyBooking,
  cancelBooking,
} from "./booking.constroller.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/:tourId/book", isAuthenticated, createBooking);
router.get("/myBookings", isAuthenticated, getMyBooking);
router.delete("/:bookingId/cancel", isAuthenticated, cancelBooking);

export default router;
