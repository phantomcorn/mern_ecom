/*  
    PREV: frontend requests
    NEXT: controllers/authController.js

    Any request to <BASE_URL>/api/auth/ is further directed to the correct backend logic here
*/
import express from "express"
import {create, verifyEmail, login, refresh, logout} from "../controllers/authController.js"
import loginLimiter from "../middleware/loginLimiter.js"
const router = express.Router();

//<BASE_URL>/api/auth/create
router.post("/create", create)

/*
    <BASE_URL>/api/auth/verify-email?id=${accountId}&verifyToken=${verificationToken}`

    Gets called when user clicks the link send via email on account creation
*/
router.post("/verify-email", verifyEmail)

/*  
    <BASE_URL>/api/auth/

    Authenticate user 
    Once user is logged in, issues:
        1. User access(identification) token. Duration = short (5-15mins)
            For API access (until expires), verified with middleware
            Attached to authorization request header as 'Bearer <ACCESS TOKEN>'
        2. Refresh token. Duration = long (2hrs+)
            Grant/Renews access to user access token
            Sent as httpOnly cookie (inaccessible via JavaScript)
*/
router.post("/", loginLimiter, login)

/*
    <BASE_URL>/api/auth/refresh
    Generate a new access token when expired
*/
router.get("/refresh", refresh) 

/*  
    <BASE_URL>/api/auth/logout
    Clear jwt cookie (refresh token), if exist
*/
router.post("/logout", logout) 

export default router