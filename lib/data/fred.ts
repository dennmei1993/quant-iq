type FredObservation = {
  date: string;
  value: number;
};

const FRED_BASE =
  "https://api.stlouisfed.org/fred/series/observations";

export async function fetchFredSeries(
  seriesId: string
): Promise<FredObservation[]> {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    throw new Error("Missing FRED_API_KEY");
  }

  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;

  const res = await fetch(url, {
    next: { revalidate: 86400 }, // 24h cache
  });

  if (!res.ok) {
    throw new Error("Failed to fetch FRED data");
  }

  const data = await res.json();

  return data.observations
  .filter((o: any) => o.value !== ".")
  .map((o: any) => ({
    date: o.date,
    value: parseFloat(o.value),
  }))
  .sort((a: any, b: any) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}