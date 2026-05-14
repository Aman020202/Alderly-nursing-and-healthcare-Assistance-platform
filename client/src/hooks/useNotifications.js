import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socketRef, setSocketRef] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications?limit=30`, { headers });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  // Connect socket and join user room
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socket.on('connect', () => {
      socket.emit('join_user_room', userId);
    });

    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('unread_count', (count) => {
      setUnreadCount(count);
    });

    setSocketRef(socket);

    return () => {
      socket.emit('leave_user_room', userId);
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (notifId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${notifId}/read`, {}, { headers });
      setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/mark-all-read`, {}, { headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (notifId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/notifications/${notifId}`, { headers });
      setNotifications(prev => prev.filter(n => n._id !== notifId));
    } catch (err) { console.error(err); }
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, refetch: fetchNotifications };
};

export default useNotifications;
