import express from "express";
import { config } from "dotenv";
import paymentRoute from "./route/payment.js";
import cors from "cors";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const app = express();
app.use(express.json());

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

app.use("/api/payment", paymentRoute);

export default app;
