const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

const httpServer = http.createServer()

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000', methods: ['GET', 'POST'], allowedHeaders: [], credentials: true,
    }
});

io.on('connection', (socket) => {
    // Extract the custom user ID from the authentication
    const customUserId = socket.handshake.auth.userId;
    if (!!!customUserId) {
        socket.disconnect(true);
        return;
    }
    console.log(`Socket connected: 
        - Socket ID: ${socket.id}
        - User ID: ${customUserId}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${customUserId} joined room ${roomId}`);
    });
    socket.on('leave_room', (selectedGroupID, selectedChannelNum) => {
        if (selectedChannelNum && selectedGroupID) {
            const roomId = selectedGroupID.toString() + selectedChannelNum.toString()
            socket.leave(roomId);
            console.log(`User ${customUserId} left room ${roomId}`);
        }
    });

    socket.on('send_msg', (data) => {
        // Use the roomId from the data object
        const roomToEmitTo = data.roomId;
        console.log(data)
        // Broadcast to all sockets in the room except the sender
        socket.to(roomToEmitTo).emit('receive_msg', data);
    });

    socket.on('update_msg', (room_id, message_id, content) => {
        // Use the roomId from the data object
        console.log(`Got a request to update ${message_id} with content ${null}`)
        // Broadcast to all sockets in the room except the sender
        if (!!content)
            socket.to(room_id).emit('update_msg', message_id, content);
        else socket.to(room_id).emit('delete_msg', message_id)
    })


    socket.on('disconnect', () => {
        console.log(`User ${customUserId} disconnected from the ws`);
    })
});


const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`)
})