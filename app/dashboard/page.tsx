type Props = {
  data: number[];
};

export default function LineChart({ data }: Props) {
  const width = 600;
  const height = 200;
  const padding = 40;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data.map((value, index) => {
    const x =
      padding +
      (index / (data.length - 1)) * (width - padding * 2);

    const y =
      height -
      padding -
      ((value - min) / (max - min)) *
        (height - padding * 2);

    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
    >
      <polyline
        fill="none"
        stroke="black"
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
}