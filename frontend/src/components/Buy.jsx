import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./checkout.css";

const stripePromise = loadStripe(
  "pk_test_51OzZ2cSCVBiqJU7SzyqD4wqDPqpfyxJ6qQ5JAO5uskukKVRODSXWDiOCvQAlmGrkjTfiUnd4U3jx23RpbMLQaWEt00kujf7BXX"
);

function Buy() {
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleClick = async () => {
    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "xl-tshirt", price: paymentAmount }],
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  };

  //Form Data
  const [clientSecret, setClientSecret] = useState("");

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
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
        <button onClick={() => handleClick()}>Buy Now</button>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </header>
    </div>
  );
}

export default Buy;
