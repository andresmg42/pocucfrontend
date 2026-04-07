import React from 'react';
import { BarChart, Bar, XAxis, YAxis,Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to generate a random color
const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const ChartBarMatrixR = ({ data,colors }) => {

  console.log('data in chartBarMatrix: ',data)

  // 1. Get the keys for the bars from the first data object.
  // We filter out 'name' because it's used for the X-axis label, not a bar.
  if (!data || data.length === 0) {
    return <div className='text-black text-lg mt-55'>No hay datos para esta zona</div>; // Handle empty data case
  }
  // const barKeys = Object.keys(data[0]).filter(key => key !== 'name');

  const barKeys = data

  console.log('Bar Keys',barKeys)

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={400} height={300} data={data} maxBarSize={150}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="description" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="average"  radius={[6, 6, 0, 0]} >
        {data.map((entry, index) => (
          <Cell key={index} fill={colors?.length ? colors[index % colors.length] : getRandomColor()} />
        ))}
      </Bar>
    </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBarMatrixR;