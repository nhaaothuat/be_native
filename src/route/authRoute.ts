import express from "express"
import { Login, Register } from "../controller/authController.js"

const router = express.Router()

router.post("/sign-in",Login)
router.post("/sign-up",Register)

export default router;