import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Star, Filter } from 'lucide-react';

// Custom hook for debouncing search inputs
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const FiltersSidebar = ({ onFilterChange, initialService = '' }) => {
  const [filters, setFilters] = useState({
    search: '',
    serviceType: initialService,
    location: '',
    minRating: '',
    minPrice: '',
    maxPrice: '',
    sort: 'rating_desc'
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedLocation = useDebounce(filters.location, 500);

  // When debounced values or exact values change, push to parent
  useEffect(() => {
    onFilterChange({
      ...filters,
      search: debouncedSearch,
      location: debouncedLocation
    });
  }, [
    debouncedSearch, 
    debouncedLocation, 
    filters.serviceType, 
    filters.minRating, 
    filters.minPrice, 
    filters.maxPrice, 
    filters.sort
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      serviceType: '',
      location: '',
      minRating: '',
      minPrice: '',
      maxPrice: '',
      sort: 'rating_desc'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600" /> Filters
        </h2>
        <button 
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Name or title..."
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="City or area..."
            />
          </div>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
          <select
            name="serviceType"
            value={filters.serviceType}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
          >
            <option value="">All Services</option>
            <option value="Nursing Care">Nursing Care</option>
            <option value="Elderly Attendant">Elderly Attendant</option>
            <option value="Physiotherapy">Physiotherapy</option>
            <option value="Post-Hospital Care">Post-Hospital Care</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min"
                className="block w-full pl-7 pr-2 py-2 border border-gray-300 rounded-md focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max"
                className="block w-full pl-7 pr-2 py-2 border border-gray-300 rounded-md focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
          <div className="space-y-2">
            {[4, 3, 2].map((star) => (
              <div key={star} className="flex items-center">
                <input
                  id={`rating-${star}`}
                  name="minRating"
                  type="radio"
                  value={star}
                  checked={filters.minRating === String(star)}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`rating-${star}`} className="ml-2 flex items-center text-sm text-gray-700">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  & Up
                </label>
              </div>
            ))}
             <div className="flex items-center">
                <input
                  id={`rating-any`}
                  name="minRating"
                  type="radio"
                  value=""
                  checked={filters.minRating === ""}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`rating-any`} className="ml-2 flex items-center text-sm text-gray-700">
                  Any Rating
                </label>
              </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="exp_desc">Most Experience</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FiltersSidebar;
