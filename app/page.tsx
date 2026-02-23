"use client";

import { useState } from "react";
import Link from "next/link";
import Sparkline from "../components/Sparkline";

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

  // ---- Global Risk Mock Data ----
  const regime = "Defensive Bias";
  const riskScore = -2.3;

  const categories = [
    {
      slug: "inflation",
      label: "Inflation",
      status: "Moderating",
      summary: "Price momentum has eased relative to peak levels.",
      trend: [2.1, 2.4, 3.2, 4.5, 5.8, 4.9, 3.8, 3.2],
    },
    {
      slug: "rates",
      label: "Interest Rates",
      status: "Elevated",
      summary: "Policy rates remain above long-term neutral levels.",
      trend: [0.5, 0.75, 1.5, 2.5, 3.5, 4.25, 4.5, 4.5],
    },
    {
      slug: "growth",
      label: "Growth",
      status: "Slowing",
      summary: "Leading indicators point to moderating expansion.",
      trend: [55, 54, 53, 52, 50, 49, 48, 47],
    },
    {
      slug: "market",
      label: "Market Conditions",
      status: "Cautious",
      summary: "Volatility remains above historical median levels.",
      trend: [15, 16, 18, 22, 28, 24, 21, 19],
    },
    {
      slug: "geopolitics",
      label: "Key Events",
      status: "Moderate",
      summary: "Ongoing structural geopolitical developments.",
      trend: [1, 1, 2, 2, 3, 3, 2, 2],
    },
  ];

  const getBorderStyle = (status: string) => {
    switch (status) {
      case "Moderating":
        return "border-l-4 border-l-blue-500";
      case "Elevated":
        return "border-l-4 border-l-amber-500";
      case "Slowing":
        return "border-l-4 border-l-gray-500";
      case "Cautious":
        return "border-l-4 border-l-amber-500";
      default:
        return "border-l-4 border-l-gray-400";
    }
  };

  const normalizedPosition = ((riskScore + 4) / 8) * 100;

  return (
    <main className="bg-white text-black">

      {/* Navbar */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold tracking-tight">
            Quant IQ
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <a href="#risk" className="hover:text-black">Global Risk</a>
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
            A disciplined framework for asset allocation, macro context,
            and long-term capital growth. Built for investors who value
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

      {/* Global Risk Section */}
      <section id="risk" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Regime Summary */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Current Global Environment
                </p>
                <h3 className="text-xl font-semibold">
                  {regime}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  Composite Risk Score
                </p>
                <p className="text-lg font-semibold">
                  {riskScore}
                </p>
              </div>
            </div>

            <div className="mt-6 relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 h-2 bg-gray-400 rounded-full"
                style={{ width: `${normalizedPosition}%` }}
              />
              <div
                className="absolute top-[-5px] w-4 h-4 bg-black rounded-full"
                style={{ left: `calc(${normalizedPosition}% - 8px)` }}
              />
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/dashboard/${item.slug}`}
                className={`group bg-white border rounded-lg p-7 shadow-sm hover:shadow-md transition-all duration-200 ${getBorderStyle(item.status)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.label}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Updated
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {item.summary}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {item.status}
                  </span>
                  <Sparkline data={item.trend} />
                </div>

                <div className="mt-5 text-sm text-gray-500 group-hover:text-black transition">
                  View Detailed Analysis →
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
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
                without relying on short-term narratives.
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
      <section id="approach" className="py-24 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Framework Over Forecast
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Quant IQ emphasizes structural alignment and macro awareness.
            The platform is designed for educational insight and disciplined
            portfolio decision support.
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