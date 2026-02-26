import Link from "next/link";
import type {
  RiskCategory,
  InflationMeta,
  NullableNumber,
} from "@/lib/types";
import { getMacroBg, getMacroTextColor } from "@/lib/ui";

/* ============================= */
/* Type Guard                    */
/* ============================= */

function isInflationCategory(
  item: RiskCategory
): item is RiskCategory & { meta?: InflationMeta } {
  return item.slug === "inflation";
}

/* ============================= */
/* Component                     */
/* ============================= */

export default function MacroCard({
  item,
}: {
  item: RiskCategory;
}) {
  return (
    <Link
      href={`/dashboard/${item.slug}`}
      className="group bg-white border rounded-lg p-7 shadow-sm hover:shadow-md transition"
    >
      <div className="space-y-5">

        {/* Header */}
        <div className="flex justify-between">
          <h3 className="font-semibold tracking-tight">
            {item.label}
          </h3>

          <span
            className={`text-xs px-3 py-1 rounded-full ${getMacroBg(
              item.state
            )} ${getMacroTextColor(item.state)}`}
          >
            {item.state}
          </span>
        </div>

        {/* 🔹 CPI Metrics (Inflation Only) */}
        {isInflationCategory(item) && item.meta && (
          <div className="grid grid-cols-3 gap-4 text-sm text-center">
            <Metric label="Headline" value={item.meta.headline} />
            <Metric label="Core" value={item.meta.core} />
            <Metric label="5Y BE" value={item.meta.breakeven} />
          </div>
        )}

        {/* Summary (supports multi-line headlines) */}
        {item.summary && (
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {item.summary}
          </p>
        )}

        {/* Footer */}
        <div className="text-sm text-gray-500 group-hover:text-black">
          View Detailed Analysis →
        </div>

      </div>
    </Link>
  );
}

/* ============================= */
/* Metric Component              */
/* ============================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: NullableNumber | undefined;
}) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold">
        {value != null ? `${value.toFixed(1)}%` : "—"}
      </div>
    </div>
  );
}