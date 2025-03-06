import express from "express";
import { createBooking } from "./booking.constroller.js";
const router = express.Router();

router.post("/:tourId/book", createBooking);
router.get("/myBookings");
router.delete("/:bookingId/cancal");

export default router;
