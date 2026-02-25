import dotenv from "dotenv";

if (!process.env.OPENAI_API_KEY) {
  dotenv.config({ path: ".env.local" });
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type MacroInput = {
  headlineYoY: number | null;
  coreYoY: number | null;
  momentum: number | null;
  breakeven5y: number | null;
  score: number;
  regime: string;
};

export type InflationNarrative = {
  publicSummary: string;          // 1 strong signal sentence
  headline: string;               // optional short header
  summary: string;                // 3-4 sentences
  keyRisks: string;
};

export type NarrativeConfig = {
  maxWords?: number;
  tone?: "neutral" | "cautious" | "constructive";
  audience?: "retail" | "advisor";
};

const defaultConfig: Required<NarrativeConfig> = {
  maxWords: 120,
  tone: "neutral",
  audience: "retail",
};

export async function generateMacroSummary(
  input: MacroInput,
  config?: NarrativeConfig
): Promise<InflationNarrative> {

  const finalConfig = { ...defaultConfig, ...config };

  const systemPrompt = `
You are a macro strategist writing for ${finalConfig.audience} investors.
Tone: ${finalConfig.tone}.
Be concise and practical.
Maximum ${finalConfig.maxWords} words for summary.
Focus on portfolio implications.
Return structured JSON only.
`;

  const userPrompt = `
Inflation Data:
Headline YoY: ${input.headlineYoY}%
Core YoY: ${input.coreYoY}%
3M Momentum: ${input.momentum}
5Y Breakeven: ${input.breakeven5y}%
Score: ${input.score}
Regime: ${input.regime}

Return JSON:
{
  "headline": "max 120 characters",
  "summary": "3-4 concise sentences",
  "keyRisks": "1-2 forward risks"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    temperature: 0.35,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  return JSON.parse(response.choices[0].message.content!);
}

export async function generateMacroDeepAnalysis(
  input: MacroInput,
  config?: NarrativeConfig
): Promise<any> {

  const finalConfig = { ...defaultConfig, ...config };

  /* =============================
     Direction = Score Driven
     Strength = Tone Driven
  ============================== */

  const direction =
    input.score >= 1
      ? "positive"
      : input.score <= -1
      ? "negative"
      : "neutral";

  const strength =
    finalConfig.tone === "cautious"
      ? "strong"
      : finalConfig.tone === "constructive"
      ? "mild"
      : "moderate";

  /* Map direction + strength into fixed prefixes */

  function buildPrefix(asset: string) {
    if (direction === "positive") {
      if (strength === "strong") return `Strongly supportive of ${asset}`;
      if (strength === "moderate") return `Supportive of ${asset}`;
      return `Mildly supportive of ${asset}`;
    }

    if (direction === "negative") {
      if (strength === "strong") return `Strongly pressured for ${asset}`;
      if (strength === "moderate") return `Pressured for ${asset}`;
      return `Mildly pressured for ${asset}`;
    }

    return `Neutral for ${asset}`;
  }

  const stockPrefix = buildPrefix("stocks");
  const bondPrefix = buildPrefix("bonds");
  const goldPrefix = buildPrefix("gold");
  const silverPrefix = buildPrefix("silver");
  const oilPrefix = buildPrefix("oil");

  const systemPrompt = `
You are a professional macro strategist.
Return structured JSON only.
Be concise and economically consistent.
`;

  const userPrompt = `
Inflation Score: ${input.score}
Regime: ${input.regime}
Headline: ${input.headlineYoY}
Core: ${input.coreYoY}
Momentum: ${input.momentum}
Breakeven: ${input.breakeven5y}

Asset Direction: ${direction}
Bias Strength: ${strength}

You MUST use the exact prefixes below.

Stocks section MUST start with:
"${stockPrefix}"

Then distinguish clearly:
- Growth stocks
- Value stocks

You must provide separate analysis for growth vs value within stocks, but keep the overall stock section under 90 words.  

Bonds section MUST start with:
"${bondPrefix}"

Then distinguish clearly:
- Short duration
- Long duration

You must provide separate analysis for short vs long duration within bonds, but keep the overall bonds section under 90 words.

Gold section MUST start with:
"${goldPrefix}"

You must discuss gold as an inflation hedge and safe haven, but keep the gold section under 90 words.

Silver section MUST start with:
"${silverPrefix}"

You must discuss silver's industrial demand and inflation hedge properties, but keep the silver section under 90 words.

Oil section MUST start with:
"${oilPrefix}"

You must discuss oil in the context of economic growth and inflation, but keep the oil section under 90 words.

Return EXACT JSON:

{
  "drivers": "",
  "stocks": "",
  "bonds": "",
  "gold": "",
  "silver": "",
  "oil": "",
  "regimeShiftRisk": ""
}

Rules:
- Do not change prefix wording.
- Keep each section under 90 words.
- Be explicit and directional.
- Do not repeat public summary.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  return JSON.parse(response.choices[0].message.content!);
}

async function evaluateNarrative(text: string): Promise<number> {

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are evaluating macro commentary for retail usefulness."
      },
      {
        role: "user",
        content: `
Evaluate this text on a scale of 1-5:

Criteria:
- Under 120 words
- Clear and concise
- Retail investor friendly
- Actionable for portfolio decisions

Return only a number.

Text:
${text}
`
      }
    ]
  });

  return Number(response.choices[0].message.content?.trim() || 3);
}

export async function generateEvaluatedSummary(
  input: MacroInput,
  config?: NarrativeConfig
): Promise<InflationNarrative> {

  let narrative = await generateMacroSummary(input, config);

  const score = await evaluateNarrative(narrative.summary);

  if (score < 4) {
    narrative = await generateMacroSummary(input, {
      ...config,
      tone: "neutral",
      maxWords: 100
    });
  }

  return narrative;
}