const Round = require('../models/Round');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

exports.getRounds = async (req, res) => {
    try {
        const rounds = await Round.find().sort({ roundNumber: -1 });
        const members = await Member.find({ status: 'active' });
        const payments = await Payment.find().populate('memberId');
        res.render('admin/rounds', {
            title: 'Manage Rounds',
            rounds,
            members,
            payments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postCreateRound = async (req, res) => {
    try {
        const members = await Member.find({ status: 'active' });
        const memberCount = members.length;

        if (memberCount === 0) {
            return res.status(400).send('No active members to start a round.');
        }

        // Input is "Total Collection Target" (targetAmount)
        const { targetAmount, totalCollection } = req.body;

        // Destructure targetAmount, but also check totalCollection for fallback
        // Since input name in EJS is targetAmount, we use that.
        let targetTotalInput = parseFloat(targetAmount) || parseFloat(totalCollection);

        if (isNaN(targetTotalInput) || targetTotalInput <= 0) {
            return res.status(400).send('Invalid Collection Amount');
        }

        // Logic: 
        // 1. Calculate Per Member Raw: Target / Count
        // 2. Round UP to nearest 10: Math.ceil(Raw / 10) * 10
        let rawPerMember = targetTotalInput / memberCount;
        let perMemberAmount = Math.ceil(rawPerMember / 10) * 10;

        // 3. Recalculate Actual Total Collection based on rounded per member amount
        const actualTotalCollection = perMemberAmount * memberCount;

        // 4. Calculate Extra Amount (The difference between what we collect and the target)
        const extraAmount = actualTotalCollection - targetTotalInput;

        // Handle Carry Forward (for stats/reference)
        const lastRound = await Round.findOne().sort({ roundNumber: -1 });

        // Validation: Previous round must be COMPLETED
        if (lastRound && lastRound.status !== 'completed') {
            return res.status(400).send('Cannot start new round: Previous round is still active. Please finish the lucky draw first.');
        }

        let carryForward = (lastRound && lastRound.extraAmount) ? lastRound.extraAmount : 0;

        const newRound = await Round.create({
            roundNumber: lastRound ? lastRound.roundNumber + 1 : 1,
            totalCollection: actualTotalCollection, // We store what we actually collect
            perMemberAmount,
            extraAmount,
            carryForwardFromPrevious: carryForward,
            status: 'collecting'
        });

        // Initialize payments for all active members
        const payments = members.map(m => ({
            memberId: m._id,
            roundId: newRound._id,
            amount: perMemberAmount,
            status: 'pending'
        }));
        await Payment.insertMany(payments);

        req.io.emit('dashboardUpdate', { type: 'roundUpdate' });
        res.redirect('/admin/rounds');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postMarkPaid = async (req, res) => {
    try {
        const { paymentId } = req.body;
        await Payment.findByIdAndUpdate(paymentId, { status: 'paid', paidAt: Date.now() });
        req.io.emit('dashboardUpdate', { type: 'paymentUpdate' });
        res.redirect('back');
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error');
    }
};

exports.postApiMarkPaid = async (req, res) => {
    try {
        const { paymentId } = req.body;
        await Payment.findByIdAndUpdate(paymentId, { status: 'paid', paidAt: Date.now() });
        req.io.emit('dashboardUpdate', { type: 'paymentUpdate' });
        res.json({ success: true, message: 'Payment marked as paid' });
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
