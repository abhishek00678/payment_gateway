import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  amount: Number,
  paymentStatus: String,
  transactionId: String,
});

export const Order = mongoose.model("Order", orderSchema);
