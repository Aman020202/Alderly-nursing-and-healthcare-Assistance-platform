import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

export const BookingTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip
        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
      />
      <Legend />
      <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Bookings" />
      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue ($)" />
    </LineChart>
  </ResponsiveContainer>
);

export const RevenueByServiceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        dataKey="revenue"
        nameKey="service"
        label={({ service, percent }) => `${service} (${(percent * 100).toFixed(0)}%)`}
        labelLine={true}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
    </PieChart>
  </ResponsiveContainer>
);

export const SatisfactionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
      <Tooltip
        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
      />
      <Legend />
      <Bar dataKey="avgRating" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Avg Rating" />
      <Bar dataKey="reviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Reviews" />
    </BarChart>
  </ResponsiveContainer>
);

export const CompletionRateChart = ({ data }) => {
  const chartData = [
    { name: 'Completed', value: data.completed, color: '#10b981' },
    { name: 'Cancelled', value: data.cancelled, color: '#ef4444' },
    { name: 'Rejected', value: data.rejected, color: '#f59e0b' },
    { name: 'In Progress', value: data.inProgress, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
