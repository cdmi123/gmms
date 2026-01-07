const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const roundController = require('../controllers/roundController');

router.get('/dashboard', userController.getDashboard);
router.get('/api/dashboard-data', userController.getDashboardData);
router.post('/api/pay', roundController.postApiMarkPaid);

module.exports = router;
