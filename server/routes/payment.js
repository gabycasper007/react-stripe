const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateTotal = require('../helpers/helper');

const router = express.Router();

/**
 * Create a payment intent, return a Client Secret
 * https://stripe.com/docs/api/payment_intents/object#payment_intent_object-client_secret
 */
router.post('/secret', async (req, res) => {
  const { products, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      // Always decide how much to charge on the server side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.
      amount: calculateTotal(products) * 100, // Stripe used amount in cents
      currency: 'sgd',
      payment_method_types: ['card'],
      receipt_email: email, // customer email, used for invoices and confirmations
      metadata: {
        /** allows testing the integration
        see https://stripe.com/docs/payments/
        accept-a-payment#web-test-integration
         */
        integration_check: 'accept_a_payment',
        // You can pass additional customer/order information. This is visible in your Stripe dashboard, under Metadata of a payment. See https://stripe.com/docs/api/metadata
        order_id: '6735'
      }
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

/**
 * Use webhooks to respond to offline payment events.
 * https://stripe.com/docs/payments/handling-payment-events#build-your-own-webhook
 */
router.post('/webhook', (req, res) => {
  let event;

  const signature = req.headers['stripe-signature'];

  try {
    // Verify the events that Stripe sends to your webhook endpoints.
    // See https://stripe.com/docs/webhooks/signatures
    // and https://stripe.com/docs/payments/handling-payment-events#build-your-own-webhook
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      // Find your webhook secret when you run `stripe listen` (it starts with `whsec_`)
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    return res.status(400);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // send an order confirmation email to your customer, log the sale in a database, or start a shipping workflow. You find the data response on  `event.data`
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_intent.created':
      console.log('PaymentIntent was created!');
      break;
    case 'payment_method.attached':
      console.log('PaymentMethod was attached to a Customer!');
      break;
    case 'payment_method.created':
      console.log('PaymentMethod was created!');
      break;
    case 'charge.succeeded':
      console.log('Charge succeeded!');
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed!');
      return res.status(400).end();
    default:
      // Unexpected event type
      return res.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
});

module.exports = router;
