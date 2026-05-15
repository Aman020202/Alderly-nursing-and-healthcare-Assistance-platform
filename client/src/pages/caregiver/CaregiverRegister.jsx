import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Award, Briefcase, UserCheck } from 'lucide-react';

const CaregiverRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      qualifications: [{ name: '' }],
      serviceTypes: [{ name: '' }]
    }
  });

  const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({
    control, name: "qualifications"
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control, name: "serviceTypes"
  });

  useEffect(() => {
    // Check if caregiver profile already exists
    const checkProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/caregivers/me`);
        if (res.data) {
          setExistingProfile(res.data);
          reset({
            professionalTitle: res.data.professionalTitle,
            experienceYears: res.data.experienceYears,
            bio: res.data.bio,
            qualifications: res.data.qualifications.length ? res.data.qualifications.map(q => ({ name: q })) : [{ name: '' }],
            serviceTypes: res.data.serviceTypes.length ? res.data.serviceTypes.map(s => ({ name: s })) : [{ name: '' }]
          });
        }
      } catch (err) {
        // 404 means no profile yet, which is fine
        if (err.response?.status !== 404) {
          console.error(err);
        }
      }
    };
    
    checkProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      formData.append('professionalTitle', data.professionalTitle);
      formData.append('experienceYears', data.experienceYears);
      formData.append('hourlyRate', data.hourlyRate);
      formData.append('location', data.location);
      formData.append('bio', data.bio);
      
      const qualArray = data.qualifications.map(q => q.name).filter(q => q.trim() !== '');
      formData.append('qualifications', JSON.stringify(qualArray));
      
      const servArray = data.serviceTypes.map(s => s.name).filter(s => s.trim() !== '');
      formData.append('serviceTypes', JSON.stringify(servArray));
      
      if (data.idProof && data.idProof[0]) formData.append('idProof', data.idProof[0]);
      if (data.degreeCertificate && data.degreeCertificate[0]) formData.append('degreeCertificate', data.degreeCertificate[0]);
      if (data.experienceCertificate && data.experienceCertificate[0]) formData.append('experienceCertificate', data.experienceCertificate[0]);

      await axios.post(`${import.meta.env.VITE_API_URL}/caregivers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {existingProfile ? 'Update Professional Profile' : 'Complete Caregiver Registration'}
        </h1>
        <p className="text-gray-600 mt-2">
          {existingProfile 
            ? 'Update your details or upload new documents for re-verification.' 
            : 'Please provide your professional details and upload verification documents to start accepting requests.'}
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Professional Details */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Professional Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
              <input type="text" placeholder="e.g., Registered Nurse, Home Health Aide" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" {...register('professionalTitle', { required: 'Title is required' })} />
              {errors.professionalTitle && <p className="text-red-500 text-xs mt-1">{errors.professionalTitle.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
              <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" {...register('experienceYears', { required: 'Experience years required' })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($) *</label>
              <input type="number" min="0" placeholder="e.g., 25" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" {...register('hourlyRate', { required: 'Hourly rate is required' })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Location / City *</label>
              <input type="text" placeholder="e.g., New York, NY" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" {...register('location', { required: 'Location is required' })} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio *</label>
              <textarea rows="4" placeholder="Briefly describe your experience and approach to caregiving..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" {...register('bio', { required: 'Bio is required' })}></textarea>
            </div>
          </div>
        </div>

        {/* Qualifications & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center text-gray-800 font-semibold"><Award className="h-5 w-5 text-indigo-600 mr-2" /> Qualifications</div>
            </div>
            <div className="p-6 space-y-3">
              {qualFields.map((item, index) => (
                <div key={item.id} className="flex space-x-2">
                  <input type="text" placeholder="e.g., B.Sc Nursing" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" {...register(`qualifications.${index}.name`)} />
                  <button type="button" onClick={() => removeQual(index)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md">X</button>
                </div>
              ))}
              <button type="button" onClick={() => appendQual({ name: '' })} className="text-sm text-indigo-600 font-medium">+ Add Qualification</button>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center text-gray-800 font-semibold"><Briefcase className="h-5 w-5 text-teal-600 mr-2" /> Services Offered</div>
            </div>
            <div className="p-6 space-y-3">
              {serviceFields.map((item, index) => (
                <div key={item.id} className="flex space-x-2">
                  <input type="text" placeholder="e.g., Medication Management" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" {...register(`serviceTypes.${index}.name`)} />
                  <button type="button" onClick={() => removeService(index)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md">X</button>
                </div>
              ))}
              <button type="button" onClick={() => appendService({ name: '' })} className="text-sm text-teal-600 font-medium">+ Add Service</button>
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Verification Documents (PDF/Images)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Proof {existingProfile ? '' : '*'}</label>
              <input type="file" accept=".pdf,image/*" className="w-full text-sm" {...register('idProof', { required: !existingProfile })} />
              {existingProfile?.documents?.idProof && <p className="text-xs text-green-600 mt-1">✓ Already uploaded</p>}
              {errors.idProof && <p className="text-red-500 text-xs mt-1">ID Proof is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree Certificate {existingProfile ? '' : '*'}</label>
              <input type="file" accept=".pdf,image/*" className="w-full text-sm" {...register('degreeCertificate', { required: !existingProfile })} />
              {existingProfile?.documents?.degreeCertificate && <p className="text-xs text-green-600 mt-1">✓ Already uploaded</p>}
              {errors.degreeCertificate && <p className="text-red-500 text-xs mt-1">Degree is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Letter (Optional)</label>
              <input type="file" accept=".pdf,image/*" className="w-full text-sm" {...register('experienceCertificate')} />
              {existingProfile?.documents?.experienceCertificate && <p className="text-xs text-green-600 mt-1">✓ Already uploaded</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={submitting} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Profile for Verification'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default CaregiverRegister;
