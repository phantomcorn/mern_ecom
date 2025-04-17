import express from "express"
import { getOrder, getOrders } from "../controllers/userController.js"

const router = express.Router()

router.get("/", getOrders)
router.get("/:checkoutId", getOrder)

export default router