import { getRiskState } from "@/lib/riskEngine";
import { mapRiskToMacro } from "@/lib/mappers";
import MacroCard from "@/components/macro/MacroCard";
import ScoreBar from "@/components/macro/ScoreBar";

export default async function Home() {
  const risk = await getRiskState();

  const {
    regime,
    score,
    categories,
    lastUpdated,
  } = risk;

  // Map engine types → strict UI types
  const macroCategories = categories.map(mapRiskToMacro);

  return (
    <>
      <HeroSection />

      <RiskSection
        regime={regime}
        score={score}
        categories={macroCategories}
        lastUpdated={lastUpdated}
      />
    </>
  );
}

/* ============================= */
/* Sections                      */
/* ============================= */

function HeroSection() {
  return (
    <section className="py-28 px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Systematic Portfolio Intelligence
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A disciplined macro framework for asset allocation,
          structural awareness, and long-term capital preservation.
        </p>
      </div>
    </section>
  );
}

function RiskSection({
  regime,
  score,
  categories,
  lastUpdated,
}: {
  regime: string;
  score: number;
  categories: ReturnType<typeof mapRiskToMacro>[];
  lastUpdated: string;
}) {
  return (
    <section id="risk" className="py-24 bg-gray-50 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        <CompositeSummary regime={regime} score={score} />

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((item) => (
            <MacroCard key={item.slug} item={item} />
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
        </p>

      </div>
    </section>
  );
}

function CompositeSummary({
  regime,
  score,
}: {
  regime: string;
  score: number;
}) {
  return (
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
            {score}
          </p>
        </div>
      </div>

      <ScoreBar score={score} />
    </div>
  );
}