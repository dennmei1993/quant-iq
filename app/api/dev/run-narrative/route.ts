import { NextResponse } from "next/server";
import {
  generateEvaluatedSummary,
  generateMacroDeepAnalysis,
  type MacroInput
} from "@/lib/llm/macroNarrative";

export async function POST(req: Request) {
  try {
    const { input, config } = await req.json();

    const macroInput: MacroInput = input;

    const narrative = await generateEvaluatedSummary(
      macroInput,
      config
    );

    const deep = await generateMacroDeepAnalysis(macroInput, config);

    return NextResponse.json({
      narrative,
      deep,
      summaryWordCount: narrative.summary.split(" ").length
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}