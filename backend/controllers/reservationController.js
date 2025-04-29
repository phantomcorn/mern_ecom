import Reservation from "../models/reservationModel.js"

// called in precheckout (checkoutController.js)
const createReservation = async (transactionSess, checkoutSess, cart) => {
    const reserveProducts = cart.map((product) => ({productId: product.productId, priceId : product.priceId, quantity: product.quantity}))
    const reserve = await Reservation.create([{ // create reservation
        session: checkoutSess,
        products: reserveProducts
    }], {session: transactionSess})

    return reserve
}

export {createReservation}
