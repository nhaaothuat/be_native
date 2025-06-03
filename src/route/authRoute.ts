import express from "express"
import { Login, Register } from "../controller/authController.js"

const router = express.Router()

router.post("/auth/sign-in",Login)
router.post("/auth/sign-up",Register)

export default router;