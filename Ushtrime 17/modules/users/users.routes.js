import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.get("/getAllUsers", isAuthenticated, getUsers);
router.post("/createUsers", createUser);
router.get("/getOneUser/:id", getUserById);
router.put("/updateUser/:userId", updateUser);
router.delete("/deleteUser/:id", deleteUser);

export default router;
