import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";



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