import express from "express";
import { createSession, getSession} from "../controllers/checkoutController.js";
const router = express.Router()

router.post("/create-checkout-session", createSession)
router.get("/:checkoutId", getSession)


export default router