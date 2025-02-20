import express from "express"
import { getCart, addToCart, decrFromCart, incrFromCart } from "../controllers/cartController.js"
const router = express.Router();

router.get("/get", getCart)
router.post("/add", addToCart)
router.post("/decr", decrFromCart)
router.post("/incr", incrFromCart)

export default router