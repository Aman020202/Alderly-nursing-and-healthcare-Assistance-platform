import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import VerificationBadge from '../../../components/VerificationBadge';
import { ArrowLeft, UserCheck, FileText, CheckCircle, XCircle } from 'lucide-react';

const CaregiverDetailReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCaregiver();
  }, [id]);

  const fetchCaregiver = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/caregivers/${id}`);
      setCaregiver(res.data);
      setNotes(res.data.verificationNotes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    if (status === 'Rejected' && !notes.trim()) {
      alert('Please provide rejection notes to inform the caregiver why their profile was rejected.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/caregivers/${id}/verify`, {
        status,
        notes
      });
      navigate('/admin/caregivers');
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (!caregiver) return <div className="p-20 text-center">Caregiver not found</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/caregivers" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Review Caregiver Application</h1>
        </div>
        <VerificationBadge status={caregiver.verificationStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <UserCheck className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="font-semibold text-gray-800">Caregiver Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div><span className="block text-sm text-gray-500">Full Name</span><span className="font-medium text-gray-900">{caregiver.userId.name}</span></div>
                <div><span className="block text-sm text-gray-500">Email</span><span className="font-medium text-gray-900">{caregiver.userId.email}</span></div>
                <div><span className="block text-sm text-gray-500">Professional Title</span><span className="font-medium text-gray-900">{caregiver.professionalTitle}</span></div>
                <div><span className="block text-sm text-gray-500">Experience</span><span className="font-medium text-gray-900">{caregiver.experienceYears} Years</span></div>
                <div><span className="block text-sm text-gray-500">Submitted On</span><span className="font-medium text-gray-900">{new Date(caregiver.createdAt).toLocaleString()}</span></div>
                <div className="col-span-2">
                  <span className="block text-sm text-gray-500 mb-1">Biography</span>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700 text-sm">{caregiver.bio}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-800">Qualifications</h3></div>
              <ul className="p-6 list-disc pl-5 text-gray-600 space-y-1 text-sm">
                {caregiver.qualifications.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-800">Service Types</h3></div>
              <ul className="p-6 list-disc pl-5 text-gray-600 space-y-1 text-sm">
                {caregiver.serviceTypes.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
          
        </div>

        {/* Right Column - Documents & Actions */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="font-semibold text-gray-800">Uploaded Documents</h2>
            </div>
            <div className="p-6 space-y-4">
              <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${caregiver.documents.idProof}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <span className="font-medium text-gray-700 group-hover:text-blue-700">ID Proof</span>
                <span className="text-sm text-blue-600 font-medium">View &rarr;</span>
              </a>
              <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${caregiver.documents.degreeCertificate}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <span className="font-medium text-gray-700 group-hover:text-blue-700">Degree Certificate</span>
                <span className="text-sm text-blue-600 font-medium">View &rarr;</span>
              </a>
              {caregiver.documents.experienceCertificate && (
                <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${caregiver.documents.experienceCertificate}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">Experience Letter</span>
                  <span className="text-sm text-blue-600 font-medium">View &rarr;</span>
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800">Verification Decision</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Comments to Caregiver</label>
                <textarea 
                  rows="4" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" 
                  placeholder="Required if rejecting..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => handleVerify('Verified')}
                  disabled={submitting || caregiver.verificationStatus === 'Verified'}
                  className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Approve & Verify
                </button>
                <button 
                  onClick={() => handleVerify('Rejected')}
                  disabled={submitting || caregiver.verificationStatus === 'Rejected'}
                  className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5 mr-2" /> Reject Application
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CaregiverDetailReview;
