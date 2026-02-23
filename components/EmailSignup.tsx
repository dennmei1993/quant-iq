"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setStatus("Please enter a valid email.");
      return;
    }

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("Thank you. You're on the list.");
      setEmail("");
    } else {
      setStatus("Something went wrong.");
    }
  };

  return (
    <section
      id="early"
      className="py-24 bg-black text-white px-6 text-center"
    >
      <div className="max-w-xl mx-auto space-y-8">
        <h2 className="text-3xl font-semibold">
          Join Early Access
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 w-72"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-white text-black rounded-md font-medium"
          >
            Join
          </button>
        </div>

        {status && (
          <p className="text-sm text-gray-300">{status}</p>
        )}
      </div>
    </section>
  );
}