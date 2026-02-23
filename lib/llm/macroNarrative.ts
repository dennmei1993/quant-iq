import OpenAI from "openai";

console.log("Key exists:", !!process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


type MacroInput = {
  headlineYoY: number | null;
  coreYoY: number | null;
  momentum: number | null;
  breakeven5y: number | null;
  regime: string;
};



export async function generateMacroSummary(input: MacroInput) {
  const prompt = `
You are a macroeconomic analyst writing a concise dashboard summary.

Data:
Headline CPI: ${input.headlineYoY}%
Core CPI: ${input.coreYoY}%
3M Momentum: ${input.momentum}%
5Y Breakeven: ${input.breakeven5y}%
Regime: ${input.regime}

Write 2–3 concise sentences.
Educational tone only.
Do not give investment advice.
Use language suitable for a general audience.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return response.choices[0].message.content;
}

export async function generateMacroDeepAnalysis(input: MacroInput) {
  const prompt = `
You are a macroeconomic strategist preparing a structured analysis.

Data:
Headline CPI: ${input.headlineYoY}%
Core CPI: ${input.coreYoY}%
3M Momentum: ${input.momentum}%
5Y Breakeven: ${input.breakeven5y}%
Regime: ${input.regime}

Provide structured output with sections:

1. Current Inflation State
2. Drivers and Momentum
3. Market Context
4. Risk Considerations

Educational tone.
No direct portfolio recommendations.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return response.choices[0].message.content;
}