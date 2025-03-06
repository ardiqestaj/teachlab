import express from "express";
import userRoutes from "../modules/users/users.routes.js";
import tourRoutes from "../modules/tours/tour.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/tours", tourRoutes);

export default router;
