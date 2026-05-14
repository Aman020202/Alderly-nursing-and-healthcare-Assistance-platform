import { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const ServiceRating = ({ bookingId, existingReview, onReviewSubmitted }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hovered, setHovered] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');

    setSubmitting(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tracking/${bookingId}/review`, {
        rating,
        reviewText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Your Review</h2>
        <div className="flex justify-center mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`h-7 w-7 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm italic">"{reviewText}"</p>
        <p className="text-green-600 text-sm font-medium mt-3">✓ Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
        <h2 className="text-lg font-bold text-gray-900">Rate Your Experience</h2>
        <p className="text-sm text-gray-600">Help us improve by sharing your feedback about this service.</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}
        
        {/* Star Rating */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 transition-colors ${
                    star <= (hovered || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </span>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Written Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us about your experience with this caregiver..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={rating === 0 || !reviewText.trim() || submitting}
          className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors shadow-sm"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ServiceRating;
