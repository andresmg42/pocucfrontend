import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const locations = ["Cafetería", "Expendio de alimentos", "Expendios de dulces", "No hay expendio"];

export default function ChartBarMatrixRText({data,colors}) {
    const COLORS=colors
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} width={400} height={300}  maxBarSize={150}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {locations.map((location, index) => (
          <Bar
            key={location}
            dataKey={location}
            stackId="a"       // same stackId groups bars together
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}