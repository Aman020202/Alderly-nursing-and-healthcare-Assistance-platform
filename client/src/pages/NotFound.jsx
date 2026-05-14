import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <div className="relative">
        <h1 className="text-[10rem] font-black text-gray-100 leading-none">404</h1>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900 w-full">
          Oops! Page Not Found.
        </p>
      </div>
      <p className="text-gray-500 max-w-md mx-auto text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          <Home className="w-5 h-5 mr-2" /> Back Home
        </Link>
        <Link 
          to="/caregivers" 
          className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          <Search className="w-5 h-5 mr-2" /> Find a Nurse
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
