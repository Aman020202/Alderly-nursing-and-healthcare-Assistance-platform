import { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Our Care Services</h1>
        <p className="text-xl text-gray-600">
          Comprehensive, professional, and compassionate care tailored to the specific needs of your loved ones. Browse our service categories below to find specialized caregivers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
      
      <div className="mt-20 bg-blue-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Not sure which service you need?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Our care coordinators are available 24/7 to help assess your needs and match you with the perfect caregiver for your family's unique situation.
        </p>
        <button className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Speak with a Coordinator
        </button>
      </div>
    </div>
  );
};

export default Services;
