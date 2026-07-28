import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartBarMatrixRText({ data, colors }) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const COLORS = colors ?? [];
  const keys = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== "name")),
    ),
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} width={400} height={300} maxBarSize={150}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {keys.map((item, index) => (
          <Bar
            key={index}
            dataKey={item}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
