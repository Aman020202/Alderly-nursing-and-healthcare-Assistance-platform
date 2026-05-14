import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, Filter } from 'lucide-react';

const BookingMonitor = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page, 
        limit: 15, 
        search: debouncedSearch, 
        status: statusFilter 
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings?${params}`, { headers });
      setBookings(res.data.bookings);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [debouncedSearch, statusFilter, page]);

  const getStatusColor = (s) => {
    const map = { Pending:'bg-yellow-100 text-yellow-800', Accepted:'bg-blue-100 text-blue-800', 'In Progress':'bg-indigo-100 text-indigo-800', Completed:'bg-green-100 text-green-800', Rejected:'bg-red-100 text-red-800', Cancelled:'bg-gray-100 text-gray-800' };
    return map[s] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <Link to="/admin" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1"/>Back</Link>
      <h1 className="text-3xl font-bold text-gray-900">Booking Monitor</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/><input type="text" placeholder="Search patient or service..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"/></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="All">All Statuses</option>
            {['Pending','Accepted','In Progress','Completed','Rejected','Cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Track</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {loading?<tr><td colSpan="6" className="py-12 text-center"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"/></td></tr>
              :bookings.length===0?<tr><td colSpan="6" className="py-12 text-center text-gray-500">No bookings found.</td></tr>
              :bookings.map(b=>(
                 <tr key={b._id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.patientId?.name||'N/A'}</td>
                   <td className="px-6 py-4 text-sm text-gray-600">{b.serviceType}</td>
                   <td className="px-6 py-4 text-sm text-gray-600">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</td>
                   <td className="px-6 py-4 text-sm font-bold text-gray-900">${b.totalAmount.toFixed(2)}</td>
                   <td className="px-6 py-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(b.status)}`}>{b.status}</span></td>
                   <td className="px-6 py-4 text-right"><Link to={`/tracking/${b._id}`} className="text-blue-600 text-sm hover:underline">View →</Link></td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-center space-x-2 bg-gray-50">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm font-medium">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingMonitor;
