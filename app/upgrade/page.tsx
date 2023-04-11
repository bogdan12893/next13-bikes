"use client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import React, { useState } from "react";

export default function UpgradeAccountPage() {
  const [isDisabled, setIsDisabled] = useState(false);

  const processPayment = async () => {
    setIsDisabled(true);
    const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    const { data } = await axios.get(`/api/payment`);
    await stripe?.redirectToCheckout({ sessionId: data.id });
    setIsDisabled(false);
  };

  return (
    <div className="flex justify-center my-10 mx-3">
      <div className="bg-teal-500 rounded-lg p-5 w-full md:w-1/2 text-center">
        <h1 className="text-2xl font-bold">Upgrade to PRO</h1>
        <p className="font-bold my-2">Add unlimited bikes!</p>
        <p>For only</p>
        <p className="text-xl font-bold mb-5">🔥20Lei🔥</p>
        <button
          onClick={processPayment}
          disabled={isDisabled}
          className="font-bold"
        >
          {isDisabled ? "Processing..." : "Become a PRO"}
        </button>
      </div>
    </div>
  );
}
