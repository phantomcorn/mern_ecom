import express from "express"
import { getCart, addToCart, decrFromCart, incrFromCart, clearCart } from "../controllers/cartController.js"
const router = express.Router();

router.get("/", getCart)
router.post("/add", addToCart)
router.post("/decr", decrFromCart)
router.post("/incr", incrFromCart)
router.post("/clear", clearCart)

export default router