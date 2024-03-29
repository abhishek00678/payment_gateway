import React from "react";
import { Link } from "react-router-dom";

const Thanks = () => {
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
