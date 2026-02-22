"use client";

import { useState } from "react";

export default function Home() {
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Quant IQ</h1>
        <p className="text-gray-600">
          Intelligent portfolio systems for disciplined investors.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded w-72"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Join
          </button>
        </div>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </main>
  );
}