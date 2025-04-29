import { fulfillCheckout } from "../controllers/checkoutController.js";
import { rollbackProductQuantity } from "../controllers/productController.js";
import stripe from "../db/stripe.js";

const hookRoute = async (req,res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (
      event.type === 'checkout.session.completed'
      || event.type === 'checkout.session.async_payment_succeeded'
    ) {

      const customerDetails = event.data.object.customer_details
      fulfillCheckout(event.data.object.id, customerDetails);
    } else if ( event.type === "checkout.session.expired" ) rollbackProductQuantity(event.data.object.id)

    res.status(200).end();
}

export default hookRoute