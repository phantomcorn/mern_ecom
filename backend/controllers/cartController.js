import asyncHandler from "express-async-handler"
import Cart from "../models/cartModel.js"
import crypto from "crypto"
import getPrice from "./../utils/priceConversion.js"
const getCart = asyncHandler(async (req,res) => {
    const session = req.cookies.SESSION
    if (!session) return res.status(200).json({products: [], message: "Session expired"})

    const cart = await Cart.findOne({session: session})
    if (!cart) return res.status(200).json({products: [], message: "No Cart"})
   
    const resp = cart.products.map((product) => ({
        name: product.name,
        productId: product.productId,
        quantity: product.quantity,
        priceCopy: getPrice(product.currency, product.unitAmt),
        totalCopy: getPrice(product.currency, product.unitAmt * product.quantity)
    }))

    return res.status(200).json({products: resp})
})

// @ POST /api/cart/add
// Function called from product page
const addToCart = asyncHandler(async (req,res) => {
    const {name, id, quantity, priceId, unitAmt, currency} = req.body
    if (!name || !id || !priceId || !quantity || !unitAmt || !currency) return res.status(400).json({message: "Missing parameters"})
    const item = {name, productId: id, priceId, quantity, unitAmt, currency}

    let session = req.cookies.SESSION
    let cart
    if (!session) { //on first add to basket, create cart session
        session = crypto.randomBytes(64).toString('hex')
        cart = await Cart.create({session: session, products: [item]})
        //create session
        res.cookie('SESSION', session, {
            httpOnly: true, //accessible only by web server
            secure: true, //use https protocol
            sameSite: "none", //cross-site cookie
            maxAge: 3 * 24 * 60 * 60 * 1000 //match expiryDate in Cart (3d in ms)
        })

        return res.status(200).json({message: "Cart updated (session created)"})
    }  

    //update cart
    //find cart with same product already added
    cart = await Cart.findOneAndUpdate({ //filter
        "session": session, //session === session
        "products.productId": id //get products where products.item === id
    }, {"$inc": { //increment prev value by `quantity`
        "products.$.quantity": quantity
    }}) 

    if (!cart) {
        cart = await Cart.findOneAndUpdate(
            {"session": session}, 
            {"$push": {"products": item}} //push item into cart.products
        )
        if (!cart) { //recreate session
            session = crypto.randomBytes(64).toString('hex')
            cart = await Cart.create({session: session, products: [item]})
            res.cookie('SESSION', session, {
                httpOnly: true, //accessible only by web server
                secure: true, //use https protocol
                sameSite: "none", //cross-site cookie
                maxAge: 3 * 24 * 60 * 60 * 1000 //match expiryDate in Cart (3d in ms)
            })
        }

        return res.status(200).json({message: "Cart updated (Product pushed)"})
    }

    return res.status(200).json({message: "Cart updated (Product incremented)"})
})

// @ POST /api/cart/decr
// Function called from cart page
// Assume cart exists in db, otherwise couldnt call this
const decrFromCart = asyncHandler(async (req,res) => {
    const { id } = req.body
    if (!id) return res.status(400).json({message: "Missing parameters"})

    const session = req.cookies.SESSION

    const cart = await Cart.findOne({"session": session}) 
    if (!cart) return res.status(404).json({message: "Cart not found"})

    // Find index of product with productID
    const productIndex = cart.products.findIndex((product) => product.productId.toString() == id)
    if (productIndex === -1) return res.status(404).json({message: "Product does not exist in cart"})    
    
    const productInCart = cart.products[productIndex]
    const updatedQuantity = productInCart.quantity - 1
    if (updatedQuantity === 0) { 
        // Remove product from cart
        cart.products.splice(productIndex, 1);
    } else {
        // Decrease quantity
        cart.products[productIndex].quantity = updatedQuantity;
    }
    
    await cart.save()
    res.status(200).json({message: "Cart updated succesfully!"})
})

// @ POST /api/cart/incr
// Function called from cart page
// Assume cart exists in db, otherwise couldnt call this
const incrFromCart = asyncHandler(async (req,res) => {
    const { id } = req.body
    if (!id) return res.status(400).json({message: "Missing parameters"})

    const session = req.cookies.SESSION

    const cart = await Cart.findOne({"session": session}) 
    if (!cart) return res.status(404).json({message: "Cart not found"})

    // Find index of product with productID
    const productIndex = cart.products.findIndex((product) => product.productId.toString() == id)
    if (productIndex === -1) return res.status(404).json({message: "Product does not exist in cart"})    
    
    const productInCart = cart.products[productIndex]
    if (productInCart.quantity < 10) { 
        // Decrease quantity
        cart.products[productIndex].quantity += 1
        await cart.save()
    }
    
    res.status(200).json({message: "Cart updated succesfully!"})
})

const clearCart = asyncHandler(async (req,res) => {

    const session = req.cookies.SESSION
    
    await Cart.deleteOne({session})

    return res.status(200).json({message: "Cart cleared"})
})

export { getCart, addToCart, decrFromCart, incrFromCart, clearCart }
