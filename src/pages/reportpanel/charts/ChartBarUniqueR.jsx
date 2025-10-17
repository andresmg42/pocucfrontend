import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';


/**
 * Generates a shade of a single color based on a provided hue.
 * @param {number} hue - The base hue (0-360) for the color.
 * @param {number} index - The index of the data point.
 * @param {number} totalItems - The total number of data points.
 * @returns {string} An HSL color string.
 */

const generateHslShade = (hue, index, totalItems) => {
  const saturation = 75;
  const lightnessStart = 85;
  const lightnessEnd = 25;
  const lightnessRange = lightnessStart - lightnessEnd;
  const safeTotalItems = totalItems <= 1 ? 1 : totalItems - 1;
  const lightness = lightnessStart - (index * (lightnessRange / safeTotalItems));

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ChartBarUniqueR = ({ data }) => {

  // 1. Get the keys for the bars from the first data object.
  // We filter out 'name' because it's used for the X-axis label, not a bar.
  if (!data || data.length === 0) {
    return <div>No data to display</div>; // Handle empty data case
  }

 const randomHue = Math.floor(Math.random() * 361); // 0 to 360

 const colors = data.map((_, index) => generateHslShade(randomHue,index, data.length));
  

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="description" />
        <YAxis />
        <Tooltip />
        <Legend />
          <Bar           
            dataKey={'response_count'} 
            
          >
            {data.map((item,index)=>(

                <Cell
                key={`cell-${index}`}
                fill={colors[index]}
                />

            ))}



          </Bar>
        
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBarUniqueR;