import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/database.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import verifyJWT from './middleware/verifyJWT.js';

//Deploy a server which acts as a backend
//Our frontend will make request to this backend which then communicates with the database

const PORT = process.env.PORT || 3001;
const app = express();

/*
    app.use() adds a middleware layer i.e function that is used BETWEEN 
    incoming request(frontend) and before the data is processed by the backend server (controllers parameter req).
    
    MIDDLEWARE:
        express.json : 
            Required: Content-Type header of application/json
            Action:   Converts the req.body (data) into JSON object
        express.urlencoded : 
            Required: HTTP POST request with content type application/x-www-form-urlencoded
            Action:   Populates the req.body object with key-value pairs.
        cors: 
            Action: Resolve Cross-Origin error
        cookieParser:
            Required: Handles parsing cookies from client to server
            Action:   Populates the req.cookies with client cookies
*/
// Connect backend to MongoDB
connectDB()

app.use(express.json())
// app.use(express.urlencoded({extended: false}))

app.use(cors({
    origin: process.env.VITE_APP_BASE_URL,
    credentials: true, //Accept credentials cookies (i.e jwt) sent by client
    optionsSuccessStatus: 200
}))

app.use(cookieParser())


/*
    Any request made to <BASE_URL>/api/auth/ is directed to authRoute
    Handles account creation, authentication(login), verification(email), authorization(subsequent API calls)
*/
app.use("/api/auth", authRoute)

/*
    Any request made to <BASE_URL>/api/user/ is directed to authRoute
    Handles getting user data
*/
app.use("/api/user", verifyJWT, userRoute)


// Any other request are rejected
app.all("*", function (req, res) {
    res.status(404).send({message: "Invalid link"})
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});