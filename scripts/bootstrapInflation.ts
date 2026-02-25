import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { runInflationJob } from "../lib/jobs/inflationJob";

runInflationJob()
  .then((res) => {
    if (res?.skipped) {
      console.log("Inflation signal already exists. Skipped.");
    } else {
      console.log("Inflation signal generated successfully.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Bootstrap error:", err);
    process.exit(1);
  });