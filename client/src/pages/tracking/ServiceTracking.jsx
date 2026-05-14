import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import useWebSocket from '../../hooks/useWebSocket';
import StatusTimeline from './StatusTimeline';
import CareNotesList from '../../components/CareNotesList';
import AddCareNote from '../../components/AddCareNote';
import ServiceRating from '../../components/ServiceRating';
import { ArrowLeft, Wifi, WifiOff, User, Calendar, DollarSign, Briefcase, PlayCircle, CheckCircle, XCircle } from 'lucide-react';

const ServiceTracking = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { connected, statusUpdate, newNote } = useWebSocket(bookingId);

  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const isCaregiver = user?.role === 'Caregiver';
  const isFamily = user?.role === 'Elderly/Family';

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trackRes, notesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/tracking/${bookingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/care-notes/${bookingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        setBooking(trackRes.data.booking);
        setReview(trackRes.data.review);
        setNotes(notesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  // React to WebSocket status updates
  useEffect(() => {
    if (statusUpdate) {
      setBooking(prev => prev ? { ...prev, status: statusUpdate.status } : prev);
    }
  }, [statusUpdate]);

  // React to WebSocket new care notes
  useEffect(() => {
    if (newNote) {
      setNotes(prev => {
        // Prevent duplicates
        if (prev.find(n => n._id === newNote._id)) return prev;
        return [...prev, newNote];
      });
    }
  }, [newNote]);

  // Handle caregiver adding a note locally (in case socket is slow)
  const handleNoteAdded = (note) => {
    setNotes(prev => {
      if (prev.find(n => n._id === note._id)) return prev;
      return [...prev, note];
    });
  };

  // Handle caregiver status transitions
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/tracking/${bookingId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setBooking(prev => ({ ...prev, status: res.data.status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (!booking) return <div className="p-20 text-center text-red-500 text-lg">Booking not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/bookings" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Bookings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Service Tracking</h1>
        </div>
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {connected ? <Wifi className="h-3.5 w-3.5 mr-1.5" /> : <WifiOff className="h-3.5 w-3.5 mr-1.5" />}
          {connected ? 'Live Connected' : 'Connecting...'}
        </div>
      </div>

      {/* Status Timeline */}
      <StatusTimeline currentStatus={booking.status} />

      {/* Booking Info Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-gray-500 font-medium">Patient</p>
              <p className="font-bold text-gray-900">{booking.patientId?.name}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Briefcase className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-gray-500 font-medium">Service</p>
              <p className="font-bold text-gray-900">{booking.serviceType}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-teal-500 mt-0.5" />
            <div>
              <p className="text-gray-500 font-medium">Schedule</p>
              <p className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-gray-500 font-medium">Total</p>
              <p className="font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Caregiver Action Buttons */}
      {isCaregiver && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Actions</h3>
          <div className="flex flex-wrap gap-3">
            {booking.status === 'Pending' && (
              <>
                <button onClick={() => handleStatusChange('Accepted')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm">
                  <CheckCircle className="h-4 w-4 mr-2" /> Accept Request
                </button>
                <button onClick={() => handleStatusChange('Rejected')} className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-sm hover:bg-red-100">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </button>
              </>
            )}
            {booking.status === 'Accepted' && (
              <button onClick={() => handleStatusChange('In Progress')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 shadow-sm">
                <PlayCircle className="h-4 w-4 mr-2" /> Start Service
              </button>
            )}
            {booking.status === 'In Progress' && (
              <button onClick={() => handleStatusChange('Completed')} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 shadow-sm">
                <CheckCircle className="h-4 w-4 mr-2" /> Mark Completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* Family Cancel */}
      {isFamily && booking.status === 'Pending' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-end">
          <button onClick={() => handleStatusChange('Cancelled')} className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium text-sm hover:bg-red-100">
            <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
          </button>
        </div>
      )}

      {/* Care Notes Section */}
      <div className="space-y-6">
        <CareNotesList notes={notes} />
        
        {isCaregiver && ['Accepted', 'In Progress'].includes(booking.status) && (
          <AddCareNote bookingId={bookingId} onNoteAdded={handleNoteAdded} />
        )}
      </div>

      {/* Review Section - only for completed bookings for family users */}
      {isFamily && booking.status === 'Completed' && (
        <ServiceRating
          bookingId={bookingId}
          existingReview={review}
          onReviewSubmitted={() => setReview({ submitted: true })}
        />
      )}
    </div>
  );
};

export default ServiceTracking;
