import { Order } from "../modal/order.js";

export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log("Webhook received:", event);
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("Payment Intent:", paymentIntent);

      // Save order details to database
      const order = new Order({
        amount: paymentIntent.amount,
        paymentStatus: "succeeded",
        transactionId: paymentIntent.id,
      });

      await order.save();

      console.log("Order saved:", order);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleWebhook:", error);
    res.status(500).send("Internal Server Error");
  }
};
