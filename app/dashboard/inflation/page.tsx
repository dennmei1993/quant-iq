import { computeInflation } from "../../../lib/modules/inflation";
import LineChart from "../../../components/LineChart";

export default async function InflationPage() {
  const data = await computeInflation();

  const {
    headlineYoY,
    coreYoY,
    coreMomentum,
    breakeven5y,
    regime,
    score,
    series,
    deepAnalysis,
  } = data;

  function getRegimeColor(score: number) {
    if (score >= 1) return "bg-red-50 text-red-700";
    if (score <= -1) return "bg-blue-50 text-blue-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Inflation Analysis
          </h1>
          <p className="text-gray-500 text-sm">
            Live CPI data sourced from FRED.  
            Educational insight only. Not investment advice.
          </p>
        </div>

        {/* Regime Card */}
        <div className={`rounded-lg border p-6 ${getRegimeColor(score)}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">
                Current Inflation Regime
              </p>
              <p className="text-xl font-semibold">
                {regime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">
                Risk Score
              </p>
              <p className="text-lg font-semibold">
                {score.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-600">
              Current Levels
            </h2>

            <Metric
              label="Headline CPI (YoY)"
              value={headlineYoY}
              decimals={1}
            />

            <Metric
              label="Core CPI (YoY)"
              value={coreYoY}
              decimals={1}
            />

            <Metric
              label="5Y Breakeven Inflation"
              value={breakeven5y}
              decimals={2}
            />
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-600">
              Short-Term Dynamics
            </h2>

            <Metric
              label="Core 3M Momentum"
              value={coreMomentum}
              decimals={2}
            />

            <p className="text-xs text-gray-500">
              Momentum reflects 3-month directional pressure in core prices.
            </p>
          </div>

        </div>

        {/* Chart */}
        {series.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              24-Month Trend
            </h2>
            <div className="border rounded-lg p-6 bg-white">
              <LineChart data={series} />
            </div>
          </div>
        )}

        {/* Interpretation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Interpretation
          </h2>
          <div className="bg-gray-50 border rounded-lg p-6 text-gray-700 leading-relaxed">
            {deepAnalysis}
          </div>
        </div>

      </div>
    </main>
  );
}

//
// ------------------------------
// Reusable Metric Component
// ------------------------------

function Metric({
  label,
  value,
  decimals,
}: {
  label: string;
  value: number | null;
  decimals: number;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">
        {label}
      </span>
      <span className="font-semibold">
        {typeof value === "number"
          ? `${value.toFixed(decimals)}%`
          : "N/A"}
      </span>
    </div>
  );
}