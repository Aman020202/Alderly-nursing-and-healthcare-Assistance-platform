import { useState, useEffect } from 'react';
import axios from 'axios';
import BookingCard from '../../components/BookingCard';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, Inbox } from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); // Active, Pending, Past
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings?page=${page}&status=${activeTab}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
  }, [page, activeTab]);

  // Update a specific booking in state without full refetch
  const handleStatusUpdate = (updatedBooking) => {
    setBookings(prev => prev.map(b => b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b));
  };

  const filteredBookings = bookings;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarCheck className="h-8 w-8 mr-3 text-blue-600" /> 
            {user.role === 'Caregiver' ? 'Manage Bookings' : 'My Bookings'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'Caregiver' 
              ? 'Review and manage your service requests.' 
              : 'Track the status of your care requests.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['Active', 'Pending', 'Past'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings found.</h3>
            <p className="text-gray-500">
              {activeTab === 'Pending' && 'You have no pending requests at this time.'}
              {activeTab === 'Active' && 'You currently have no active services.'}
              {activeTab === 'Past' && 'You have no completed or cancelled bookings.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onStatusUpdate={handleStatusUpdate} 
              />
            ))}

            {totalPages > 1 && (
              <div className="pt-6 flex justify-center space-x-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  Previous
                </button>
                <div className="px-4 py-2 text-sm font-bold text-gray-900 bg-white border border-gray-100 rounded-xl shadow-sm">
                  Page {page} of {totalPages}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default MyBookings;
