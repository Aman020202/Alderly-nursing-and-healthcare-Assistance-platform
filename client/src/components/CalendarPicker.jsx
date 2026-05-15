import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const CalendarPicker = ({ caregiverId, onScheduleChange }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState(null); // null, 'available', 'conflict'

  // Get today's date formatted as YYYY-MM-DD for min attributes
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // If all 4 fields are filled, trigger an availability check
    if (startDate && startTime && endDate && endTime) {
      checkAvailability();
    } else {
      setAvailability(null);
      onScheduleChange({ valid: false });
    }
  }, [startDate, startTime, endDate, endTime]);

  const checkAvailability = async () => {
    setChecking(true);
    setAvailability(null);
    
    try {
      const startIso = new Date(`${startDate}T${startTime}`).toISOString();
      const endIso = new Date(`${endDate}T${endTime}`).toISOString();

      // Basic local validation
      if (new Date(startIso) >= new Date(endIso)) {
        setAvailability('invalid_range');
        onScheduleChange({ valid: false });
        setChecking(false);
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/availability/check`, {
        params: {
          caregiverId,
          startDate: startIso,
          endDate: endIso
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      if (res.data.available) {
        setAvailability('available');
        onScheduleChange({
          valid: true,
          startDate: startIso,
          endDate: endIso
        });
      } else {
        setAvailability('conflict');
        onScheduleChange({ valid: false });
      }

    } catch (err) {
      console.error(err);
      setAvailability('error');
      onScheduleChange({ valid: false });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Start Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" /> Start Date & Time
          </label>
          <div className="space-y-3">
            <input 
              type="date" 
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm"
            />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* End Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-indigo-600" /> End Date & Time
          </label>
          <div className="space-y-3">
            <input 
              type="date" 
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm"
            />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status Area */}
      <div className="min-h-[40px] flex items-center">
        {checking && (
           <div className="text-sm text-gray-500 flex items-center">
             <div className="animate-spin h-3 w-3 border-b-2 border-gray-500 rounded-full mr-2"></div>
             Checking availability...
           </div>
        )}
        
        {!checking && availability === 'available' && (
          <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md flex items-center border border-green-200 w-full">
            <CheckCircle className="h-4 w-4 mr-2" /> Caregiver is available for this time slot!
          </div>
        )}

        {!checking && availability === 'conflict' && (
          <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md flex items-center border border-red-200 w-full">
            <AlertCircle className="h-4 w-4 mr-2" /> This time slot conflicts with another booking. Please select different dates.
          </div>
        )}

        {!checking && availability === 'invalid_range' && (
          <div className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md flex items-center border border-amber-200 w-full">
            <AlertCircle className="h-4 w-4 mr-2" /> End time must be after start time.
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
