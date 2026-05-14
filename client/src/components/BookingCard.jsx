import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, DollarSign, User, Briefcase, ChevronRight, XCircle, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingCard = ({ booking, onStatusUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isCaregiver = user.role === 'Caregiver';
  const isFamily = user.role === 'Elderly/Family';

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/bookings/${booking._id}/status`, { status: newStatus });
      onStatusUpdate(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
          <span className="font-semibold text-gray-900">{booking.serviceType}</span>
          <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
            {booking.durationOption}
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start">
              <User className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  {isFamily ? 'Caregiver' : 'Patient Info'}
                </p>
                <p className="font-medium text-gray-900">
                  {isFamily ? booking.caregiverId?.userId?.name : booking.patientId?.name}
                </p>
                {!isFamily && (
                  <p className="text-sm text-gray-600">{booking.patientId?.age} yrs • {booking.patientId?.gender}</p>
                )}
              </div>
            </div>

            <div className="flex items-start pt-2">
              <Calendar className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Schedule</p>
                <p className="text-sm text-gray-900">{start.toLocaleDateString()} &rarr; {end.toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <Clock className="h-3 w-3 mr-1" /> {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
            <div className="text-right w-full">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold flex items-center justify-end">
                <DollarSign className="h-3 w-3 mr-0.5" /> Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2 w-full justify-end">
              {isFamily && booking.status === 'Pending' && (
                <button 
                  onClick={() => handleStatusChange('Cancelled')}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors disabled:opacity-50"
                >
                  Cancel Request
                </button>
              )}

              {isCaregiver && booking.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => handleStatusChange('Rejected')}
                    disabled={loading}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </button>
                  <button 
                    onClick={() => handleStatusChange('Accepted')}
                    disabled={loading}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md border border-blue-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Accept
                  </button>
                </>
              )}

              {isCaregiver && booking.status === 'Accepted' && (
                <button 
                  onClick={() => handleStatusChange('In Progress')}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors disabled:opacity-50"
                >
                  Start Service
                </button>
              )}

              {isCaregiver && booking.status === 'In Progress' && (
                <button 
                  onClick={() => handleStatusChange('Completed')}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 transition-colors disabled:opacity-50"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-1">NOTES / INSTRUCTIONS</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Tracking Link Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <Link
          to={`/tracking/${booking._id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="h-4 w-4 mr-1.5" /> View Tracking &rarr;
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
