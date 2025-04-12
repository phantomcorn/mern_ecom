import express from "express";
import { createSession } from "../controllers/checkoutController.js";
const router = express.Router()

router.post("/create-checkout-session", createSession)



export default router