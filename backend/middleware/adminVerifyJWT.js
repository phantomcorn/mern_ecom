import jwt from "jsonwebtoken"

//This is used to verify access token whenever user calls API
const adminVerifyJWT = (req, res, next) => {

    //no standard for header key capitalisation
    const authHeader = req.headers.authorization || req.headers.Authorization
    //standard value inside authorization header is "Bearer <ACCESS TOKEN>"
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({message: "No authorization header"})

    //access the <ACCESS TOKEN>
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message : "Forbidden"})
            //matches payload structure when we first generated the token
            if (!decoded.UserInfo.admin) return res.status(403).json({message : "Forbidden"})
            req.body = {email : decoded.UserInfo.email}
            // console.log("Verify JWT success")
            next()
        }
    )
}

export default adminVerifyJWT