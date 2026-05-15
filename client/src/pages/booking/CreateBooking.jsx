import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ClipboardList, Calendar as CalendarIcon, DollarSign, CheckCircle } from 'lucide-react';
import CalendarPicker from '../../components/CalendarPicker';

const CreateBooking = () => {
  const { caregiverId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Data lookups
  const [caregiver, setCaregiver] = useState(null);
  const [patients, setPatients] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    serviceType: '',
    durationOption: 'Hourly',
    notes: ''
  });
  
  // Schedule State from CalendarPicker
  const [schedule, setSchedule] = useState({
    valid: false,
    startDate: null,
    endDate: null
  });

  // Computed Price
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cgRes, pRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/caregiver-search/${caregiverId}`),
          axios.get(`${import.meta.env.VITE_API_URL}/patients`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` }
          })
        ]);
        setCaregiver(cgRes.data);
        setPatients(pRes.data);
        
        // Auto select if only one patient
        if (pRes.data.length === 1) {
           setFormData(prev => ({ ...prev, patientId: pRes.data[0]._id }));
        }
        
      } catch (err) {
        setError('Failed to load required data. Please ensure you are logged in as a Family member.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [caregiverId]);

  // Recalculate estimated total when schedule changes
  useEffect(() => {
    if (schedule.valid && caregiver) {
      const start = new Date(schedule.startDate).getTime();
      const end = new Date(schedule.endDate).getTime();
      const durationHours = (end - start) / (1000 * 60 * 60);
      
      setHours(Math.round(durationHours * 10) / 10);
      setCalculatedTotal(Math.round(durationHours * caregiver.hourlyRate * 100) / 100);
    } else {
      setCalculatedTotal(0);
      setHours(0);
    }
  }, [schedule, caregiver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic validation per step
    if (step === 1 && !formData.patientId) return alert('Please select a patient');
    if (step === 2 && !formData.serviceType) return alert('Please select a service type');
    if (step === 3 && !schedule.valid) return alert('Please select a valid, available time slot');
    
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        caregiverId,
        patientId: formData.patientId,
        serviceType: formData.serviceType,
        durationOption: formData.durationOption,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        notes: formData.notes
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` }
      });
      
      // Navigate to summary
      navigate(`/bookings/summary/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (error) return <div className="p-20 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Request Booking</h1>
        <p className="text-gray-600 mt-2">with {caregiver.userId.name} ({caregiver.professionalTitle})</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[
            { num: 1, icon: User, label: 'Patient' },
            { num: 2, icon: ClipboardList, label: 'Service' },
            { num: 3, icon: CalendarIcon, label: 'Schedule' },
            { num: 4, icon: DollarSign, label: 'Review' }
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors
                ${step >= item.num ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= item.num ? 'text-gray-900' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        
        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Who is this care for?</h2>
            
            {patients.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                You haven't added any patients yet. Please add a patient profile first.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patients.map(p => (
                  <div 
                    key={p._id}
                    onClick={() => setFormData({ ...formData, patientId: p._id })}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all
                      ${formData.patientId === p._id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.age} yrs • {p.gender}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Service Requirements</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caregiver.serviceTypes.map(st => (
                  <div 
                    key={st}
                    onClick={() => setFormData({ ...formData, serviceType: st })}
                    className={`cursor-pointer p-3 rounded-lg border transition-all text-center
                      ${formData.serviceType === st ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {st}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">Duration Type</label>
              <select 
                name="durationOption"
                value={formData.durationOption}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 bg-white"
              >
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">Notes / Special Instructions (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any specific instructions for the caregiver..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 3: Scheduling */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Select Date & Time</h2>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
              Caregiver Rate: <strong>${caregiver.hourlyRate}/hr</strong>. 
              The system will automatically calculate the total cost based on the exact hours requested.
            </p>
            
            <CalendarPicker 
              caregiverId={caregiver._id}
              onScheduleChange={setSchedule} 
            />

            {schedule.valid && (
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center mt-6">
                 <span className="text-gray-700">Estimated Duration:</span>
                 <span className="font-bold text-gray-900">{hours} Hours</span>
               </div>
            )}
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">Review Booking</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Patient</span>
                <span className="font-semibold text-gray-900">{patients.find(p => p._id === formData.patientId)?.name}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-gray-900">{formData.serviceType} ({formData.durationOption})</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Schedule</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{new Date(schedule.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to {new Date(schedule.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-900">Total Estimated Cost</span>
                <span className="text-2xl font-bold text-blue-600">${calculatedTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
          <button 
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1 || submitting}
            className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg disabled:opacity-0"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50 flex items-center"
            >
              {submitting ? 'Submitting...' : 'Confirm Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
