/*  
    PREV: frontend requests
    NEXT: controllers/authController.js

    Any request to <BASE_URL>/api/auth/ is further directed to the correct backend logic here
*/
import express from "express"
import { get } from "../controllers/userController.js"
const router = express.Router();

/*
    <BASE_URL>/api/user

    Retrieves user information
*/
router.get("/", get)

export default router