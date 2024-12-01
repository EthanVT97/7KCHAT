const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        // Join user to their chat rooms
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`${socket.user.username} joined chat: ${chatId}`);
        });

        // Handle typing status
        socket.on('typing_start', (chatId) => {
            socket.to(chatId).emit('user_typing', {
                userId: socket.user._id,
                username: socket.user.username
            });
        });

        socket.on('typing_end', (chatId) => {
            socket.to(chatId).emit('user_stopped_typing', {
                userId: socket.user._id,
                username: socket.user.username
            });
        });

        // Handle user presence
        socket.on('disconnect', async () => {
            await User.findByIdAndUpdate(socket.user._id, {
                lastActive: new Date()
            });
            console.log(`User disconnected: ${socket.user.username}`);
        });
    });
}; 