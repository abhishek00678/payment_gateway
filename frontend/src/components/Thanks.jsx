import React from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OzZ2cSCVBiqJU7SzyqD4wqDPqpfyxJ6qQ5JAO5uskukKVRODSXWDiOCvQAlmGrkjTfiUnd4U3jx23RpbMLQaWEt00kujf7BXX"
);

const Thanks = () => {
  console.log(stripePromise);

  return (
    <div>
      <h1>Thanks</h1>
      <p>Thanks for shopping with us!</p>
      {/* Adding a Link to the home page */}
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default Thanks;
