import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import {
  authorize,
  isAuthenticated,
} from "../../middleware/auth.middleware.js";
const router = express.Router();
// router.use(isAuthenticated);
router.get(
  "/getAllUsers",
  isAuthenticated,
  authorize("admin", "moderator"),
  getUsers
);
// Me e kqyr oren tjeter, mos me e lon me e bo veten admin
router.post("/createUsers", createUser);

router.get("/getOneUser/:id", isAuthenticated, getUserById);
// mos me e lon me e bo veten admin
router.put("/updateUser/:userId", isAuthenticated, updateUser);
// Me u siguru qe useri mundet me e fshi vetem veten e ti, njejt edhe per update
router.delete("/deleteUser/:id", isAuthenticated, deleteUser);

export default router;
