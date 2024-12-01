const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/create', templateController.createTemplate);
router.get('/list', templateController.getTemplates);
router.put('/:templateId', templateController.updateTemplate);
router.get('/category/:category', templateController.getTemplates);

module.exports = router; 