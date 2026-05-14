import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ServiceCard = ({ service }) => {
  // Dynamically resolve icon from lucide-react, fallback to Activity if not found
  const IconComponent = Icons[service.icon] || Icons.Activity;

  return (
    <Link 
      to={`/caregivers?service=${encodeURIComponent(service.name)}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full hover:border-blue-300 group"
    >
      <div className="p-6 flex-grow">
        <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <IconComponent className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {service.requiredQualifications.slice(0, 2).map((qual, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
              {qual}
            </span>
          ))}
          {service.requiredQualifications.length > 2 && (
            <span className="text-xs text-gray-500 self-center">+{service.requiredQualifications.length - 2} more</span>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
        <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700">From ${service.basePrice}/hr</span>
        <span className="text-blue-600 font-medium text-sm flex items-center">
          Find Caregivers <Icons.ArrowRight className="h-4 w-4 ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
