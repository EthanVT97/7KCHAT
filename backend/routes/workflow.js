const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/create', workflowController.createWorkflow);
router.post('/:workflowId/execute', workflowController.executeWorkflow);
router.get('/platform/:platformId', workflowController.getWorkflowsByPlatform);
router.put('/:workflowId/toggle', workflowController.toggleWorkflowStatus);

module.exports = router; 