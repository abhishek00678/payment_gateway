import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendPaymentIntentToBackend = async (paymentIntentId, amount) => {
    try {
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId,
          type: "payment_intent.succeeded",
          data: { amount: amount, id: paymentIntentId },
        }),
      });

      if (response.ok) {
        console.log("PaymentIntent ID sent to backend successfully");
      } else {
        console.error("Failed to send PaymentIntent ID to backend");
      }
    } catch (error) {
      console.error("Error sending PaymentIntent ID to backend:", error);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent, "Intent");
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          sendPaymentIntentToBackend(paymentIntent.id, paymentIntent.amount);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    const create_checkout = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: "payment",
              lineItems: [
                { price: "price_1Oza44SCVBiqJU7SiKFYWsAz", quantity: 1 },
              ],
              successUrl: `${window.location.origin}/thanks`,
              cancelUrl: `${window.location.origin}/cancel`,
            }),
          }
        );
      } catch (e) {}
    };
    create_checkout();
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
