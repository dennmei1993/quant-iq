import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { getSupabaseServer } from "../lib/supabaseServer";
import { getOpenAI } from "../lib/openai";
  import type { ResponseOutputMessage } from "openai/resources/responses/responses";

dotenv.config({ path: ".env.local" });

const openai = getOpenAI();

type KeyEvent = {
  headline: string;
  analysis: string;
  impact_score: number;
  impact_tone: "positive" | "neutral" | "negative";
  importance: number;
};

async function generateKeyEvents() {
  const supabase = getSupabaseServer();

  const now = new Date();
  const period = now.toISOString().slice(0, 10);
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const runId = randomUUID();

  console.log("Running key event generation:", now.toISOString());

  /* ============================= */
  /* 1️⃣ Call LLM                  */
  /* ============================= */

  const response = await openai.responses.create({
    model: "gpt-4.1",
    temperature: 0.3,
    input: `
Current UTC time: ${now.toISOString()}.

Identify the 3 most market-relevant macroeconomic or geopolitical events 
in the last 24 hours.

For each:
- Write a concise institutional headline.
- Provide 2–4 paragraphs of analysis.
- Classify impact_tone.
- Assign impact_score (-1 to +1).
- Assign importance (1–5).
`,
    text: {
      format: {
        type: "json_schema",
        name: "key_events",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["events"],
          properties: {
            events: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "headline",
                  "analysis",
                  "impact_tone",
                  "impact_score",
                  "importance"
                ],
                properties: {
                  headline: { type: "string" },
                  analysis: { type: "string" },
                  impact_tone: {
                    type: "string",
                    enum: ["positive", "neutral", "negative"]
                  },
                  impact_score: {
                    type: "number",
                    minimum: -1,
                    maximum: 1
                  },
                  importance: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  /* ============================= */
  /* 2️⃣ Parse Response Safely     */
  /* ============================= */

  const messageItem = response.output.find(
    (item): item is ResponseOutputMessage =>
      item.type === "message"
  );

  if (!messageItem) {
    throw new Error("No message returned from model.");
  }

  const textPart = messageItem.content.find(
    (c) => c.type === "output_text"
  );

  if (!textPart || typeof textPart.text !== "string") {
    throw new Error("No JSON text returned from model.");
  }

  let parsed: any;

  try {
    parsed = JSON.parse(textPart.text);
  } catch {
    throw new Error("Model returned invalid JSON.");
  }

  const events = parsed.events as KeyEvent[];

  if (!Array.isArray(events) || events.length !== 3) {
    throw new Error("Invalid number of events returned.");
  }

  /* ============================= */
  /* 3️⃣ Insert Raw Events         */
  /* ============================= */

  const rawRows = events.map((event) => ({
    run_id: runId,
    as_of: now,
    headline: event.headline,
    analysis: event.analysis,
    impact_tone: event.impact_tone,
    impact_score: event.impact_score,
    importance: event.importance,
    source_window_start: windowStart,
    source_window_end: now
  }));

  const { error: rawError } = await supabase
    .from("macro_key_events")
    .insert(rawRows);

  if (rawError) {
    console.error("Insert into macro_key_events failed:", rawError);
    process.exit(1);
  }

  /* ============================= */
  /* 4️⃣ Aggregate Signal          */
  /* ============================= */

  const avgScore =
    events.reduce((acc, e) => acc + e.impact_score, 0) /
    events.length;

  const tone =
    avgScore > 0.4
      ? "risk-on"
      : avgScore > 0.1
      ? "mild-risk-on"
      : avgScore < -0.4
      ? "risk-off"
      : avgScore < -0.1
      ? "mild-risk-off"
      : "neutral";

  /* ============================= */
  /* 5️⃣ Upsert Canonical Signal   */
  /* ============================= */

  const { error: signalError } = await supabase
    .from("macro_signals")
    .upsert(
      {
        signal_type: "key_event",
        period,

        structured: {
          event_count: events.length,
          avg_impact_score: avgScore,
          tone
        },

        narrative_headline: events
          .map(e => e.headline.trim())
          .join("\n"),

        narrative_deep: {
          headlines: events.map(e => e.headline.trim()),
          events,
          aggregate: {
            avg_score: avgScore,
            tone
          }
        },

        model_version: "gpt-4.1",
        prompt_version: "key_event_v1",
        scoring_version: "v1"
      },
      {
        onConflict: "signal_type,period"
      }
    );

  if (signalError) {
    console.error("Insert into macro_signals failed:", signalError);
    process.exit(1);
  }

  console.log("macro_signals upserted successfully.");
}

/* ============================= */
/* Execute                       */
/* ============================= */

generateKeyEvents().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});