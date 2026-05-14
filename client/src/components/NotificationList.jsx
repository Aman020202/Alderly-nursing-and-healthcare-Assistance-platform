import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, BookOpen, Star, CreditCard, MessageSquare, ShieldCheck } from 'lucide-react';

const typeIcons = {
  booking_confirmation: BookOpen,
  status_change: Bell,
  new_message: MessageSquare,
  payment_reminder: CreditCard,
  review_request: Star,
  verification_update: ShieldCheck,
  general: Bell
};

const typeColors = {
  booking_confirmation: 'bg-blue-100 text-blue-600',
  status_change: 'bg-indigo-100 text-indigo-600',
  new_message: 'bg-green-100 text-green-600',
  payment_reminder: 'bg-amber-100 text-amber-600',
  review_request: 'bg-yellow-100 text-yellow-600',
  verification_update: 'bg-purple-100 text-purple-600',
  general: 'bg-gray-100 text-gray-600'
};

const NotificationList = ({ notifications, onMarkRead, onDelete, onMarkAllRead }) => {
  const navigate = useNavigate();

  const handleClick = (notif) => {
    if (!notif.isRead) onMarkRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <span className="font-bold text-gray-900 text-sm">Notifications</span>
        <button onClick={onMarkAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center">
          <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No notifications yet.</div>
        ) : (
          notifications.map(notif => {
            const Icon = typeIcons[notif.type] || Bell;
            const colorClass = typeColors[notif.type] || typeColors.general;

            return (
              <div
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`px-4 py-3 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm leading-tight ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 ml-2" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
                  className="p-1 text-gray-300 hover:text-red-500 flex-shrink-0 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationList;
