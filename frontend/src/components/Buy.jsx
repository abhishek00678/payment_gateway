import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OzZ2cSCVBiqJU7SzyqD4wqDPqpfyxJ6qQ5JAO5uskukKVRODSXWDiOCvQAlmGrkjTfiUnd4U3jx23RpbMLQaWEt00kujf7BXX"
);

function Buy() {
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleClick = async () => {
    const stripe = await stripePromise;
    const { error, paymentIntent } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1Oza44SCVBiqJU7SiKFYWsAz", quantity: 1 }],
      successUrl: `${window.location.origin}/thanks`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error("Error:", error);
    } else {
      // If payment is successful, send paymentIntent.id to your backend
      console.log("PaymentIntent ID:", paymentIntent.id);
      sendPaymentIntentToBackend(paymentIntent.id);
    }
  };

  const sendPaymentIntentToBackend = async (paymentIntentId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payment/webHook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId }),
        }
      );
      if (response.ok) {
        console.log("PaymentIntent ID sent to backend successfully");
      } else {
        console.error("Failed to send PaymentIntent ID to backend");
      }
    } catch (error) {
      console.error("Error sending PaymentIntent ID to backend:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Checkout with Stripe</h1>
        <div>
          <label>Enter Payment Amount:</label>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </div>
        <button onClick={handleClick}>Buy Now</button>
      </header>
    </div>
  );
}

export default Buy;
