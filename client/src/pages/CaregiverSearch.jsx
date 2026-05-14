import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FiltersSidebar from '../components/FiltersSidebar';
import CaregiverCard from '../components/CaregiverCard';
import { CaregiverCardSkeleton } from '../components/Skeleton';
import { Users, SearchX } from 'lucide-react';

const CaregiverSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Active filters from Sidebar
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    fetchCaregivers();
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [page, activeFilters]);

  const fetchCaregivers = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...activeFilters
      });

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/caregiver-search?${params}`);
      setCaregivers(res.data.caregivers);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error('Error fetching caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-600" /> Find a Caregiver
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Browse our network of verified professionals to find the perfect match for your family's needs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <FiltersSidebar 
            onFilterChange={handleFilterChange} 
            initialService={initialService} 
          />
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4 flex-grow">
          
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Showing <span className="font-bold text-gray-900">{caregivers.length}</span> of <span className="font-bold text-gray-900">{totalItems}</span> caregivers
            </span>
            {/* Could put a toggle here for grid/list view later */}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CaregiverCardSkeleton key={i} />
              ))}
            </div>
          ) : caregivers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
              <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No caregivers found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {caregivers.map(cg => (
                  <CaregiverCard key={cg._id} caregiver={cg} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center space-x-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 border text-sm font-medium rounded-md ${
                        page === i + 1 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CaregiverSearch;
