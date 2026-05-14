import { ShieldCheck, Clock, XCircle } from 'lucide-react';

const VerificationBadge = ({ status }) => {
  if (status === 'Verified') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
      </span>
    );
  }
  
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="h-3.5 w-3.5 mr-1" /> Rejected
      </span>
    );
  }
  
  // Default Pending
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Clock className="h-3.5 w-3.5 mr-1" /> Pending Verification
    </span>
  );
};

export default VerificationBadge;
