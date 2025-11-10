import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to generate a random color
const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const ChartBarMatrixR = ({ data }) => {

  // 1. Get the keys for the bars from the first data object.
  // We filter out 'name' because it's used for the X-axis label, not a bar.
  if (!data || data.length === 0) {
    return <div className='text-black text-lg mt-55'>No hay datos para esta zona</div>; // Handle empty data case
  }
  const barKeys = Object.keys(data[0]).filter(key => key !== 'name');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{
    value: 'Frecuencia Opciones',
    angle: -90,
    position: 'insideLeft',
  }} />
        <Tooltip />
        <Legend />
        
        
        {barKeys.map(key => (
          <Bar 
            key={key} 
            dataKey={key} 
            fill={getRandomColor()}
            maxBarSize={60} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBarMatrixR;