type FredObservation = {
  date: string;
  value: string;
};

export async function fetchFredSeries(
  seriesId: string,
  units?: string
): Promise<{ date: string; value: number }[]> {

  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    throw new Error("FRED_API_KEY missing");
  }

  const url = new URL(
    "https://api.stlouisfed.org/fred/series/observations"
  );

  url.searchParams.append("series_id", seriesId);
  url.searchParams.append("api_key", apiKey);
  url.searchParams.append("file_type", "json");

  if (units) {
    url.searchParams.append("units", units);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const text = await response.text();
    console.error("FRED error response:", text);
    throw new Error(`Failed to fetch FRED data (${response.status})`);
  }

  const json = await response.json();

  if (!json.observations) {
    throw new Error("Invalid FRED response structure");
  }

  return (json.observations as FredObservation[])
    .filter(o => o.value !== ".")
    .map(o => ({
      date: o.date,
      value: Number(o.value)
    }));
}