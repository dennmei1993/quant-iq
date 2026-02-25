// app/api/debug-inflation/route.ts
import { computeInflation } from "@/lib/modules/inflation";

export async function GET() {
  const data = await computeInflation();
  return Response.json(data);
}