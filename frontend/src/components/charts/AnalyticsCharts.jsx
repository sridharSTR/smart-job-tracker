import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#35c2a2", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#64748b"];

export function MonthlyAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="monthlyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#35c2a2" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#35c2a2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.16} />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type="monotone" dataKey="applications" stroke="#35c2a2" fill="url(#monthlyFill)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
          {data.map((_, index) => <Cell fill={colors[index % colors.length]} key={index} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, dataKey = "value", nameKey = "name" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.16} />
        <XAxis dataKey={nameKey} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#35c2a2" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
