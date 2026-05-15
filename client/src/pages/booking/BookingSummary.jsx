import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, ArrowRight, Calendar, User, DollarSign } from 'lucide-react';

const BookingSummary = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` }
        });
        setBooking(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id]);

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (!booking) return <div className="p-20 text-center text-red-600">Booking not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-center">
        <div className="bg-green-50 p-8 border-b border-gray-200">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">Request Sent Successfully!</h1>
          <p className="text-lg text-gray-600 mt-2">
            Your booking request has been sent to <strong>{booking.caregiverId.userId.name}</strong>.
          </p>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-8">
            The caregiver will review your request shortly. You will receive an email notification once they accept or reject the booking. You can track the status in your dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <User className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Patient</p>
              <p className="font-bold text-gray-900">{booking.patientId.name}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Calendar className="h-6 w-6 text-indigo-500 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Start Date</p>
              <p className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <DollarSign className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Total Cost</p>
              <p className="font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/bookings" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              View My Bookings
            </Link>
            <Link 
              to="/caregivers" 
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Browse More Caregivers <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
