import express from "express"
import { getOrder, getOrders } from "../controllers/userController.js"

const router = express.Router()

router.get("/order", getOrders)
router.get("/order/:checkoutId", getOrder)

export default router