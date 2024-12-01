const ChatTemplate = require('../models/ChatTemplate');

exports.createTemplate = async (req, res) => {
    try {
        const { platformId, name, category, content, variables, tags, shortcut } = req.body;
        
        const template = await ChatTemplate.create({
            platformId,
            name,
            category,
            content,
            variables,
            tags,
            shortcut
        });

        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: 'Error creating template', error: error.message });
    }
};

exports.getTemplates = async (req, res) => {
    try {
        const { platformId, category } = req.query;
        const query = platformId ? { platformId } : {};
        if (category) query.category = category;

        const templates = await ChatTemplate.find(query);
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates', error: error.message });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const updateData = req.body;

        const template = await ChatTemplate.findByIdAndUpdate(
            templateId,
            updateData,
            { new: true }
        );

        res.json(template);
    } catch (error) {
        res.status(500).json({ message: 'Error updating template', error: error.message });
    }
}; 