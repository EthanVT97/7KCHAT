const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.get('/performance', userController.getStaffPerformance);

module.exports = router; 