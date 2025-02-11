import express from "express"

const router = express.Router()

router.get("/getAllUsers")
router.post("createUsers")

export default router