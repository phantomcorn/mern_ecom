import mongoose from "mongoose"

const counterSchema = new mongoose.Schema({
    _id: {type: String},
    seq: {type: Number, required:true, default: 0}
})
  
//REST API 
const Counter = mongoose.model("Counter", counterSchema)

// call this before creating a new order
async function getNextOrderNumber() {
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'orderId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    return `ORDER-#${counter.seq.toString().padStart(5, '0')}`
}

export default getNextOrderNumber





