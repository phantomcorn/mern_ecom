import rateLimit from "express-rate-limit";

//middleware to handle DDos Attack during login
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute (ms)
    max: 5, //Limit each IP to 5 requests per windowMs timeframe,
    message: {message: "Too many login attempt, please try again after a 60s pause"},
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})

export default loginLimiter