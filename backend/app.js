import express from "express";
import { config } from "dotenv";
import paymentRoute from "./route/payment.js";
import cors from "cors";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OzZ2cSCVBiqJU7SeNTZRI3Emziw22cc0RsazpFEqeScgyB16lOtkoX1u0xvGJhFfw2vWLlKCWFQOWIvYUJ94gJc00Bna4H0gX"
);
export const app = express();

config({
  path: "./database/config.env",
});

// Enable CORS for specific origin
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin to access
    credentials: true, // Allow cookies to be sent and received
  })
);

app.use(express.static("public"));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4242/success",
    cancel_url: "http://localhost:4242/cancel",
  });

  res.redirect(303, session.url);
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  // amt = Number(items[0].price);
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use("/api", paymentRoute);
// app.use("/create-payment-intent", paymentRoute);

export default app;
