"use client";

import { useState } from "react";

export default function NarrativeLab() {

  const [input, setInput] = useState({
    headlineYoY: 2.4,
    coreYoY: 2.5,
    momentum: -0.5,
    breakeven5y: 2.59,
    score: 1,
    regime: "Inflationary Pressure"
  });

  const [configA, setConfigA] = useState({
    tone: "neutral",
    maxWords: 120
  });

  const [configB, setConfigB] = useState({
    tone: "cautious",
    maxWords: 100
  });

  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);

    const bodyA = {
      input,
      config: { ...configA, audience: "retail" }
    };

    const bodyB = {
      input,
      config: { ...configB, audience: "retail" }
    };

    const [resA, resB] = await Promise.all([
      fetch("/api/dev/run-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyA)
      }),
      fetch("/api/dev/run-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyB)
      })
    ]);

    setResultA(await resA.json());
    setResultB(await resB.json());
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Inflation Narrative Lab — Side by Side</h1>

      <h3>Macro Inputs</h3>
      {Object.keys(input).map((key) => (
        <input
          key={key}
          type="text"
          value={(input as any)[key]}
          onChange={(e) =>
            setInput({ ...input, [key]: e.target.value })
          }
          style={{ display: "block", marginBottom: 6 }}
        />
      ))}

      <hr />

      <h3>Version A Config</h3>
      <input
        placeholder="Tone"
        value={configA.tone}
        onChange={(e) =>
          setConfigA({ ...configA, tone: e.target.value })
        }
      />
      <input
        placeholder="Max Words"
        value={configA.maxWords}
        onChange={(e) =>
          setConfigA({ ...configA, maxWords: Number(e.target.value) })
        }
      />

      <h3>Version B Config</h3>
      <input
        placeholder="Tone"
        value={configB.tone}
        onChange={(e) =>
          setConfigB({ ...configB, tone: e.target.value })
        }
      />
      <input
        placeholder="Max Words"
        value={configB.maxWords}
        onChange={(e) =>
          setConfigB({ ...configB, maxWords: Number(e.target.value) })
        }
      />

      <br /><br />

      <button onClick={run} disabled={loading}>
        {loading ? "Generating..." : "Run Comparison"}
      </button>

      <hr />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {resultA && (
          <div>
            <h2>Version A</h2>
            <h3>{resultA.narrative.headline}</h3>
            <p><strong>Summary</strong></p>
            <p>{resultA.narrative.summary}</p>
            <p><strong>Risks</strong></p>
            <p>{resultA.narrative.keyRisks}</p>

            <h3>Stocks</h3>
            <p>{resultA.deep.stocks}</p>

            <h3>Bonds</h3>
            <p>{resultA.deep.bonds}</p>

            <h3>Gold</h3>
            <p>{resultA.deep.gold}</p>


            <h3>Silver</h3>
            <p>{resultA.deep.silver}</p>

            <h3>Oil</h3>
            <p>{resultA.deep.oil}</p>
            <p><strong>Word Count:</strong> {resultA.summaryWordCount}</p>
          </div>
        )}

        {resultB && (
          <div>
            <h2>Version B</h2>
            <h3>{resultB.narrative.headline}</h3>
            <p><strong>Summary</strong></p>
            <p>{resultB.narrative.summary}</p>
            <p><strong>Risks</strong></p>
            <p>{resultB.narrative.keyRisks}</p>
            
            <h3>Stocks</h3>
            <p>{resultB.deep.stocks}</p>

            <h3>Bonds</h3>
            <p>{resultB.deep.bonds}</p>

            <h3>Gold</h3>
            <p>{resultB.deep.gold}</p>

            <h3>Silver</h3>
            <p>{resultB.deep.silver}</p>

            <h3>Oil</h3>
            <p>{resultB.deep.oil}</p>
            <p><strong>Word Count:</strong> {resultB.summaryWordCount}</p>
          </div>
        )}
      </div>
    </div>
  );
}