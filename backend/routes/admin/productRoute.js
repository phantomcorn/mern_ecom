/*  
    PREV: frontend requests
    NEXT: controllers/admin/productController.js

    Any request to <BASE_URL>/api/admin/product/ is further directed to the correct backend logic here
*/
import express from "express"
import {add, remove, updateQuantity, getProducts} from "../../controllers/admin/productController.js"
import loginLimiter from "../../middleware/loginLimiter.js"
const router = express.Router();

router.get("/", getProducts)
// <BASE_URL>/api/admin/product/add
router.post("/add", add)
  
// <BASE_URL>/api/admin/product/delete
router.post("/delete", remove)

// <BASE_URL>/api/admin/product/update
router.post("/update", updateQuantity) 

export default router