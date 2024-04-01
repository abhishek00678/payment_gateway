import { Order } from "../modal/order.js";

export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log("Webhook received:", event);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data;
      console.log("king"); // this if block is not working at all enen this line is not printing
      console.log("Payment Intent:", paymentIntent);

      // Save order details to database
      const order = new Order({
        amount: paymentIntent.amount,
        paymentStatus: "succeeded",
        transactionId: paymentIntent.id,
      });

      await order.save();
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleWebhook:", error);
    res.status(500).send("Internal Server Error");
  }
};
