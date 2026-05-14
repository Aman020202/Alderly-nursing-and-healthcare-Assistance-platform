import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import { CompletionRateChart } from '../../components/charts/BookingChart';

const Reports = () => {
  const [tab, setTab] = useState('performance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [perfData, setPerfData] = useState([]);
  const [completionData, setCompletionData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (tab === 'performance') {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/reports/caregiver-performance`, { headers });
        setPerfData(res.data);
      } else if (tab === 'completion') {
        const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/reports/booking-completion${params}`, { headers });
        setCompletionData(res.data);
      } else if (tab === 'revenue') {
        const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/reports/revenue${params}`, { headers });
        setRevenueData(res.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, [tab]);

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const tabs = [
    { key: 'performance', label: 'Caregiver Performance' },
    { key: 'completion', label: 'Booking Completion' },
    { key: 'revenue', label: 'Revenue Report' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <Link to="/admin" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`py-4 px-1 border-b-2 font-medium text-sm ${tab === t.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
          ))}
        </nav>
      </div>

      {(tab === 'completion' || tab === 'revenue') && (
        <div className="bg-white rounded-xl border p-4 flex flex-wrap items-end gap-4">
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 border rounded-md text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 border rounded-md text-sm" /></div>
          <button onClick={fetchReport} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Apply Filter</button>
        </div>
      )}

      {loading ? <div className="py-12 text-center"><div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto" /></div> : (
        <>
          {tab === 'performance' && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Caregiver Performance</h2>
                <button onClick={() => exportCSV(perfData, 'caregiver_performance')} className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium"><Download className="h-3.5 w-3.5 mr-1" />Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Bookings</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Completed</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {perfData.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.title}</td>
                        <td className="px-4 py-3 text-sm text-center">{c.totalBookings}</td>
                        <td className="px-4 py-3 text-sm text-center">{c.completedBookings}</td>
                        <td className="px-4 py-3 text-sm text-center font-bold">{c.completionRate}%</td>
                        <td className="px-4 py-3 text-sm text-center">⭐ {c.rating} ({c.reviewCount})</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-green-700">${c.totalRevenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'completion' && completionData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Completion Breakdown</h2>
                <CompletionRateChart data={completionData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <h2 className="font-bold text-gray-900 mb-2">Summary</h2>
                <div className="space-y-3">
                  {[{ label: 'Total Bookings', val: completionData.total }, { label: 'Completed', val: completionData.completed, color: 'text-green-700' }, { label: 'Cancelled', val: completionData.cancelled, color: 'text-red-700' }, { label: 'Rejected', val: completionData.rejected, color: 'text-yellow-700' }].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className={`font-bold ${item.color || 'text-gray-900'}`}>{item.val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-sm font-bold text-blue-800">Completion Rate</span>
                    <span className="text-2xl font-bold text-blue-700">{completionData.completionRate}%</span>
                  </div>
                </div>
                <button onClick={() => exportCSV([completionData], 'booking_completion')} className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium mt-4"><Download className="h-3.5 w-3.5 mr-1" />Export CSV</button>
              </div>
            </div>
          )}

          {tab === 'revenue' && revenueData && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Revenue by Service — Total: <span className="text-green-700">${revenueData.totalRevenue.toFixed(2)}</span></h2>
                <button onClick={() => exportCSV(revenueData.byService, 'revenue_report')} className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium"><Download className="h-3.5 w-3.5 mr-1" />Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Bookings</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {revenueData.byService.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{r.service}</td>
                        <td className="px-6 py-3 text-sm text-center">{r.bookings}</td>
                        <td className="px-6 py-3 text-sm text-right font-bold text-green-700">${r.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Reports;
