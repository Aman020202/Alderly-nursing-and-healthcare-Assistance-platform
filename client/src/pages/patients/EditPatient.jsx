import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera, Plus, Trash2, ShieldAlert, HeartPulse, User as UserIcon } from 'lucide-react';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
    control, name: "medicalConditions"
  });

  const { fields: medFields, append: appendMed, remove: removeMed } = useFieldArray({
    control, name: "medications"
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control, name: "allergies"
  });

  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Red (Critical)' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow (Warning)' },
    { value: 'bg-blue-100 text-blue-800', label: 'Blue (Info)' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple (Special)' },
  ];

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patients/${id}`);
      const data = res.data;
      
      // Transform simple string arrays into object arrays for react-hook-form's useFieldArray
      const formData = {
        ...data,
        medications: data.medications.length ? data.medications.map(m => ({ name: m })) : [{ name: '' }],
        allergies: data.allergies.length ? data.allergies.map(a => ({ name: a })) : [{ name: '' }]
      };
      
      if (data.profilePicture) {
        setExistingImage(`${import.meta.env.VITE_API_URL.replace('/api', '')}${data.profilePicture}`);
      }
      
      reset(formData);
    } catch (err) {
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('age', data.age);
      formData.append('gender', data.gender);
      formData.append('emergencyContact', JSON.stringify(data.emergencyContact));
      formData.append('medicalConditions', JSON.stringify(data.medicalConditions || []));
      
      const medsArray = data.medications ? data.medications.map(m => m.name).filter(m => m.trim() !== '') : [];
      formData.append('medications', JSON.stringify(medsArray));
      
      const allergiesArray = data.allergies ? data.allergies.map(a => a.name).filter(a => a.trim() !== '') : [];
      formData.append('allergies', JSON.stringify(allergiesArray));
      
      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append('profilePicture', data.profilePicture[0]);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/patients/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate(`/patients/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update patient profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Patient Profile</h1>
          <p className="text-gray-600 mt-1">Update information for your family member.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" /> Basic Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative group flex-shrink-0">
                {existingImage ? (
                  <img src={existingImage} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-blue-200" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-medium">Change</span>
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" {...register('profilePicture')} />
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" {...register('name', { required: 'Name is required' })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" {...register('age', { required: 'Age is required' })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 bg-white" {...register('gender', { required: 'Gender is required' })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center"><HeartPulse className="h-5 w-5 mr-2" /> Medical Conditions</h2>
            <button type="button" onClick={() => appendCondition({ name: '', colorCode: 'bg-blue-100 text-blue-800', isConfidential: false })} className="text-blue-600 text-sm flex items-center"><Plus className="h-4 w-4 mr-1"/> Add</button>
          </div>
          <div className="p-6 space-y-4">
            {conditionFields.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <div className="flex-1">
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register(`medicalConditions.${index}.name`, { required: true })} />
                </div>
                <div className="w-full sm:w-48">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm" {...register(`medicalConditions.${index}.colorCode`)}>
                    {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id={`conf-${index}`} className="h-4 w-4 rounded" {...register(`medicalConditions.${index}.isConfidential`)} />
                  <label htmlFor={`conf-${index}`} className="text-sm flex items-center"><ShieldAlert className="h-3 w-3 mr-1" /> Confidential</label>
                </div>
                <button type="button" onClick={() => removeCondition(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-5 w-5" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-800">Emergency Contact</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('emergencyContact.name', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('emergencyContact.phone', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('emergencyContact.relation', { required: true })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={() => navigate(`/patients/${id}`)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default EditPatient;
