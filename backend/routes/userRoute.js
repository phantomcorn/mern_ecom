import express from "express"
import { getOrder, getOrders } from "../controllers/userController.js"

const router = express.Router()

router.get("/order", getOrders)
router.get("/order/:sessionId", getOrder)

export default router