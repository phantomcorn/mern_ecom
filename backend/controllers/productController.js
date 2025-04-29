import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import stripe from '../db/stripe.js'
import Reservation from '../models/reservationModel.js'
import mongoose from "mongoose"

// @route GET /api/product
const getAll = asyncHandler(async (req, res) => {

    // Get all active products 
    const productsResp = await stripe.products.list({ active: true }) 
    // Get all prices 
    const pricesResp = await stripe.prices.list({ 
        expand: ['data.product'], // optional: expands product info inside price
    });
    
    /* Match product ID to its price ID
        Price are in unit amount (aka £1 = 100) 
            => check by currency and convert to standard price
    */
    const productPriceMap = productsResp.data.map(product => { 
        const productPrices = pricesResp.data.filter(price => price.product.id === product.id);
        return {
            ...product,
            prices: productPrices.map((productPrice) => productPrice.unit_amount),
            currencies: productPrices.map((productPrice) => productPrice.currency)
        };
    });

    //return result to frontend
    return res.status(200).json({
        products: productPriceMap
    })
})

// @router GET /api/product/:productId
const getById = asyncHandler(async (req, res) => {
    const {productId} = req.params
    const product = await stripe.products.retrieve(productId)

    // Get all prices for a product
    const prices = await stripe.prices.list({
        product: product.id
    })
    
    //return result to frontend
    if (!product) {
        return res.status(404).send({message: "Product not found"})
    }

    return res.status(200).json({
        ...product,
        prices: prices.data
    })
})


// called in precheckout (checkoutController.js)
const deductProductQuantity = async (transactionSess, cart) => {
    const itemOOS = [] //productId with too few quantity to reserve
    for (const product of cart) {
        const {productId, quantity} = product
    
        const updated = await Product.findOneAndUpdate( //deduct from inventory
            {productId, quantity: {"$gte" : quantity}},
            {"$inc" : {quantity: -quantity}},
            {session: transactionSess}
        )

        if (!updated) itemOOS.push(productId)
    }

    return itemOOS
}

const rollbackProductQuantity = async (checkoutSessionId) => {

    let transactionRes = true
    const transactionSession = await mongoose.startSession()
    transactionSession.startTransaction()
    try {
        const reserved = await Reservation.findOne({session: checkoutSessionId})
        if (!reserved) throw new Error ("Missing inventory reservation data. Please contact admin")

        for (const product of reserved.products) {
            const {productId, quantity} = product

            const updated = await Product.findOneAndUpdate(
                {productId},
                { "$inc" : {quantity}},
                {session : transactionSession}
            )
            if (!updated) throw new Error(`Error updating product ${productId}`)
        }

        await Reservation.deleteOne({ session: checkoutSessionId }, { session: transactionSession })

        await transactionSession.commitTransaction()
    } catch (err) {
        await transactionSession.abortTransaction(); //Undo all transaction
        console.error('Transaction aborted:', err.message);
        transactionRes = false
    } finally {
        transactionSession.endSession();
    }
    console.log("Rollback complete")
    return transactionRes
}


export { getAll, getById, deductProductQuantity, rollbackProductQuantity}