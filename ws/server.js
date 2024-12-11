const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

// Configuration object for better maintainability
const SERVER_CONFIG = {
    PORT: process.env.PORT || 3001, CORS_OPTIONS: {
        origin: ['http://localhost:3000', 'https://mitra-blush.vercel.app'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
};

// Create HTTP server
const httpServer = http.createServer();

// Initialize Socket.IO with improved CORS configuration
const io = new Server(httpServer, {
    cors: SERVER_CONFIG.CORS_OPTIONS, // Add additional security configurations
    pingTimeout: 60000, // Increased timeout for more stable connections
    connectionStateRecovery: {
        // the backup duration, in milliseconds
        maxDisconnectionDuration: 2 * 60 * 1000, // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
});

// Middleware for authentication and logging
io.use((socket, next) => {
    const customUserId = socket.handshake.auth.userId;

    // Validate user ID
    if (!customUserId) {
        return next(new Error('Authentication error: No user ID provided'));
    }

    // Attach user ID to socket for later use
    socket.userId = customUserId;
    next();
});

io.on('connection', (socket) => {
    const customUserId = socket.userId;

    console.log(`Socket connected: 
        - Socket ID: ${socket.id}
        - User ID: ${customUserId}`);

    // Room joining with error handling
    socket.on('join_room', (roomId) => {
        try {
            // Validate room ID
            if (!roomId) {
                throw new Error('Invalid room ID');
            }

            socket.join(roomId);
            console.log(`User ${customUserId} joined room ${roomId}`);
        } catch (error) {
            console.error(`Room join error: ${error.message}`);
            socket.emit('error', {message: error.message});
        }
    });

    // Room leaving with error handling
    socket.on('leave_room', (roomId) => {
        try {
            // Validate room ID
            if (!roomId) {
                throw new Error('Invalid room ID');
            }

            socket.leave(roomId);
            console.log(`User ${customUserId} left room ${roomId}`);
        } catch (error) {
            console.error(`Room leave error: ${error.message}`);
            socket.emit('error', {message: error.message});
        }
    });

    // Message sending with improved error handling and logging
    socket.on('send_msg', (data) => {
        try {
            // Validate required message properties
            if (!data || !data.roomId) {
                throw new Error('Invalid message data');
            }

            const {roomId} = data;
            console.log('Sending message:', JSON.stringify(data, null, 2));

            // Broadcast to all sockets in the room except the sender
            socket.to(roomId).emit('receive_msg', data);
        } catch (error) {
            console.error(`Message send error: ${error.message}`);
            socket.emit('error', {message: error.message});
        }
    });

    // Message updating with improved error handling
    socket.on('update_msg', (roomId, messageId, content) => {
        try {
            // Validate input parameters
            if (!roomId || !messageId) {
                throw new Error('Invalid update parameters');
            }

            console.log(`Updating message: 
                - Room: ${roomId}
                - Message ID: ${messageId}
                - Content: ${content}`);

            // Broadcast update to all sockets in the room except the sender
            socket.to(roomId).emit('update_msg', messageId, content);
        } catch (error) {
            console.error(`Message update error: ${error.message}`);
            socket.emit('error', {message: error.message});
        }
    });

    // Improved disconnect handling
    socket.on('disconnect', (reason) => {
        console.log(`User ${customUserId} disconnected from the websocket: ${reason}`);
    });
});

// Error handling for the server
httpServer.on('error', (error) => {
    console.error('HTTP Server Error:', error);
});

// Start the server
httpServer.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Socket.io server is running on port ${SERVER_CONFIG.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});