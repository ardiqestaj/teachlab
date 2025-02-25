import express from "express";
import { createTour } from "./tour.controller.js";

const router = express.Router();

// CREATE Tour
router.post("/", createTour);

// Get all tours
// router.get("/");

// // Get single Tour
// router.get("/:tourId");

// // Update a Tour
// router.patch("/:tourId");

// // Delete Tour
// router.delete("/:tourId");
export default router;
