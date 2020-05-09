# Integrating Stripe with React, Redux and Express in an E-commerce app

## About this app

- This project was bootstrapped with [Create React App](https://create-react-app.dev/docs/getting-started).
- This app is using [React](https://reactjs.org/) and [Express](https://expressjs.com/).
- Libraries used: [Redux](https://redux.js.org/), [Formik](https://jaredpalmer.com/formik/docs/overview), [Axios](https://github.com/axios/axios), [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
- The react part is the the root folder, while the express part is in the `server` folder.
- The react app has the components organized following an [atomic design structure](https://medium.com/better-programming/atomic-design-for-developers-part-1-b41e547a555c)
- The react app is using functional components with [hooks](https://reactjs.org/docs/hooks-intro.html)
- Form validation logic is done in `src/helpers/validation.js` which might look intimidating when you want to add new validation rules, but it offers a scalable solution and extending validation for new inputs with similar rules is extremely ease because of this file. All you need to do is add your new input in `src/constants/validation.js` and let the magic happen. You can specify if the field should be `required`, type of field, `minLength` and `maxLength`. When validation is broken by the customer, the app will show the appropriate errors.

## How to run this app

1. Rename `.env.example` to `.env` and change the keys with your own. Every time you change your env variables you will need to restart the app.
2. Rename `server/.env.example` to `server/.env` and change the keys with your own.
3. Into your root path, run `npm i` to install the packages on the front end, than start the front end server with `npm start`
4. Into your root path, run `cd server` and `npm i` to install the packages on the back end and start the back end server with `npm start`
5. Open http://localhost:3000 to view it in the browser.

## Stripe integration

1. Load stripe in the react app in `src/index.js`:

```javascript
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

2. Wrap your app with the stripe promise

```javascript
import { Elements } from '@stripe/react-stripe-js';
<Elements stripe={stripePromise}>
  <App />
</Elements>;
```

3. In `src/components/molecules/CardSection/CardSection.js`,

3a. Create the stripe elements and respond to input changes

```javascript
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
// You can also use a simpler version of the Stripe form with <CardElement />
<label>
  Card number
  <CardNumberElement onChange={handleChange}/>
</label>
<label>
  Expiration date
  <CardExpiryElement onChange={handleChange}/>
</label>
<label>
  CVC
  <CardCvcElement onChange={handleChange}/>
</label>
```

3b. Style the Stripe form by injecting styles into the iframe

```javascript
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: 16,
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
};

// add the options object on every stripe card element
<CardNumberElement onChange={handleChange}
          options={CARD_ELEMENT_OPTIONS} />

<CardExpiryElement onChange={handleChange} options={CARD_ELEMENT_OPTIONS} />

<CardCvcElement onChange={handleChange} options={CARD_ELEMENT_OPTIONS} />
```

3c. Stop user from submitting multiple times, in order to avoid multiple charges. Also, show stripe error if any

```javascript
<button type="submit" disabled={!stripe || isSubmitting}>
  {isSubmitting ? 'Submitting...' : `Pay S$ ${total}`}
</button>;
{
  error && <span className="error">{error}</span>;
}
```

4. Include the `CardSection` in the `Formik` form in `src/components/organisms/Billing/Billing.js`

```javascript
<CardSection
  stripe={stripe}
  isSubmitting={isSubmitting}
  error={error}
  handleChange={handleCardElementsChange}
/>
```

5. Get the stripe instance in `src/components/organisms/Billing/Billing.js`

```javascript
// The useStripe hook returns a reference to the Stripe instance passed to the Elements provider.
const stripe = useStripe();
```

6. Get the stripe form components in `src/components/organisms/Billing/Billing.js`

```javascript
// To safely pass the payment information collected by an Element to the Stripe API, access the component’s underlying Element instance so that you can use it with other Stripe.js methods.
const elements = useElements();
```

7. Respond to the form submission in the `onSubmit` function in `src/components/organisms/Billing/Billing.js`

7a. disable form submission until Stripe has loaded

```javascript
const isStripeLoading = !stripe || !elements;

if (isStripeLoading) {
  setSubmitting(false);
  return;
}
```

7b. Create a payment intent and get a client secret from the server. The client secret should still be handled carefully because it can complete the charge. Do not log it, embed it in URLs, or expose it to anyone but the customer.

```javascript
try {
  const {
    data: { client_secret: clientSecret }
  } = await Axios.post('payment/secret', {
    products: cart.products.map((product) => ({
      id: product.id,
      quantity: product.quantity
    })),
    email: values.email
  });
}
```

7c. Confirm the payment

```javascript
const getBillingDetails = (values) => {
  return {
    address: {
      // You can use select elements to accept more countries, cities, states
      // and retrieve the data from "values"
      city: 'Singapore',
      country: 'SG',
      state: 'Singapore',
      line1: values.address,
      line2: null,
      postal_code: values.zip
    },
    email: values.email,
    name: values.name,
    phone: values.phone
  };
};

// This will confirm the PaymentIntent with data you provide and carry out 3DS or other next actions if they are required.
const cardPayment = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardNumberElement),
    billing_details: getBillingDetails(values)
  }
});
```

7d. Handle success and error cases

```javascript
const handleCardElementsChange = (event) => {
  // Set error message to be shown when the user inputs incorrect payment data
  if (event.error) {
    setError(event.error.message);
  } else {
    setError('');
  }
};

try {
  //...
  if (cardPayment.error) {
    setError(cardPayment.error.message); // Card error, like insufficient funds
  } else if (cardPayment.paymentIntent.status === 'succeeded') {
    afterPaymentSuccess(cardPayment.paymentIntent); // Success case
  }
} catch (err) {
  setError(err.message); // Server error from your server or from Stripe
} finally {
  setSubmitting(false);
}
```

7e. Handle success case by clearing the cart and redirecting to the success page

```javascript
const afterPaymentSuccess = (paymentIntent) => {
  /* There's a risk of the customer closing the window before this is executed
     Set up a webhook or plugin to listen for the payment_intent.succeeded event that handles any business critical post-payment actions.
     */
  dispatch(clearCart());

  const { amount, id } = paymentIntent;

  // Redirect to success page
  history.push(`/success?amount=${amount}&id=${id}`, {
    from: 'checkout'
  });
};
```

8. Create the payment intent on the server and return the client secret in `server/routes/payment.js`. The client secret should still be handled carefully because it can complete the charge. Do not log it, embed it in URLs, or expose it to anyone but the customer.

```javascript
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
```

9. Use webhooks to respond to offline payment events, instead of responding to the payment response on the client side because the customer can close the page. Using the webhook you can send an order confirmation email to your customer, log the sale in a database, or start a shipping workflow.

```javascript
// in server/app.js
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.includes('/webhook')) {
        req.rawBody = buf.toString();
      }
    }
  })
);

// in server/routes/payment.js
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
```

10. Test the webhook.

- Install the [stripe cli](https://stripe.com/docs/stripe-cli) and login
- run `stripe listen --forward-to http://localhost:5000/payment/webhook`
- previous step will return you a webhook signing secret, you need to place this in server/.env as `STRIPE_WEBHOOK_SECRET`
- in another terminal window, run `stripe trigger payment_intent.succeeded`
- After trigger succeeds, you should see in the other window, status `200` and that the charge and payment intent succeeded. Your server will also log `PaymentIntent was created! POST /payment/webhook 200`

11. Test the integration with our [test cards](https://stripe.com/docs/payments/accept-a-payment#web-test-integration).

12. Activate your account in the stripe dashboard to get your live API keys.

13. Enjoy and thank you for using Stripe! If you need any more help just let us know. It's our pleasure to help you.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
