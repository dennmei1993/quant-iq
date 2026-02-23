import Link from "next/link";
import { getRiskState } from "../lib/riskEngine";
import EmailSignup from "../components/EmailSignup";

export default async function Home() {
  const risk = await getRiskState();

  const regime = risk.regime;
  const riskScore = risk.score;
  const categories = risk.categories;

  const clampedScore = Math.max(-4, Math.min(4, riskScore));
  const normalizedPosition = ((clampedScore + 4) / 8) * 100;

  // ---------- Macro Color Helpers ----------
  function getMacroTextColor(score: number) {
    if (score >= 1) return "text-red-600";
    if (score <= -1) return "text-blue-600";
    return "text-gray-900";
  }

  function getMacroBg(score: number) {
    if (score >= 1) return "bg-red-50";
    if (score <= -1) return "bg-blue-50";
    return "bg-gray-50";
  }

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

          {/* Composite Regime Summary */}
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
                className="group bg-white border rounded-lg p-7 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-5">

                  {/* Header + Regime Badge */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.label}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getMacroBg(item.score)} ${getMacroTextColor(item.score)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Inflation Structured Metrics */}
                  {item.slug === "inflation" && item.meta && (
                    <>
                      <div className={`rounded-lg p-5 ${getMacroBg(item.score)}`}>
                        <div className="grid grid-cols-3 gap-6 text-center">

                          <div>
                            <p className={`text-xl font-semibold ${getMacroTextColor(item.score)}`}>
                              {typeof item.meta.headline === "number"
                                ? item.meta.headline.toFixed(1)
                                : "N/A"}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Headline
                            </p>
                          </div>

                          <div>
                            <p className={`text-xl font-semibold ${getMacroTextColor(item.score)}`}>
                              {typeof item.meta.core === "number"
                                ? item.meta.core.toFixed(1)
                                : "N/A"}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Core
                            </p>
                          </div>

                          <div>
                            <p className={`text-xl font-semibold ${getMacroTextColor(item.score)}`}>
                              {typeof item.meta.breakeven === "number"
                                ? item.meta.breakeven.toFixed(2)
                                : "N/A"}%
                            </p>
                            <p className="text-xs text-gray-500">
                              5Y BE
                            </p>
                          </div>

                        </div>

                        <div className="mt-4 text-center text-xs text-gray-600">
                          3M Momentum:{" "}
                          {typeof item.meta.momentum === "number"
                            ? item.meta.momentum.toFixed(2)
                            : "N/A"}%
                        </div>
                      </div>

                      {/* Dynamic Interpretation */}
                      {item.summary && (
                        <div className="text-sm text-gray-600 leading-relaxed mt-4">
                          {item.summary}
                        </div>
                      )}
                    </>
                  )}

                  {/* Other Categories */}
                  {item.slug !== "inflation" && (
                    <p className="text-sm text-gray-600">
                      {item.summary}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 group-hover:text-black transition">
                    View Detailed Analysis →
                  </div>

                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Last updated: {new Date(risk.lastUpdated).toLocaleDateString()}
          </p>

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
      <EmailSignup />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        © 2026 Quant IQ. All rights reserved.
      </footer>

    </main>
  );
}