const Round = require('../models/Round');
const Draw = require('../models/Draw');
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const GoldStock = require('../models/GoldStock');

exports.getDashboard = async (req, res) => {
    try {
        const activeRound = await Round.findOne({ status: 'collecting' });
        const recentDraws = await Draw.find().populate('winnerId').populate('roundId').sort({ drawDate: -1 });
        const totalMembers = await Member.countDocuments({ status: 'active' });
        const stocks = await GoldStock.find();

        let stats = {
            perMemberAmount: 0,
            totalMembers: totalMembers,
            paidCount: 0,
            totalDrawsInRound: 0,
            totalCollectionAmount: 0,
            totalPaidAmount: 0,
            roundsCompleted: await Round.countDocuments({ status: 'completed' }),
            totalDrawsCompleted: await Draw.countDocuments()
        };

        if (activeRound) {
            stats.perMemberAmount = activeRound.perMemberAmount;
            stats.paidCount = await Payment.countDocuments({ roundId: activeRound._id, status: 'paid' });
            stats.totalDrawsInRound = await Draw.countDocuments({ roundId: activeRound._id });
            stats.totalCollectionAmount = activeRound.totalCollection;

            const paidPayments = await Payment.find({ roundId: activeRound._id, status: 'paid' });
            stats.totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        }

        const currentDraw = recentDraws.length > 0 ? recentDraws[0] : null;

        let payments = [];
        if (activeRound) {
            payments = await Payment.find({ roundId: activeRound._id }).populate('memberId');
        }

        res.render('user/dashboard', {
            title: 'User Dashboard',
            activeRound,
            recentDraws,
            stats,
            currentDraw,
            stocks,
            payments // Pass payments to view
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const activeRound = await Round.findOne({ status: 'collecting' });
        const recentDraws = await Draw.find().populate('winnerId').populate('roundId').sort({ drawDate: -1 });
        const totalMembers = await Member.countDocuments({ status: 'active' });
        const stocks = await GoldStock.find();

        let stats = {
            perMemberAmount: 0,
            totalMembers: totalMembers,
            paidCount: 0,
            totalDrawsInRound: 0,
            totalCollectionAmount: 0,
            totalPaidAmount: 0,
            roundsCompleted: await Round.countDocuments({ status: 'completed' }),
            totalDrawsCompleted: await Draw.countDocuments()
        };

        if (activeRound) {
            stats.perMemberAmount = activeRound.perMemberAmount;
            stats.paidCount = await Payment.countDocuments({ roundId: activeRound._id, status: 'paid' });
            stats.totalDrawsInRound = await Draw.countDocuments({ roundId: activeRound._id });
            stats.totalCollectionAmount = activeRound.totalCollection;

            const paidPayments = await Payment.find({ roundId: activeRound._id, status: 'paid' });
            stats.totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        }

        const currentDraw = recentDraws.length > 0 ? recentDraws[0] : null;

        let payments = [];
        if (activeRound) {
            payments = await Payment.find({ roundId: activeRound._id }).populate('memberId');
        }

        res.json({
            activeRound,
            recentDraws,
            stats,
            currentDraw,
            stocks,
            payments // Pass payments to API response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
