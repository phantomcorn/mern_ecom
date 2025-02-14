import jwt from "jsonwebtoken"

//This is used to verify access token whenever user calls API
const verifyJWT = (req, res, next) => {

    //no standard for header key capitalisation
    const authHeader = req.headers.authorization || req.headers.Authorization
    //standard value inside authorization header is "Bearer <ACCESS TOKEN>"
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({message: "No authorization header"})

    //access the <ACCESS TOKEN>
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message : "Forbidden"})
            req.email = decoded.UserInfo.user //matches payload structure when we first generated the token
            // console.log("Verify JWT success")
            next()
        }
    )
}

export default verifyJWT