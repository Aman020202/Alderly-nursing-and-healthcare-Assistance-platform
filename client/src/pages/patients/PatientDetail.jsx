import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Phone, Edit2, Trash2, ArrowLeft, 
  Activity, Pill, AlertTriangle, Eye, EyeOff
} from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfidential, setShowConfidential] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient data or you do not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/patients/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to delete patient profile.');
      setShowDeleteModal(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
          <p>{error || 'Patient not found'}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center text-red-800 font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = patient.profilePicture 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${patient.profilePicture}` 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(patient.name) + '&background=random&size=200';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowConfidential(!showConfidential)}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showConfidential ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showConfidential ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showConfidential ? 'Hide Confidential' : 'Show Confidential'}
          </button>
          
          <Link 
            to={`/patients/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit
          </Link>
          
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-white border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Patient Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="p-8 md:flex-shrink-0 flex justify-center bg-gray-50 border-r border-gray-100">
            <img 
              className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg" 
              src={imageUrl} 
              alt={patient.name} 
            />
          </div>
          <div className="p-8 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                <div className="mt-2 flex items-center text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-1" />
                    {patient.age} years old
                  </span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-100 inline-block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2">Emergency Contact</h3>
              <div className="flex items-center text-red-900 font-medium text-lg">
                <Phone className="h-5 w-5 mr-2" />
                {patient.emergencyContact.name} - {patient.emergencyContact.phone}
              </div>
              <p className="text-sm text-red-700 mt-1 pl-7">Relationship: {patient.emergencyContact.relation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Conditions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <Activity className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Medical Conditions</h2>
          </div>
          <div className="p-6">
            {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.medicalConditions.map((condition, idx) => {
                  // Skip confidential rendering if toggle is off
                  if (condition.isConfidential && !showConfidential) {
                    return (
                      <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-600 opacity-60">
                        <ShieldAlert className="h-3 w-3 mr-1" /> Confidential Note
                      </span>
                    );
                  }
                  
                  return (
                    <span 
                      key={idx} 
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${condition.colorCode || 'bg-blue-100 text-blue-800'} ${condition.isConfidential ? 'border-2 border-indigo-400 border-dashed' : ''}`}
                    >
                      {condition.isConfidential && <ShieldAlert className="h-3 w-3 mr-1 text-indigo-700" />}
                      {condition.name}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No medical conditions recorded.</p>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <Pill className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Medications</h2>
          </div>
          <div className="p-6">
            {patient.medications && patient.medications.length > 0 ? (
              <ul className="space-y-2">
                {patient.medications.map((med, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-2"></span>
                    {med}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No medications recorded.</p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Allergies</h2>
          </div>
          <div className="p-6">
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known allergies.</p>
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => !deleting && setShowDeleteModal(false)}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Patient Profile</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the profile for <span className="font-bold text-gray-900">{patient.name}</span>? 
                      All of their medical data will be permanently removed. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={deleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleDelete}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDetail;
