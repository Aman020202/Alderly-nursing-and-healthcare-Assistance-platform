import { Link } from 'react-router-dom';
import { Star, MapPin, Briefcase, DollarSign } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const CaregiverCard = ({ caregiver }) => {
  const imageUrl = caregiver.userId.profilePicture 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${caregiver.userId.profilePicture}` 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(caregiver.userId.name) + '&background=random';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={imageUrl} 
              alt={caregiver.userId.name} 
              className="h-16 w-16 rounded-full object-cover border-2 border-blue-50"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center">
                {caregiver.userId.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{caregiver.professionalTitle}</p>
              <div className="mt-1 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-700">{caregiver.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 ml-1">({caregiver.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="truncate">{caregiver.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span>{caregiver.experienceYears} Years Experience</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            <span className="font-semibold text-gray-900">${caregiver.hourlyRate}/hr</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {caregiver.serviceTypes.slice(0, 3).map((service, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                {service}
              </span>
            ))}
            {caregiver.serviceTypes.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{caregiver.serviceTypes.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center mt-auto">
        <VerificationBadge status={caregiver.verificationStatus} />
        <Link 
          to={`/caregivers/${caregiver._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Profile &rarr;
        </Link>
      </div>
    </div>
  );
};

export default CaregiverCard;
