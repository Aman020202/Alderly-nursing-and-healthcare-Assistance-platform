import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const useWebSocket = (bookingId) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const [newNote, setNewNote] = useState(null);

  useEffect(() => {
    if (!bookingId) return;

    // Connect to socket server
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
      // Join booking-specific room
      socketRef.current.emit('join_booking_room', bookingId);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for real-time events
    socketRef.current.on('status_update', (data) => {
      setStatusUpdate(data);
    });

    socketRef.current.on('new_care_note', (data) => {
      setNewNote(data);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_booking_room', bookingId);
        socketRef.current.disconnect();
      }
    };
  }, [bookingId]);

  return { connected, statusUpdate, newNote };
};

export default useWebSocket;
