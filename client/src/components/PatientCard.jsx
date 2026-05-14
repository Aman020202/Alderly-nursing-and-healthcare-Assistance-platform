import { Link } from 'react-router-dom';
import { User, Phone, Activity } from 'lucide-react';

const PatientCard = ({ patient }) => {
  // Use a default avatar if no profile picture is provided
  const imageUrl = patient.profilePicture 
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${patient.profilePicture}` 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(patient.name) + '&background=random';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex p-5">
        <div className="flex-shrink-0 mr-4">
          <img 
            className="h-20 w-20 rounded-full object-cover border-2 border-blue-100" 
            src={imageUrl} 
            alt={patient.name} 
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-3">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-400" />
              {patient.age} yrs • {patient.gender}
            </span>
          </div>
          
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Emergency Contact
            </h4>
            <div className="flex items-center text-sm text-red-600 bg-red-50 py-1 px-2 rounded-md inline-flex">
              <Phone className="h-3 w-3 mr-1" />
              <span className="font-medium">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
            </div>
          </div>
        </div>
      </div>
      
      {patient.medicalConditions && patient.medicalConditions.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center overflow-x-auto gap-2">
          <Activity className="h-4 w-4 text-gray-400 flex-shrink-0 mr-1" />
          {patient.medicalConditions.slice(0, 3).map((condition, idx) => (
            <span 
              key={idx} 
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${condition.colorCode || 'bg-blue-100 text-blue-800'}`}
            >
              {condition.isConfidential ? 'Confidential' : condition.name}
            </span>
          ))}
          {patient.medicalConditions.length > 3 && (
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
              +{patient.medicalConditions.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <div className="px-5 py-3 border-t border-gray-100 bg-white">
        <Link 
          to={`/patients/${patient._id}`} 
          className="w-full block text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Full Profile &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PatientCard;
