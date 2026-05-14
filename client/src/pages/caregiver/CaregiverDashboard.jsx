import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import VerificationBadge from '../../../components/VerificationBadge';
import { AlertCircle, FileText, UserCheck, Edit3 } from 'lucide-react';

const CaregiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/caregivers/me`);
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // If no profile, they need to register
          navigate('/caregiver/register');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-500 mt-1">{profile.professionalTitle}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-sm text-gray-500 mb-1">Account Status</span>
          <VerificationBadge status={profile.verificationStatus} />
        </div>
      </div>

      {profile.verificationStatus === 'Rejected' && profile.verificationNotes && (
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold">Verification Rejected</h3>
              <p className="text-red-700 mt-1">{profile.verificationNotes}</p>
              <div className="mt-3">
                <Link to="/caregiver/register" className="text-red-700 font-medium hover:underline text-sm flex items-center">
                  <Edit3 className="h-4 w-4 mr-1" /> Update Profile & Resubmit
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {profile.verificationStatus === 'Pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-xl">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-semibold">Profile Under Review</h3>
              <p className="text-yellow-700 mt-1">
                Your documents are currently being reviewed by our administration team. You will be notified once your account is verified. You cannot accept patient requests until verified.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><UserCheck className="h-5 w-5 mr-2 text-blue-600" /> Profile Summary</h2>
            <div className="space-y-4 text-gray-600">
              <p><strong>Experience:</strong> {profile.experienceYears} Years</p>
              <div>
                <strong className="block mb-1">Biography:</strong>
                <p className="bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Link to="/caregiver/register" className="text-blue-600 font-medium hover:underline text-sm flex items-center">
                <Edit3 className="h-4 w-4 mr-1" /> Edit Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Qualifications</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {profile.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Services</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {profile.serviceTypes.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 self-start">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileText className="h-5 w-5 mr-2 text-gray-600" /> Documents</h2>
          <div className="space-y-4">
            <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50">
              <span className="text-sm font-medium text-gray-700">ID Proof</span>
              <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.documents.idProof}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View</a>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Degree</span>
              <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.documents.degreeCertificate}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View</a>
            </div>
            {profile.documents.experienceCertificate && (
              <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Experience</span>
                <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.documents.experienceCertificate}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View</a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaregiverDashboard;
