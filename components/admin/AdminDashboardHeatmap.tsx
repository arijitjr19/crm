import { Area, AreaChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// #endregion
const AdminDashboardHeatMap = ({ data }: { data: any }) => {
  return (
    <AreaChart
      style={{ width: '100%', maxWidth: '870px', maxHeight: '50vh', aspectRatio: 1.80 }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid vertical={false} />
      <XAxis dataKey="period" tick={{ fill: "#6b6b6bff" }} fontSize={11} interval={0}>
        <Label fontWeight={400} color='#000000' value="Shifts" offset={-18} position="insideBottom" style={{ color: 'black', fontSize: 12 }} />
      </XAxis>
       <YAxis fontSize={13} tick={{ fill: "#000000" }} />
      <Tooltip />
      <Area type="monotone" dataKey="value" stroke="#0c9999ff" fill="var(--color4AC2BC)" />
    </AreaChart>
  );
};

export default AdminDashboardHeatMap;