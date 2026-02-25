type BlsDataPoint = {
  year: string;
  period: string;
  value: string;
};

type BlsResponse = {
  status: string;
  Results?: {
    series?: {
      data: BlsDataPoint[];
    }[];
  };
};

export async function fetchBlsSeries(
  seriesId: string,
  startYear: string,
  endYear: string
): Promise<{ date: string; value: number }[]> {

  const response = await fetch(
    "https://api.bls.gov/publicAPI/v2/timeseries/data/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seriesid: [seriesId],
        startyear: startYear,
        endyear: endYear,
        registrationkey: process.env.BLS_API_KEY
      })
    }
  );

  if (!response.ok) {
    throw new Error(`BLS HTTP error: ${response.status}`);
  }

  const json: BlsResponse = await response.json();

  if (json.status !== "REQUEST_SUCCEEDED") {
    console.error("BLS API error:", json);
    return [];
  }

  const data = json.Results?.series?.[0]?.data;
  if (!data) return [];

  return data
    .filter((d: BlsDataPoint) => d.period !== "M13")
    .map((d: BlsDataPoint) => ({
      date: `${d.year}-${d.period.replace("M", "")}-01`,
      value: Number(d.value)
    }))
    .filter(d => Number.isFinite(d.value));
}