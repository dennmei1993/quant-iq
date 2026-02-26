import { notFound } from "next/navigation";
import { getRiskState } from "@/lib/riskEngine";
import type { RiskCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MacroDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await props.params;

  const risk = await getRiskState();

  const category = risk.categories.find(
    (c) => c.slug === slug
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <Header category={category} />

        {/* Summary / Headlines */}
        <SummarySection category={category} />

        {/* Regime Card */}
        <RegimeCard
          state={category.state}
          score={category.score}
        />

        {/* Category-Specific Blocks */}
        {slug === "inflation" && (
          <InflationBlock category={category} />
        )}

        {slug === "key_event" && (
          <KeyEventBlock category={category} />
        )}

      </div>
    </main>
  );
}

/* ===================================================== */
/* Header                                                */
/* ===================================================== */

function Header({ category }: { category: RiskCategory }) {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold">
        {category.label} Analysis
      </h1>
      <p className="text-gray-500 text-sm">
        Educational insight only. Not investment advice.
      </p>
    </div>
  );
}

/* ===================================================== */
/* Summary Section                                       */
/* ===================================================== */

function SummarySection({ category }: { category: RiskCategory }) {
  if (!category.summary) return null;

  // Special rendering for key_event (3 headline lines)
  if (category.slug === "key_event") {
    return (
      <div className="bg-gray-50 border rounded-lg p-6 space-y-3">
        {category.summary.split(" | ").map((line, i) => (
          <div key={i} className="text-gray-700">
            • {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-6 text-gray-700 whitespace-pre-line">
      {category.summary}
    </div>
  );
}

/* ===================================================== */
/* Regime Card                                           */
/* ===================================================== */

function RegimeCard({
  state,
  score,
}: {
  state: string;
  score: number;
}) {
  function getRegimeColor(score: number) {
    if (score >= 1) return "bg-red-50 text-red-700";
    if (score <= -1) return "bg-blue-50 text-blue-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className={`rounded-lg border p-6 ${getRegimeColor(score)}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-70">
            Current Regime
          </p>
          <p className="text-xl font-semibold">
            {state}
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
  );
}

/* ===================================================== */
/* Inflation Block                                       */
/* ===================================================== */

function InflationBlock({
  category,
}: {
  category: RiskCategory;
}) {
  const meta = category.meta as
    | {
        headline?: number | null;
        core?: number | null;
        breakeven?: number | null;
        momentum?: number | null;
      }
    | undefined;

  if (!meta) return null;

  return (
    <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Key Metrics
      </h2>

      <Metric label="Headline CPI" value={meta.headline} />
      <Metric label="Core CPI" value={meta.core} />
      <Metric label="5Y Breakeven" value={meta.breakeven} />
      <Metric label="3M Momentum" value={meta.momentum} />
    </div>
  );
}

/* ===================================================== */
/* Key Event Block                                       */
/* ===================================================== */

function KeyEventBlock({
  category,
}: {
  category: RiskCategory;
}) {
  const deep = (category.meta as any)?.deep;

  if (!deep?.events) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">
        Detailed Analysis
      </h2>

      {deep.events.map(
        (
          event: {
            headline: string;
            analysis: string;
            impact_tone: string;
            impact_score: number;
            importance: number;
          },
          index: number
        ) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {event.headline}
              </h3>
              <span className="text-xs text-gray-500">
                {event.impact_tone} ({event.impact_score.toFixed(2)})
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.analysis}
            </p>
          </div>
        )
      )}
    </div>
  );
}

/* ===================================================== */
/* Metric Component                                      */
/* ===================================================== */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">
        {typeof value === "number"
          ? `${value.toFixed(1)}%`
          : "N/A"}
      </span>
    </div>
  );
}