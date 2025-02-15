/*  
    PREV: frontend requests
    NEXT: controllers/productController.js

    Any request to <BASE_URL>/api/product is further directed to the correct backend logic here
*/
import express from "express"
import { getAll } from "../controllers/productController.js";
const router = express.Router();

/*
    <BASE_URL>/api/product

    Retrieves user information
*/
router.get("/", getAll)

export default router