/*
    Mongoose allows you to model data in MongoDB as object to help with types
*/

import mongoose from "mongoose"

//model for database
const reservationSchema = new mongoose.Schema({
    session: {type: String, required: true, unique: true},
    products : [{
        productId: {type: String, required: true},
        priceId: {type: String, required: true},
        quantity:  {type: Number, required: true},
    }]
})

//REST API on ThreadsDB.reservations
const Reservation = mongoose.model("reservation", reservationSchema)

export default Reservation;