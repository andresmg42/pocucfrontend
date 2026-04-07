import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

export default function PiePlot({data,colors}) {
  return (
    <PieChart width={1000} height={600}>
      <Pie
        data={data}
        dataKey="average"
        nameKey="description"
        cx="50%"
        cy="50%"
        outerRadius={220}
        label={({ description, percent }) => `${description} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={colors?.length ? colors[index % colors.length] : getRandomColor()} />
        ))}
      </Pie >
      <Tooltip />
      <Legend />
    </PieChart>
  );
}