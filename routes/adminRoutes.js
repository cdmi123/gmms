const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const roundController = require('../controllers/roundController');
const drawController = require('../controllers/drawController');

// Middleware to check admin session
const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin');
    }
};

router.get('/', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/login', (req, res) => res.redirect('/admin'));
router.get('/dashboard', isAdmin, adminController.getDashboard);
router.get('/members', isAdmin, adminController.getMembers);
router.post('/members/add', isAdmin, adminController.postAddMember);
router.post('/members/update', isAdmin, adminController.postUpdateMember);
router.get('/members/delete/:id', isAdmin, adminController.deleteMember);

// Rounds
router.get('/rounds', isAdmin, roundController.getRounds);
router.post('/rounds/create', isAdmin, roundController.postCreateRound);
router.post('/rounds/pay', isAdmin, roundController.postMarkPaid);

// Draws
router.get('/draws', isAdmin, drawController.getDraws);
router.post('/draws/start', isAdmin, drawController.postStartDraw);

// Stock
router.get('/stock', isAdmin, adminController.getStock);
router.post('/stock/update', isAdmin, adminController.postUpdateStock);

// Reports
router.get('/reports', isAdmin, adminController.getReports);

router.get('/logout', adminController.logout);

module.exports = router;
