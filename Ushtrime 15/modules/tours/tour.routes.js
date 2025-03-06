import express from "express";
import {
  createTour,
  getTours,
  getTourById,
  deleteTour,
  updateTour,
  addReview,
} from "./tour.controller.js";

const router = express.Router();

// CREATE Tour
router.post("/", createTour);

// Get all tours
router.get("/", getTours);

router.post("/:tourId/addReview", addReview);

// // Get single Tour
router.get("/:tourId", getTourById);

// // Update a Tour
router.patch("/:tourId", updateTour);

// // Delete Tour
router.delete("/:tourId", deleteTour);
export default router;
