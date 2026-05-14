import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Plus, Trash2, ShieldAlert, HeartPulse } from 'lucide-react';

const AddPatient = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      medicalConditions: [],
      medications: [{ name: '' }],
      allergies: [{ name: '' }]
    }
  });

  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: "medicalConditions"
  });

  const { fields: medFields, append: appendMed, remove: removeMed } = useFieldArray({
    control,
    name: "medications"
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control,
    name: "allergies"
  });

  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Red (Critical)' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow (Warning)' },
    { value: 'bg-blue-100 text-blue-800', label: 'Blue (Info)' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple (Special)' },
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Basic info
      formData.append('name', data.name);
      formData.append('age', data.age);
      formData.append('gender', data.gender);
      
      // Emergency Contact
      formData.append('emergencyContact', JSON.stringify(data.emergencyContact));
      
      // Medical conditions
      formData.append('medicalConditions', JSON.stringify(data.medicalConditions));
      
      // Map arrays of objects to arrays of strings for meds/allergies
      const medsArray = data.medications.map(m => m.name).filter(m => m.trim() !== '');
      formData.append('medications', JSON.stringify(medsArray));
      
      const allergiesArray = data.allergies.map(a => a.name).filter(a => a.trim() !== '');
      formData.append('allergies', JSON.stringify(allergiesArray));
      
      // File upload
      if (data.profilePicture && data.profilePicture[0]) {
        formData.append('profilePicture', data.profilePicture[0]);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/patients`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create patient profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-600 mt-1">Create a comprehensive profile for your elderly family member.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-1 md:col-span-2 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                  <Camera className="h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  {...register('profilePicture')}
                />
                <p className="text-xs text-center mt-2 text-gray-500">Upload Photo</p>
              </div>
              
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register('age', { required: 'Age is required', min: 1 })}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                    {...register('gender', { required: 'Gender is required' })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <HeartPulse className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Medical Conditions</h2>
            </div>
            <button
              type="button"
              onClick={() => appendCondition({ name: '', colorCode: 'bg-blue-100 text-blue-800', isConfidential: false })}
              className="text-sm flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Condition
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {conditionFields.length === 0 && <p className="text-gray-500 text-sm italic">No medical conditions added yet.</p>}
            
            {conditionFields.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Condition Name (e.g., Diabetes)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register(`medicalConditions.${index}.name`, { required: true })}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    {...register(`medicalConditions.${index}.colorCode`)}
                  >
                    {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`confidential-${index}`}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    {...register(`medicalConditions.${index}.isConfidential`)}
                  />
                  <label htmlFor={`confidential-${index}`} className="text-sm text-gray-700 flex items-center">
                    <ShieldAlert className="h-3 w-3 mr-1 text-gray-400" /> Confidential
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex items-center">
            <h2 className="text-lg font-semibold text-red-800">Emergency Contact</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                {...register('emergencyContact.name', { required: 'Emergency contact name is required' })}
              />
              {errors.emergencyContact?.name && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                {...register('emergencyContact.phone', { required: 'Emergency contact phone is required' })}
              />
              {errors.emergencyContact?.phone && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
              <input
                type="text"
                placeholder="e.g., Son, Daughter, Spouse"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                {...register('emergencyContact.relation', { required: 'Relationship is required' })}
              />
              {errors.emergencyContact?.relation && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.relation.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

// Helper icon component since it wasn't imported from lucide-react above
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

export default AddPatient;
