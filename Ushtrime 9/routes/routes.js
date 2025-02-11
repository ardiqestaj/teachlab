import express from "express";
import userRoutes from "../modules/users/users.routes.js"

const router = express.Router()

router.get("/users", userRoutes)

export default router