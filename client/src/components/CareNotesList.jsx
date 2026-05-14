import { Image as ImageIcon } from 'lucide-react';

const CareNotesList = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No care notes have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Care Notes ({notes.length})</h2>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {notes.map((note) => (
          <div key={note._id} className="p-5 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                  {note.authorId?.name?.charAt(0) || 'C'}
                </div>
                <span className="font-semibold text-gray-900 text-sm">{note.authorId?.name || 'Caregiver'}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(note.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed ml-10">{note.text}</p>
            
            {note.photos && note.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10">
                {note.photos.map((photo, idx) => (
                  <a 
                    key={idx}
                    href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${photo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative group"
                  >
                    <img 
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${photo}`}
                      alt={`Note photo ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareNotesList;
