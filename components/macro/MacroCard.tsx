import Link from "next/link";
import { MacroCategory } from "@/lib/types";
import { getMacroBg, getMacroTextColor } from "@/lib/ui";

export default function MacroCard({ item }: { item: MacroCategory }) {
  return (
    <Link
      href={`/dashboard/${item.slug}`}
      className="group bg-white border rounded-lg p-7 shadow-sm hover:shadow-md transition"
    >
      <div className="space-y-5">

        <div className="flex justify-between">
          <h3 className="font-semibold tracking-tight">{item.label}</h3>

          <span
            className={`text-xs px-3 py-1 rounded-full ${getMacroBg(
              item.score
            )} ${getMacroTextColor(item.score)}`}
          >
            {item.status}
          </span>
        </div>

        {item.summary && (
          <p className="text-sm text-gray-600">{item.summary}</p>
        )}

        <div className="text-sm text-gray-500 group-hover:text-black">
          View Detailed Analysis →
        </div>

      </div>
    </Link>
  );
}