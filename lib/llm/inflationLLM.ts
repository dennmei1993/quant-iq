import OpenAI from "openai";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({ apiKey });
}

export async function generateInflationSignal(metrics: any) {
  const openai = getOpenAI();

  // --------------------------------------------------
  // 1️⃣ Structured Classification (Schema-Enforced)
  // --------------------------------------------------

  const structuredResponse = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          "Classify inflation regime using provided metrics. Be concise and consistent."
      },
      {
        role: "user",
        content: JSON.stringify(metrics)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "inflation_signal",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            regime: { type: "string" },
            confidence: { type: "number" },
            policy_bias: { type: "string" },
            risk_bias: { type: "string" }
          },
          required: [
            "regime",
            "confidence",
            "policy_bias",
            "risk_bias"
          ]
        }
      }
    } as any // Type assertion due to custom response format
  });

  let structured: any = {
    regime: metrics.regime ?? "Neutral",
    confidence: 0.5,
    policy_bias: "neutral",
    risk_bias: "neutral"
  };

  try {
    if (structuredResponse.output_text) {
      structured = JSON.parse(structuredResponse.output_text);
    }
  } catch {
    // fallback silently to deterministic default
  }

  // --------------------------------------------------
  // 2️⃣ Public Summary
  // --------------------------------------------------

  const summaryResponse = await openai.responses.create({
    model: "gpt-4.1",
    input: `
Provide a concise 2-3 sentence professional macro summary based on:

Headline YoY: ${metrics.headlineYoY}
Core YoY: ${metrics.coreYoY}
Momentum: ${metrics.coreMomentum}
Breakeven: ${metrics.breakeven5y}
Regime: ${structured.regime}
`
  });

  const summary =
    summaryResponse.output_text ??
    `Inflation regime currently classified as ${structured.regime}.`;

  // --------------------------------------------------
  // 3️⃣ Deep Analysis
  // --------------------------------------------------

  const deepResponse = await openai.responses.create({
    model: "gpt-4.1",
    input: `
Provide a detailed professional macro analysis including:
- Structural inflation level
- Short-term momentum
- Market expectations
- Policy implications
- Risk asset implications

Metrics:
${JSON.stringify(metrics, null, 2)}

Classification:
${JSON.stringify(structured, null, 2)}
`
  });

  const deep =
    deepResponse.output_text ??
    `Current inflation regime is ${structured.regime}. Core inflation stands at ${metrics.coreYoY}%.`;

  return {
    structured,
    summary,
    deep
  };
}