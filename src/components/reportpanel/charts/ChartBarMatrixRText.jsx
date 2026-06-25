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
  console.log("data in CharBarMatrixRText", data);
  const COLORS = colors;
  const { name, ...remain } = data[0];
  const keys = Object.keys(remain);
  console.log(keys);
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
            stackId="a" // same stackId groups bars together
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
