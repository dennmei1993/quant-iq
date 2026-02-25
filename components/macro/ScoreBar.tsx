import { normalizeScore } from "@/lib/ui";

export default function ScoreBar({ score }: { score: number }) {
  const position = normalizeScore(score);

  return (
    <div className="mt-6 relative h-2 bg-gray-200 rounded-full">
      <div
        className="absolute top-0 h-2 bg-gray-400 rounded-full"
        style={{ width: `${position}%` }}
      />
      <div
        className="absolute top-[-5px] w-4 h-4 bg-black rounded-full"
        style={{ left: `calc(${position}% - 8px)` }}
      />
    </div>
  );
}