import { getSupabaseServer } from "@/lib/supabaseServer";
import { fetchFredSeries } from "@/lib/data/fred";

export async function GET() {
  const start = Date.now();

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      supabase: "unknown",
      fred: "unknown",
    },
    latencyMs: 0,
  };

  try {
    // ----------------------------
    // 1️⃣ Check Supabase
    // ----------------------------

    try {
      const supabase = getSupabaseServer();

      const { error } = await supabase
        .from("macro_signals")
        .select("id")
        .limit(1);

      if (error) {
        health.services.supabase = "error";
        health.status = "degraded";
      } else {
        health.services.supabase = "ok";
      }
    } catch (err) {
      health.services.supabase = "error";
      health.status = "down";
    }

    // ----------------------------
    // 2️⃣ Check FRED API
    // ----------------------------

    try {
      const data = await fetchFredSeries("CPIAUCSL");

      if (!data || data.length === 0) {
        health.services.fred = "error";
        health.status = "degraded";
      } else {
        health.services.fred = "ok";
      }
    } catch (err) {
      health.services.fred = "error";
      health.status = "down";
    }

    health.latencyMs = Date.now() - start;

    const httpStatus =
      health.status === "ok"
        ? 200
        : health.status === "degraded"
        ? 206
        : 503;

    return Response.json(health, { status: httpStatus });
  } catch (error) {
    return Response.json(
      {
        status: "down",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}