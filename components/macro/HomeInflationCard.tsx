import type {
  RiskCategory,
  InflationMeta,
  RiskLevel
} from "@/lib/types";
import { getMacroBg, getMacroTextColor } from "@/lib/ui";

/* ===================================================== */
/* Component                                             */
/* ===================================================== */

export default function HomeInflationCard({
  inflation,
}: {
  inflation: RiskCategory;
}) {
  // Narrow meta safely
  const meta: InflationMeta | undefined =
    inflation.slug === "inflation"
      ? (inflation.meta as InflationMeta | undefined)
      : undefined;

  const headlineYoY = meta?.headline ?? null;
  const coreYoY = meta?.core ?? null;
  const breakeven5y = meta?.breakeven ?? null;

  return (
    <div className="rounded-xl shadow p-6 bg-white border">
      <Header state={inflation.state} />

      <div className="grid grid-cols-3 gap-4 text-center">
        <Metric label="Headline YoY" value={headlineYoY} suffix="%" />
        <Metric label="Core YoY" value={coreYoY} suffix="%" />
        <Metric label="5Y Breakeven" value={breakeven5y} suffix="%" />
      </div>
    </div>
  );
}

/* ===================================================== */
/* Header                                                */
/* ===================================================== */

function Header({ state }: { state: RiskLevel }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Inflation</h2>

      <span
        className={`px-3 py-1 text-sm rounded-full ${getMacroBg(
          state
        )} ${getMacroTextColor(state)}`}
      >
        {state.toUpperCase()}
      </span>
    </div>
  );
}

/* ===================================================== */
/* Metric Component                                      */
/* ===================================================== */

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | null;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="text-lg font-semibold">
        {typeof value === "number"
          ? `${value.toFixed(1)}${suffix ?? ""}`
          : "—"}
      </div>
    </div>
  );
}