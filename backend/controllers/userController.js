const User = require('../models/User');
const Chat = require('../models/Chat');
const aiService = require('../services/aiService');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('platformAccess');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { username, email, platformAccess } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { 
                username, 
                email, 
                platformAccess,
                lastActive: new Date()
            },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.getStaffPerformance = async (req, res) => {
    try {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        const performance = await Chat.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'messages'
                }
            },
            {
                $group: {
                    _id: '$participants',
                    totalChats: { $sum: 1 },
                    totalMessages: { $sum: { $size: '$messages' } },
                    averageResponseTime: { $avg: '$responseTime' }
                }
            }
        ]);

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching performance', error: error.message });
    }
}; 