import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env.local" });

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}