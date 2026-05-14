import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useNotifications from '../hooks/useNotifications';
import NotificationList from './NotificationList';
import { requestPushPermission, showBrowserNotification } from '../services/pushNotification';

const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?._id || user?.id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Request push permission on mount
  useEffect(() => {
    if (user) requestPushPermission();
  }, [user]);

  // Show browser notification for new items
  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].isRead) {
      const latest = notifications[0];
      showBrowserNotification(latest.title, { body: latest.message, link: latest.link });
    }
  }, [notifications.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <NotificationList
            notifications={notifications}
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
            onMarkAllRead={markAllAsRead}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
