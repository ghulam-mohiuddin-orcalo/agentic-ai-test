import { io, Socket } from 'socket.io-client';

// Socket.IO client singleton for real-time chat streaming
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5001', {
      autoConnect: false,
      auth: (cb) => {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        cb({ token });
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }

  return socket;
};

export const connectSocket = (token?: string) => {
  const socket = getSocket();

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket.connected) {
    socket.disconnect();
  }
};

export { socket };
