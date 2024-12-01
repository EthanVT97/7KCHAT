const Workflow = require('../models/Workflow');
const platformIntegrationService = require('../services/platformIntegrationService');

exports.createWorkflow = async (req, res) => {
    try {
        const { name, platformId, trigger, actions } = req.body;
        
        const workflow = await Workflow.create({
            name,
            platformId,
            trigger,
            actions
        });

        res.status(201).json(workflow);
    } catch (error) {
        res.status(500).json({ message: 'Error creating workflow', error: error.message });
    }
};

exports.executeWorkflow = async (req, res) => {
    try {
        const { workflowId } = req.params;
        const { context } = req.body;

        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        const result = await executeWorkflowActions(workflow, context);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error executing workflow', error: error.message });
    }
};

async function executeWorkflowActions(workflow, context) {
    const results = [];
    for (const action of workflow.actions) {
        try {
            switch (action.type) {
                case 'send_message':
                    const message = await platformIntegrationService.sendMessage(
                        workflow.platformId,
                        action.config.message,
                        context
                    );
                    results.push({ type: 'message', status: 'sent', id: message.id });
                    break;

                case 'assign_staff':
                    // Implement staff assignment logic
                    break;

                case 'tag_conversation':
                    // Implement conversation tagging
                    break;

                case 'escalate':
                    // Implement escalation logic
                    break;

                case 'api_call':
                    // Implement external API calls
                    break;
            }
        } catch (error) {
            results.push({ type: action.type, status: 'failed', error: error.message });
        }
    }
    return results;
} 