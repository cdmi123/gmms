const Member = require('../models/Member');
const Round = require('../models/Round');
const Draw = require('../models/Draw');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const GoldStock = require('../models/GoldStock');
const Payment = require('../models/Payment');

exports.getStock = async (req, res) => {
    try {
        const stocks = await GoldStock.find();
        res.render('admin/stock', {
            title: 'Manage Stock',
            stocks
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postUpdateStock = async (req, res) => {
    try {
        const { itemName, quantity, weight } = req.body;
        await GoldStock.findOneAndUpdate(
            { itemName },
            { quantity, weight, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.redirect('/admin/stock');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getLogin = (req, res) => {
    res.render('admin/login', { title: 'Admin Login' });
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (admin && await bcrypt.compare(password, admin.password)) {
            req.session.isAdmin = true;
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const memberCount = await Member.countDocuments({ status: 'active' });
        const activeRound = await Round.findOne({ status: 'collecting' });
        const totalDrawsCompleted = await Draw.countDocuments();

        let pendingPaymentsCount = 0;
        let currentRoundCollected = 0;
        let membersOverview = [];

        if (activeRound) {
            pendingPaymentsCount = await Payment.countDocuments({ roundId: activeRound._id, status: 'pending' });
            const collectedPayments = await Payment.find({ roundId: activeRound._id, status: 'paid' });
            currentRoundCollected = collectedPayments.reduce((sum, p) => sum + p.amount, 0);
            membersOverview = await Payment.find({ roundId: activeRound._id }).populate('memberId').limit(10);
        }

        const allRounds = await Round.find();
        const totalCollectionAmount = allRounds.reduce((sum, r) => sum + r.totalCollection, 0);

        const allPaidPayments = await Payment.find({ status: 'paid' });
        const totalPaidAmount = allPaidPayments.reduce((sum, p) => sum + p.amount, 0);

        const recentDraws = await Draw.find().populate('winnerId').populate('roundId').sort({ drawDate: -1 }).limit(3);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                memberCount,
                pendingPaymentsCount,
                currentRoundCollected,
                totalDrawsCompleted,
                totalCollectionAmount,
                totalPaidAmount
            },
            activeRound,
            membersOverview: membersOverview.filter(m => m.memberId !== null),
            recentDraws
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
};

exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        const draws = await Draw.find().select('winnerId');
        const winnerIds = new Set(draws.map(d => d.winnerId ? d.winnerId.toString() : null));

        res.render('admin/members', {
            title: 'Manage Members',
            members,
            winnerIds
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postAddMember = async (req, res) => {
    try {
        const { name, phone } = req.body;
        await Member.create({ name, phone });
        req.io.emit('dashboardUpdate', { type: 'memberUpdate' });
        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postUpdateMember = async (req, res) => {
    try {
        const { id, name, phone, status } = req.body;
        await Member.findByIdAndUpdate(id, { name, phone, status });
        req.io.emit('dashboardUpdate', { type: 'memberUpdate' });
        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteMember = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        req.io.emit('dashboardUpdate', { type: 'memberUpdate' });
        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getReports = async (req, res) => {
    try {
        const rounds = await Round.find().sort({ roundNumber: 1 });
        res.render('admin/reports', {
            title: 'Financial Reports',
            rounds
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
