import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PatientCard from '../../components/PatientCard';
import { PlusCircle, Search, Users } from 'lucide-react';

const FamilyDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage profiles for your elderly family members</p>
        </div>
        
        <Link 
          to="/patients/new" 
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add New Patient</span>
        </Link>
      </div>

      {patients.length > 0 ? (
        <>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient._id} patient={patient} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">No patients found matching your search.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No patient profiles yet</h3>
          <p className="mt-1 text-gray-500 mb-6">Get started by creating a profile for your elderly family member.</p>
          <Link 
            to="/patients/new" 
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Profile</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FamilyDashboard;
