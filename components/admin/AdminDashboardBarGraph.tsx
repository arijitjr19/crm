import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type GraphData = {
  month: string;
  totalBookings: number;
};

const AdminDashboardGraph = ({ data }: { data: GraphData[] }) => {
  return (
    <ResponsiveContainer width={900} height={360} style={{ marginTop: "12px" }}>
      <BarChart data={data} margin={{ top: 20, right: 30, bottom: 28 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="period" tick={{ fill: "#000000" }} fontSize={10} interval={0}>
          <Label fontWeight={400} color='#000000' value="Shifts" offset={-18} position="insideBottom" style={{ color: 'black', fontSize: 12 }} />
        </XAxis>
        <YAxis fontSize={13} tick={{ fill: "#000000" }} />
        <Tooltip />
        <Bar dataKey="value" fill="var(--color4AC2BC)" barSize={12} label={{ position: 'top', fill: '#202020ff', fontSize: 10 }} /> {/* Adjusted bar width here */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AdminDashboardGraph;
