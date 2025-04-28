import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import stripe from '../db/stripe.js'

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




export { getAll, getById, deductProductQuantity}