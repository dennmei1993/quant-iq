import { getRiskState } from "@/lib/riskEngine";
import { notFound } from "next/navigation";
import { Metric }  from "@/components/macro/Metric";
import { getMacroBg } from "@/lib/ui";

export default async function DetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const risk = await getRiskState();
  const category = risk.categories.find(
    (c) => c.slug === params.slug
  );

  if (!category) return notFound();

  return (
    <>
      <section className="py-20 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold">
            {category.label}
          </h1>
        </div>
      </section>

      {category.meta && (
        <section className="py-16 px-6 bg-gray-50">
          <div className={`max-w-4xl mx-auto p-8 rounded-lg ${getMacroBg(category.state)}`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">

              <Metric value={category.meta.headline} decimals={1} label="Headline CPI" level={category.state} />
              <Metric value={category.meta.core} decimals={1} label="Core CPI" level={category.state} />
              <Metric value={category.meta.breakeven} decimals={2} label="5Y Breakeven" level={category.state} />

            </div>
          </div>
        </section>
      )}

      {category.deepAnalysis && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              {category.deepAnalysis}
            </p>
          </div>
        </section>
      )}
    </>
  );
}