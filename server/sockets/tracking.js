import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a room specific to a booking (for tracking)
    socket.on('join_booking_room', (bookingId) => {
      socket.join(bookingId);
      console.log(`Socket ${socket.id} joined booking room: ${bookingId}`);
    });

    socket.on('leave_booking_room', (bookingId) => {
      socket.leave(bookingId);
    });

    // Join a user-specific room (for notifications)
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user room: user_${userId}`);
    });

    socket.on('leave_user_room', (userId) => {
      socket.leave(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
