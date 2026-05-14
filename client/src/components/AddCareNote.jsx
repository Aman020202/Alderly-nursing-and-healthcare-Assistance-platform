import { useState } from 'react';
import axios from 'axios';
import { Send, Paperclip, X } from 'lucide-react';

const AddCareNote = ({ bookingId, onNoteAdded }) => {
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const MAX_CHARS = 500;

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setPhotos(files);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('text', text);
      photos.forEach(photo => formData.append('photos', photo));

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/care-notes`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setText('');
      setPhotos([]);
      if (onNoteAdded) onNoteAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Add Care Note</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">{error}</div>}
        
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Record observations, medication given, vitals, or any important updates..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
          <span className={`absolute bottom-3 right-3 text-xs font-medium ${text.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Photo Previews */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {photos.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <label className="flex items-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
            <Paperclip className="h-4 w-4 mr-1.5" />
            Attach Photos (max 3)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Posting...' : 'Post Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCareNote;
