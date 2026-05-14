import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Briefcase, DollarSign, ArrowLeft, CheckCircle, FileText, Calendar } from 'lucide-react';
import VerificationBadge from '../components/VerificationBadge';

const CaregiverProfile = () => {
  const { id } = useParams();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/caregiver-search/${id}`);
        setCaregiver(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaregiver();
  }, [id]);

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (error) return <div className="p-20 text-center text-red-600 text-xl font-medium">{error}</div>;
  if (!caregiver) return null;

  const imageUrl = caregiver.userId.profilePicture 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${caregiver.userId.profilePicture}` 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(caregiver.userId.name) + '&background=random&size=200';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      <Link to="/caregivers" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search Results
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-6 sm:px-10 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6 gap-6">
            <img 
              src={imageUrl} 
              alt={caregiver.userId.name} 
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
            <div className="text-center sm:text-left flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{caregiver.userId.name}</h1>
                  <p className="text-lg text-gray-600 font-medium mt-1">{caregiver.professionalTitle}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end">
                  <div className="text-2xl font-bold text-green-600">${caregiver.hourlyRate}<span className="text-sm text-gray-500 font-normal">/hr</span></div>
                  <Link to={`/bookings/new/${caregiver._id}`} className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto text-center">
                    Request Booking
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-gray-600 border-t border-gray-100 pt-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current mr-1.5" />
              <span className="font-bold text-gray-900 mr-1">{caregiver.rating.toFixed(1)}</span>
              <span>({caregiver.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-1.5" />
              <span>{caregiver.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-400 mr-1.5" />
              <span>{caregiver.experienceYears} Years Experience</span>
            </div>
            <div className="flex items-center">
              <VerificationBadge status={caregiver.verificationStatus} />
            </div>
            <div className="flex items-center">
               <Calendar className="h-5 w-5 text-gray-400 mr-1.5" />
               <span>Member since {new Date(caregiver.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">About Me</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caregiver.bio}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Services Offered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caregiver.serviceTypes.map((service, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar info) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" /> Qualifications
            </h2>
            <ul className="space-y-3">
              {caregiver.qualifications.map((qual, i) => (
                <li key={i} className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 text-center">
            <h3 className="font-bold text-blue-900 mb-2">Need a consultation?</h3>
            <p className="text-sm text-blue-800 mb-4">Message this caregiver to discuss your specific requirements before booking.</p>
            <button className="w-full bg-white text-blue-700 border border-blue-200 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
              Send Message
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaregiverProfile;
