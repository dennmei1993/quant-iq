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
    <main className="bg-white text-black">

      {/* Navbar */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold tracking-tight">
            Quant IQ
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#approach" className="hover:text-black">Approach</a>
            <a href="#early" className="hover:text-black">Early Access</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Systematic Portfolio Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            A disciplined framework for asset allocation, factor exposure,
            and long-term capital growth. Designed for investors who value
            structure over speculation.
          </p>
          <a
            href="#early"
            className="inline-block px-8 py-3 bg-black text-white rounded-md text-sm font-medium"
          >
            Request Early Access
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-16">
            Core Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold mb-4">
                Allocation Discipline
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Define strategic allocation targets and monitor deviations
                systematically across asset classes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                Factor Transparency
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Understand exposure to size, style, and macro drivers
                without relying on short-term market narratives.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                Structured Rebalancing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Maintain long-term alignment through objective,
                repeatable portfolio adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="approach" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Framework Over Forecast
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Quant IQ is built on the principle that disciplined structure
            outperforms reactive decision-making. Our platform focuses on
            portfolio construction logic rather than short-term prediction.
          </p>
        </div>
      </section>

      {/* Email Capture */}
      <section
        id="early"
        className="py-24 bg-black text-white px-6 text-center"
      >
        <div className="max-w-xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold">
            Join Early Access
          </h2>
          <p className="text-gray-300 text-sm">
            We are building a disciplined portfolio intelligence platform.
            Early access will be limited.
          </p>

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

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        © 2026 Quant IQ. All rights reserved.
      </footer>
    </main>
  );
}