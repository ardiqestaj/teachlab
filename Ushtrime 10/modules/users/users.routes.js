import express from "express"
import {createUser} from "./user.controller.js"
const router = express.Router()

router.get("/getAllUsers")
router.post("/createUsers", createUser)

export default router